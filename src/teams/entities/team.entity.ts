import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Match } from '../../match/entities/match.entity';
import { League } from '../../league/entities/league.entity';
import { LeagueTeam } from '../../league/entities/league-team.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1000 })
  elo: number;

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];

  @OneToMany(() => Match, (match) => match.homeTeam)
  matches?: Match[];

  @OneToMany(() => LeagueTeam, (teamLeagues) => teamLeagues.team)
  teamLeagues?: League[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
