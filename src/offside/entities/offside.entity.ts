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

@Entity()
export class Offside {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.offsides)
  player: Player;

  @ManyToOne(() => BaseGame, (game) => game.offsides)
  game: BaseGame;

  @Column()
  minute: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
