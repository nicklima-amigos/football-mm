import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateGameDto {
  @IsArray()
  @IsNotEmpty()
  awayTeamPlayerIds: number[];

  @IsArray()
  @IsNotEmpty()
  homeTeamPlayerIds: number[];
}
