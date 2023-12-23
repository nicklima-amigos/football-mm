import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Foul } from '../../foul/entities/foul.entity';
import { Goal } from '../../goal/entities/goal.entity';
import { Player } from '../../players/entities/player.entity';
import { League } from '../../league/entities/league.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Goal, (goal) => goal.game)
  goals: Goal[];

  @OneToMany(() => Foul, (foul) => foul.game)
  fouls: Foul[];

  @Column()
  scheduledTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Player, (player) => player.homeGames)
  @JoinTable()
  homeTeam: Player[];

  @ManyToMany(() => Player, (player) => player.awayGames)
  @JoinTable()
  awayTeam: Player[];

  @ManyToOne(() => League, (league) => league.matches, { nullable: true })
  league?: League;
}
