import { League } from '../../league/entities/league.entity';
import { Team } from '../../teams/entities/team.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, (team) => team.matches)
  homeTeam: Team;

  @ManyToOne(() => Team, (team) => team.matches)
  awayTeam: Team;

  @ManyToOne(() => League, (league) => league.matches)
  league: League;

  @Column({ default: 0 })
  homeTeamScore: number;

  @Column({ default: 0 })
  awayTeamScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
