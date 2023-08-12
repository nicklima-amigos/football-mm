import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
  @IsNumber()
  @IsOptional()
  elo?: number;

  @IsNumber()
  @IsOptional()
  teamId?: number;
}
