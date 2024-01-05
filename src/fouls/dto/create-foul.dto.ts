import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Card } from '../entities/foul.entity';

export class CreateFoulDto {
  @ApiProperty({ type: 'enum', enum: Card })
  @IsEnum(Card)
  card: Card;

  @IsNumber()
  @ApiProperty()
  offenderId: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  victimId: number;

  @IsNumber()
  @ApiProperty()
  gameId: number;

  @IsNumber()
  @Min(0)
  @Max(200)
  @ApiProperty()
  minute: number;
}
