import {
  Column,
  Entity,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @OneToOne(() => User)
  @JoinTable()
  user: User;
}
