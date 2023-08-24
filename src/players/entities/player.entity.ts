import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Team } from '../../teams/entities/team.entity';
import { User } from '../../user/entities/user.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
