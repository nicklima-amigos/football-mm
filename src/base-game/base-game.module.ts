import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseGame } from './entities/base-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BaseGame])],
})
export class BaseGameModule {}
