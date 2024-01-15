import { ApiProperty } from '@nestjs/swagger';
import { Game } from '../../games/entities/game.entity';
import { GameDto } from '../../games/dto/game.dto';

export class LeagueDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: GameDto, isArray: true })
  matches: Game[];
}
