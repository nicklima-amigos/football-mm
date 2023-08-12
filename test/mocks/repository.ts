import { Provider } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';

export type RepositoryMock<T> = {
  find: jest.Mock<Promise<T[]>>;
  findOne: jest.Mock<Promise<T | undefined>>;
  create: jest.Mock<Promise<T>>;
  save: jest.Mock<Promise<T | T[]>>;
  delete: jest.Mock<Promise<DeleteResult>>;
  remove: jest.Mock<Promise<T>>;
  update: jest.Mock<Promise<UpdateResult>>;
};

export const getRepositoryMock = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
});

export const getRepositoryMockProvider = (entity: any): Provider => ({
  provide: entity,
  useValue: getRepositoryMock(),
});
