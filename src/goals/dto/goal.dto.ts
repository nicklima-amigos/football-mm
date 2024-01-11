import { GameDto } from '../../games/dto/game.dto';
import { PlayerDto } from '../../players/dto/player.dto';
import { TeamEnum } from '../entities/goal.entity';

export class GoalDto {
  id: number;

  player: PlayerDto;

  assist?: PlayerDto;

  minute: number;

  team: TeamEnum;

  game: GameDto;

  valid: boolean;

  createdAt: Date;

  updatedAt: Date;
}
