import { Module } from '@nestjs/common';
import { OffsideService } from './offside.service';
import { OffsideController } from './offside.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offside } from './entities/offside.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offside])],
  controllers: [OffsideController],
  providers: [OffsideService],
})
export class OffsideModule {}
