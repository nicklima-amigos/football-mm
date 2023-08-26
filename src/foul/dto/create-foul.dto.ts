import { ApiProperty } from '@nestjs/swagger';
import { Card } from '../entities/foul.entity';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateFoulDto {
  @ApiProperty({ type: 'enum', enum: Card })
  @IsEnum({ entity: Card })
  card: Card;

  @IsNumber()
  @ApiProperty()
  offenderId: number;

  @IsNumber()
  @ApiProperty()
  victimId: number;

  @IsNumber()
  @ApiProperty()
  gameId: number;

  @IsNumber()
  @ApiProperty()
  minute: number;
}
