import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { BaseGame } from '../../base-game/entities/base-game.entity';

export enum TeamEnum {
  Home = 'home',
  Away = 'away',
}

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.goals)
  player: Player;

  @ManyToOne(() => Player, (player) => player.assists, { nullable: true })
  assist?: Player;

  @Column()
  minute: number;

  @Column({
    type: 'enum',
    enum: TeamEnum,
  })
  team: TeamEnum;

  @ManyToOne(() => BaseGame, (game) => game.goals)
  game: BaseGame;

  @Column({ default: true })
  valid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
