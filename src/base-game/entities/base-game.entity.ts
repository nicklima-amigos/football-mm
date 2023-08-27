import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { Foul } from '../../foul/entities/foul.entity';
import { Goal } from '../../goal/entities/goal.entity';
import { Offside } from '../../offside/entities/offside.entity';
import { Player } from '../../players/entities/player.entity';
import { League } from '../../league/entities/league.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class BaseGame {
  @PrimaryGeneratedColumn()
  id: number;

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

@ChildEntity()
export class Game extends BaseGame {
  @ManyToMany(() => Player, (player) => player.homeGames)
  @JoinTable()
  homeTeam: Player[];

  @ManyToMany(() => Player, (player) => player.awayGames)
  @JoinTable()
  awayTeam: Player[];
}

@ChildEntity()
export class Match extends BaseGame {
  @ManyToOne(() => Team, (team) => team.matches)
  homeTeam: Team;

  @ManyToOne(() => Team, (team) => team.matches)
  awayTeam: Team;

  @ManyToOne(() => League, (league) => league.matches)
  league: League;
}
