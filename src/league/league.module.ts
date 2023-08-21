import { Module } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';

@Module({
  controllers: [LeagueController],
  providers: [LeagueService]
})
export class LeagueModule {}
