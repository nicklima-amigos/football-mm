import { Module } from '@nestjs/common';
import { FoulService } from './foul.service';
import { FoulController } from './foul.controller';

@Module({
  controllers: [FoulController],
  providers: [FoulService],
})
export class FoulModule {}
