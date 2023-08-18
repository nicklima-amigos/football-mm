import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateGameDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  awayTeamPlayerIds: number[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  homeTeamPlayerIds: number[];
}
