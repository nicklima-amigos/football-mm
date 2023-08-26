import { Module } from '@nestjs/common';
import { FoulService } from './foul.service';
import { FoulController } from './foul.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foul } from './entities/foul.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foul])],
  controllers: [FoulController],
  providers: [FoulService],
})
export class FoulModule {}
