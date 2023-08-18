import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Player, (player) => player.games)
  homeTeam: Player[];

  @ManyToMany(() => Player, (player) => player.games)
  awayTeam: Player[];

  @Column({ default: 0 })
  homeTeamScore: number;

  @Column({ default: 0 })
  awayTeamScore: number;
}
