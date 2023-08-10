import { Module } from '@nestjs/common';
import { PlayerService } from './players.service';
import { PlayerController } from './players.controller';
import { DatabaseModule } from 'src/database/database.module';
import { playersRepository } from './players.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PlayerController],
  providers: [PlayerService, playersRepository],
})
export class PlayerModule {}
