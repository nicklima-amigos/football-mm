import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Player, (player) => player.user, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  player: Player;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
