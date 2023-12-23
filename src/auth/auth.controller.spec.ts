import { NestApplication } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import * as supertest from 'supertest';
import { fakeUser } from '../../test/factories/user.factory';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { jwtConstants } from './constants';
import { TypeOrmTestModule } from '../../test/typeorm-test-module';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: UserService;
  let app: NestApplication;

  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '1d' },
        }),
        TypeOrmTestModule,
        AuthModule,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    app = module.createNestApplication();

    request = supertest(app.getHttpServer());

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
          password: await hash(user.password, 10),
        });

      const response = await request.post('/auth/signin').send({
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
          password: await hash(user.password, 10),
        });

      const response = await request.post('/auth/signin').send({
        usernameOrEmail: user.username,
        password: 'invalid',
      });

      expect(response.status).toEqual(401);
    });

    it('should return a 401 when given a non existing username or email', async () => {
      jest
        .spyOn(userService, 'findOneByUsernameOrEmail')
        .mockResolvedValueOnce(null);

      const response = await request.post('/auth/signin').send({
        usernameOrEmail: 'invalid',
        password: 'invalid',
      });

      expect(response.status).toEqual(401);
    });
  });
});
