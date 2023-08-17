import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGameDto {
  @IsNumber()
  @IsOptional()
  homeTeamScore?: number;

  @IsNumber()
  @IsOptional()
  awayTeamScore?: number;
}
