import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsDateString } from 'class-validator';

export class CreateGameDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  awayTeamPlayerIds: number[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  homeTeamPlayerIds: number[];

  @ApiProperty()
  @IsDateString()
  scheduledTime: Date;
}
