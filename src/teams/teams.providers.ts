import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Team } from './entities/team.entity';

export const teamsRepository: Provider = {
  provide: 'TEAMS_REPOSITORY',
  useFactory: async (dataSource: DataSource) => dataSource.getRepository(Team),
  inject: ['DATABASE_CONNECTION'],
};
