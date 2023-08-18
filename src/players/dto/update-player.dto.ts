import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  elo?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  teamId?: number;
}
