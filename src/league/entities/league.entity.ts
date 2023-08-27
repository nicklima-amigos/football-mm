import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from '../../base-game/entities/base-game.entity';

@Entity()
export class League {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Match, (match) => match.league)
  matches: Match[];
}
