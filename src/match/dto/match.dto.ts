import { ApiProperty } from '@nestjs/swagger';
import { TeamDto } from '../../teams/dto/team.dto';

export class MatchDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: TeamDto })
  homeTeam: TeamDto;

  @ApiProperty({ type: TeamDto })
  awayTeam: TeamDto;

  @ApiProperty()
  homeTeamScore: number;

  @ApiProperty()
  awayTeamScore: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}