import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(@InjectRepository(Game) private repository: Repository<Game>) {}

  async create(createGameDto: CreateGameDto) {
    const homeTeam = await Promise.all(
      createGameDto.awayTeamPlayerIds.map((id) => {
        return this.findOne(id);
      }),
    );
    const awayTeam = await Promise.all(
      createGameDto.homeTeamPlayerIds.map((id) => {
        return this.findOne(id);
      }),
    );
    return this.repository.create({ homeTeam, awayTeam });
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.repository.update({ id }, updateGameDto);
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    return this.repository.remove(player);
  }
}
