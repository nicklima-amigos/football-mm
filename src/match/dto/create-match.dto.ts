import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty()
  @IsNotEmpty()
  homeTeamId: number;

  @ApiProperty()
  @IsNotEmpty()
  awayTeamId: number;
}
