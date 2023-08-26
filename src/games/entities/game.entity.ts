import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Goal } from '../../goal/entities/goal.entity';
import { Foul } from '../../foul/entities/foul.entity';
import { Offside } from '../../offside/entities/offside.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Player, (player) => player.homeGames)
  @JoinTable()
  homeTeam: Player[];

  @ManyToMany(() => Player, (player) => player.awayGames)
  @JoinTable()
  awayTeam: Player[];

  @OneToMany(() => Goal, (goal) => goal.game)
  goals: Goal[];

  @OneToMany(() => Foul, (foul) => foul.game)
  fouls: Foul[];

  @OneToMany(() => Offside, (offside) => offside.game)
  offsides: Offside[];

  @Column()
  scheduledTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
