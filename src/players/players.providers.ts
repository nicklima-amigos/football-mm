import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Player } from './entities/player.entity';

export const playersRepository: Provider = {
  provide: 'PLAYERS_REPOSITORY',
  useFactory: async (dataSource: DataSource) =>
    dataSource.getRepository(Player),
  inject: ['DATABASE_CONNECTION'],
};
