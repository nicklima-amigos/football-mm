import { ApiProperty } from '@nestjs/swagger';
import { Card } from '../entities/foul.entity';
import { PlayerDto } from '../../players/dto/player.dto';
import { GameDto } from '../../games/dto/game.dto';

export class FoulDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: 'enum', enum: Card })
  card: Card;

  @ApiProperty({ type: PlayerDto })
  offendingPlayer: PlayerDto;

  @ApiProperty({ type: PlayerDto, nullable: true })
  victimPlayer?: PlayerDto;

  @ApiProperty()
  minute: number;

  @ApiProperty({ type: GameDto })
  game: GameDto;
}
