import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Player, (player) => player.games)
  homeTeam: Player[];

  @ManyToMany(() => Player, (player) => player.games)
  awayTeam: Player[];
}
