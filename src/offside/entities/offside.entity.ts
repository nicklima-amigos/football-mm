import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Game } from '../../games/entities/game.entity';

@Entity()
export class Offside {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.offsides)
  player: Player;

  @ManyToOne(() => Game, (game) => game.offsides)
  game: Game;

  @Column()
  minute: number;
}
