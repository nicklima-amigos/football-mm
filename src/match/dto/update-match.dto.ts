import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMatchDto } from './create-match.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  homeTeamScore?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  awayTeamScore?: number;
}
