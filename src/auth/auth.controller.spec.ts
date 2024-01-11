import { NestApplication } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { fakeCreateUserDto } from '../../test/factories/users.factory';
import { TypeOrmTestModule } from '../../test/typeorm-test-module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { jwtConstants } from './constants';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: UsersService;
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
    userService = module.get<UsersService>(UsersService);
    app = module.createNestApplication();

    request = supertest(app.getHttpServer());

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token when given valid credentials', async () => {
      const user = fakeCreateUserDto();
      await userService.create({ ...user });

      const response = await request.post('/auth/signin').send({
        usernameOrEmail: user.username,
        password: user.password,
      });

      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('token');
    });

    it('should return a 401 when given invalid credentials', async () => {
      const user = fakeCreateUserDto();
      await userService.create({ ...user });

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

  describe('authorize', () => {
    it('should return a user when given a valid token', async () => {
      const user = fakeCreateUserDto();
      await userService.create({ ...user });

      const { token } = await controller.signIn({
        usernameOrEmail: user.username,
        password: user.password,
      });
      const response = await request
        .get('/auth/authorize')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('email');
    });

    it('should return a 403 when given an invalid token', async () => {
      const { status } = await request
        .get('/auth/authorize')
        .set('Authorization', `Bearer invalid`);

      expect(status).toEqual(403);
    });
  });
});
