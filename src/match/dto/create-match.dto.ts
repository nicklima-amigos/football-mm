import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty()
  @IsNumber()
  homeTeamId: number;

  @ApiProperty()
  @IsNumber()
  awayTeamId: number;
}
