import { IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  playerIds: number[];
}
