import { ApiProperty } from '@nestjs/swagger';
import { PlayerDto } from '../../players/dto/player.dto';

export class TeamDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  elo: number;

  @ApiProperty({ type: [PlayerDto] })
  players: PlayerDto[];

  @ApiProperty()
  createdAt: Date;
}
