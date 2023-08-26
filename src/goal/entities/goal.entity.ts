import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Game } from '../../games/entities/game.entity';

enum Team {
  Home = 'home',
  Away = 'away',
}

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.goals)
  player: Player;

  @ManyToOne(() => Player, (player) => player.assists)
  assist: Player;

  @Column()
  minute: number;

  @Column({
    type: 'enum',
    enum: Team,
  })
  team: Team;

  @ManyToOne(() => Game, (game) => game.goals)
  game: Game;

  @Column({ default: true })
  valid: boolean;
}
