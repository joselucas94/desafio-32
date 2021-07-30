import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("game")
      .where(`game.title ilike '%${param}%'`)
      .getMany();

      
  }

  async countAllGames(): Promise<[{ count: string }]> {
     return this.repository.query("SELECT COUNT(id)  FROM games  WHERE id IS NOT NULL ");

     
  }

  async findUsersByGameId(id: string): Promise<User[]> {
     return await this.repository.createQueryBuilder("game")
      .innerJoinAndSelect("game.users", "user")
      .where("game.id = :id", { id })
      .getOneOrFail().then(game => {
        return game.users
      });   
    
  }
}
