import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @IsNumber()
  @IsOptional()
  elo?: number;
}
