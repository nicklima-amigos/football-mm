import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const databaseProvider: Provider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async () => {
    const {
      DATABASE_HOST,
      DATABASE_PORT,
      DATABASE_USER,
      DATABASE_PASSWORD,
      DATABASE_NAME,
    } = process.env;
    const dataSource = new DataSource({
      type: 'postgres',
      host: DATABASE_HOST,
      port: +DATABASE_PORT,
      username: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      synchronize: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    });
    return dataSource.initialize();
  },
};
