import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { fakeUser } from '../../test/factories/user.factory';
import { hash } from 'argon2';
import { NestApplication } from '@nestjs/core';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: UserService;
  let userRepository: Repository<User>;
  let app: NestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: getRepositoryMock<User>(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    app = module.createNestApplication();

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token when given valid credentials', async () => {
      const user = fakeUser();
      jest
        .spyOn(userService, 'findOneByUsernameOrEmail')
        .mockResolvedValueOnce({
          ...user,
          password: await hash(user.password),
        });

      const response = await supertest(app.getHttpServer())
        .post('/auth/signin')
        .send({
          usernameOrEmail: user.username,
          password: user.password,
        });

      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('token');
    });

    it('should return a 401 when given invalid credentials', async () => {
      const user = fakeUser();
      jest
        .spyOn(userService, 'findOneByUsernameOrEmail')
        .mockResolvedValueOnce({
          ...user,
          password: await hash(user.password),
        });

      const response = await supertest(app.getHttpServer())
        .post('/auth/signin')
        .send({
          usernameOrEmail: user.username,
          password: 'invalid',
        });

      expect(response.status).toEqual(401);
    });

    it('should return a 401 when given a non existing username or email', async () => {
      jest
        .spyOn(userService, 'findOneByUsernameOrEmail')
        .mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .post('/auth/signin')
        .send({
          usernameOrEmail: 'invalid',
          password: 'invalid',
        });

      expect(response.status).toEqual(401);
    });
  });
});
