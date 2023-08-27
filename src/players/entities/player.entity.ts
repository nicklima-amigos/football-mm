import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from '../../base-game/entities/base-game.entity';
import { Team } from '../../teams/entities/team.entity';
import { User } from '../../user/entities/user.entity';
import { Goal } from '../../goal/entities/goal.entity';
import { Foul } from '../../foul/entities/foul.entity';
import { Offside } from '../../offside/entities/offside.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.player)
  user?: User;

  @Column()
  name: string;

  @Column()
  birthDate: Date;

  @Column()
  position: string;

  @Column({ default: 1000 })
  elo: number;

  @ManyToMany(() => Game, (game) => game.homeTeam)
  homeGames: Game[];

  @ManyToMany(() => Game, (game) => game.awayTeam)
  awayGames: Game[];

  @ManyToOne(() => Team, (team) => team.players, { nullable: true })
  team?: Team;

  @OneToMany(() => Goal, (goal) => goal.player)
  goals: Goal[];

  @OneToMany(() => Goal, (goal) => goal.assist)
  assists: Goal[];

  @OneToMany(() => Foul, (foul) => foul.offendingPlayer)
  foulsGiven: Foul[];

  @OneToMany(() => Foul, (foul) => foul.victimPlayer)
  foulsTaken: Foul[];

  @OneToMany(() => Offside, (offside) => offside.player)
  offsides: Offside[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
