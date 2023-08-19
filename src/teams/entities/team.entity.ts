import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Match } from '../../match/entities/match.entity';

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

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
