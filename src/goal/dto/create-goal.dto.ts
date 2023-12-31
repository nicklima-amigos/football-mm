import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TeamEnum } from '../entities/goal.entity';

export class CreateGoalDto {
  @ApiProperty()
  @IsNumber()
  authorPlayerId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  assistPlayerId?: number;

  @ApiProperty()
  @IsNumber()
  minute: number;

  @ApiProperty()
  @IsNumber()
  gameId: number;

  @ApiProperty()
  @IsEnum(TeamEnum)
  team: TeamEnum;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  valid? = true;
}
