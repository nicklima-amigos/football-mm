import { ApiProperty } from '@nestjs/swagger';
import { PlayerDto } from '../../players/dto/player.dto';

export class GameDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [PlayerDto] })
  homeTeam: PlayerDto[];

  @ApiProperty({ type: [PlayerDto] })
  awayTeam: PlayerDto[];

  @ApiProperty()
  homeTeamScore: number;

  @ApiProperty()
  awayTeamScore: number;

  @ApiProperty()
  scheduledTime: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
