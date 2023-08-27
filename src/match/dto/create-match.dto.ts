import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty()
  @IsNumber()
  homeTeamId: number;

  @ApiProperty()
  @IsNumber()
  awayTeamId: number;

  @ApiProperty()
  @IsDateString()
  scheduledTime: Date;

  @ApiProperty()
  @IsNumber()
  leagueId: number;
}
