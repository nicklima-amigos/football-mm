import { Provider } from '@nestjs/common';
import { Repository } from 'typeorm';

export const repositoryMock: Repository<any> = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
} as any;

export const getRepositoryMockProvider = (entity: any): Provider => ({
  provide: entity,
  useValue: repositoryMock,
});
