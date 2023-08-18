import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGameDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  homeTeamScore?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  awayTeamScore?: number;
}
