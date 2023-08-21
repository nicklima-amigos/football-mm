import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { League } from './league.entity';

@Entity()
export class LeagueTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, (team) => team.teamLeagues)
  team: Team;

  @ManyToOne(() => League, (league) => league.leagueTeams)
  league: League;

  @Column({ default: 0 })
  points: number;
}
