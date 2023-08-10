import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Game } from './entities/game.entity';

export const gamesRepository: Provider = {
  provide: 'GAMES_REPOSITORY',
  useFactory: async (dataSource: DataSource) => dataSource.getRepository(Game),
  inject: ['DATABASE_CONNECTION'],
};
