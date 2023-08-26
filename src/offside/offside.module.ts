import { Module } from '@nestjs/common';
import { OffsideService } from './offside.service';
import { OffsideController } from './offside.controller';

@Module({
  controllers: [OffsideController],
  providers: [OffsideService],
})
export class OffsideModule {}
