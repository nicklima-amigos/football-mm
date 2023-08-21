import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LeagueTeam } from './league-team.entity';
import { Match } from '../../match/entities/match.entity';

@Entity()
export class League {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => LeagueTeam, (leagueTeam) => leagueTeam.league)
  leagueTeams: LeagueTeam[];

  @OneToMany(() => Match, (match) => match.league)
  matches: Match[];
}
