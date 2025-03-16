import { Green_IT_Booklet } from "@app/entity/green_it_booklet";
import { User, UserRole } from "@app/entity/user";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { error } from "console";
import { Game } from "@app/entity/game";
import { User_Game } from "@app/entity/user_game";
import { AuthService } from "@app/authentification/authentification.service";
import { forwardRef, Inject } from "@nestjs/common";
import { Green_IT_Booklet_Best_Practice_Card } from "@app/entity/green_it_booklet_best_practice_card";
import { Green_IT_Booklet_Bad_Practice_Card } from "@app/entity/green_it_booklet_bad_practice_card";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users_repository: Repository<User>,
    @InjectRepository(Green_IT_Booklet)
    private booklet_repository: Repository<Green_IT_Booklet>,
    @InjectRepository(User_Game)
    private user_game_repository: Repository<User_Game>,
    @InjectRepository(Game)
    private game_repository: Repository<Game>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectRepository(Green_IT_Booklet_Best_Practice_Card)
    private booklet_best_practice_repository: Repository<Green_IT_Booklet_Best_Practice_Card>,
    @InjectRepository(Green_IT_Booklet_Bad_Practice_Card)
    private booklet_bad_practice_repository: Repository<Green_IT_Booklet_Bad_Practice_Card>

  ) {}

  async findOne(mail: string): Promise<User | undefined> {
    return this.users_repository.findOne({ where: { mail } });
  }

  async createUser(mail: string, password: string, lastname: string, firstname: string, role: UserRole): Promise<{ user_id: number }> {
    let newUser = new User();

    newUser.mail = mail;
    newUser.password = password;
    newUser.last_name = lastname;
    newUser.first_name = firstname;
    newUser.role = role;

    try {
      const temp = await this.users_repository.create(newUser);
      await this.users_repository.save(temp);
      return { user_id: temp.id };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBooklet(access_token: string): Promise<{ booklet: Green_IT_Booklet }> {
    const user_id = await this.authService.getUserByToken(access_token);
    try {
      let booklet: Green_IT_Booklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
      return { booklet: booklet };
    } catch {
      throw error("Booklet not found");
    }
  }

  async getNbGames(access_token: string): Promise<{ nb_games: number }> {
    if (access_token == undefined) {
      console.log("[users.service] getNbGames. Token undefined");
    }
    const user_id = await this.authService.getUserByToken(access_token);
    try {
      const nb_games = await this.user_game_repository.count({
        where: {
          user_id: user_id,
        },
      });
      return { nb_games };
    } catch (error) {
      throw new Error("Error while getting the number of games");
    }
  }

  async getUserId(access_token: string): Promise<number> {
    const user_id = await this.authService.getUserByToken(access_token);
    try {
      const user = await this.users_repository.findOne({
        where: {
          id: user_id,
        },
      });
      return user.id;
    } catch (error) {
      throw new Error("Erreur users.service : Utilisateur non retrouver");
    }
  }

  async getVictories(access_token: string): Promise<{ nb_victories: number }> {
    const user_id = await this.authService.getUserByToken(access_token);
    try {
      const nb_victories = await this.game_repository.count({
        where: {
          winner_id: user_id,
        },
      });
      return { nb_victories };
    } catch (error) {
      throw new Error("Error while getting the number of victories");
    }
  }

  async getTotalCO2Saved(access_token: string): Promise<{ total_co2_saved: number }> {
    const user_id = await this.authService.getUserByToken(access_token);
    try {
      const games = await this.user_game_repository.find({
        where: {
          user_id: user_id,
        },
      });
      if (!games) throw new Error("No user found");
      let total_co2_saved = 0;
      for (const game of games) {
        total_co2_saved += game.carbon_loss;
      }
      return { total_co2_saved };
    } catch (error) {
      throw new Error("Error while getting the total CO2 saved");
    }
  }

  async getNbGreenITPractices(access_token: string): Promise<{ nb_green_it_practices: number }> {
    const user_id = await this.authService.getUserByToken(access_token);
    const booklet = await this.booklet_repository.findOne({ where: { user_id } });
    try {
      const count = await this.booklet_best_practice_repository.count({ where: { greenItBookletId: booklet.id } });
      return { nb_green_it_practices: count };
    } catch (error) {
      throw new Error("Error while getting the number of green IT practices");
    }
  }

  async getNbMauvaisePratice(access_token: string): Promise<{ nb_mauvaise_pratice: number }> {
    const user_id = await this.authService.getUserByToken(access_token);
    const booklet = await this.booklet_repository.findOne({ where: { user_id } });
    try {
      const count = await this.booklet_bad_practice_repository.count({ where: { greenItBookletId: booklet.id } });
      return { nb_mauvaise_pratice: count };
    } catch (error) {
      throw new Error("Error while getting the number of bad practices");
    }
  }

 
}
