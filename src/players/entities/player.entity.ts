import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  birthDate: Date;

  @Column()
  position: string;

  @Column({ default: 1000 })
  elo: number;

  @ManyToMany(() => Game, (game) => game.homeTeam)
  games: Game[];

  @ManyToOne(() => Team, (team) => team.players, { nullable: true })
  team?: Team;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
