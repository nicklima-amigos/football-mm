import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';

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

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
