import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Player, (player) => player.homeGames)
  homeTeam: Player[];

  @ManyToMany(() => Player, (player) => player.awayGames)
  awayTeam: Player[];

  @Column({ default: 0 })
  homeTeamScore: number;

  @Column({ default: 0 })
  awayTeamScore: number;

  @Column()
  scheduledTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
