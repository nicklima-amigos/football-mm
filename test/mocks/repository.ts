import { Provider } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';

export type RepositoryMock<T> = {
  find: jest.Mock<Promise<T[]>>;
  findOne: jest.Mock<Promise<T | undefined>>;
  create: jest.Mock<T>;
  save: jest.Mock<Promise<T | T[]>>;
  delete: jest.Mock<Promise<DeleteResult>>;
  remove: jest.Mock<Promise<T>>;
  update: jest.Mock<Promise<UpdateResult>>;
  createQueryBuilder: jest.Mock<any>;
};

export const getRepositoryMock = <T>(): RepositoryMock<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(),
});

export const getRepositoryMockProvider = (entity: any): Provider => ({
  provide: entity,
  useValue: getRepositoryMock(),
});
