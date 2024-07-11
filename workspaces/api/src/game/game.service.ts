import { Injectable } from "@nestjs/common";
import { Game, Game_Status } from "@app/entity/game";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository, QueryRunner, QueryRunnerAlreadyReleasedError } from "typeorm";
import { User_Game } from "@app/entity/user_game";
import { Card } from "@app/entity/card";
import { Best_Practice_Card } from "@app/entity/best_practice_card";
import { Bad_Practice_Card } from "@app/entity/bad_practice_card";
import { Expert_Card } from "@app/entity/expert_card";
import { Green_IT_Booklet } from "@app/entity/green_it_booklet";
import { User } from "@app/entity/user";
import { Training_Card } from "@app/entity/training_card";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private game_repository: Repository<Game>,

    @InjectRepository(User_Game)
    private user_game_repository: Repository<User_Game>,

    @InjectRepository(Card)
    private card_repository: Repository<Card>,

    @InjectRepository(Best_Practice_Card)
    private best_practice_repository: Repository<Best_Practice_Card>,

    @InjectRepository(Bad_Practice_Card)
    private bad_practice_repository: Repository<Bad_Practice_Card>,

    @InjectRepository(Expert_Card)
    private expert_repository: Repository<Expert_Card>,

    @InjectRepository(Training_Card)
    private training_repository: Repository<Training_Card>,

    @InjectRepository(Green_IT_Booklet)
    private booklet_repository: Repository<Green_IT_Booklet>,

    @InjectRepository(User)
    private user_repository: Repository<User>,

    private dataSource: DataSource,
  ) {}

  async createGame(winnerId: number): Promise<{ game_id: number }> {
    console.log("[GameService] createGame");

    let newGame = new Game();
    newGame.created_at = new Date();
    newGame.updated_at = new Date();
    newGame.round = 1;
    newGame.user_turn = 1;
    newGame.status = Game_Status.STARTED;
    newGame.discard_stack = [];
    newGame.deck_stack = [];
    newGame.questions = [];
    newGame.users = [];
    newGame.winner_id = winnerId;
    try {
      const temp = this.game_repository.create(newGame);
      await this.game_repository.save(temp);
      console.log("[game.service} game_id : ", temp.id);
      return { game_id: temp.id };
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateClientId(clientId: number): Promise<User> {
    const client = await this.user_repository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new Error("Client non trouvé");
    }
    return client;
  }

  async endGame(gameId: number, winner_id: number): Promise<Game> {
    console.log("endGame Repo");
    let game = await this.game_repository.findOne({ where: { id: gameId } });
    if (!game) throw new Error("Partie non trouver");

    game.finished_at = new Date();
    game.winner_id = winner_id;
    game.status = Game_Status.FINISHED;

    return this.game_repository.save(game);
  }

  /*  async getGame(gameId: number): Promise<Game> {
    let game = await this.game_repository.findOne({ where: { id: gameId } });
    if (!game) throw new Error("Partie non trouver");
    return game;
  } */

  async CreateUserGame(gameId: number, userId: number): Promise<{ User_gameID: number }> {
    console.log("CreateUserGame for", userId);
    let user_game = new User_Game();
    user_game.game_id = gameId;
    user_game.user_id = userId;
    user_game.carbon_loss = 0;
    user_game.bad_practices_cards = [];
    user_game.best_practices_cards = [];
    try {
      const temp = this.user_game_repository.create(user_game);
      await this.user_game_repository.save(temp);
      console.log("[game.service] UserGame created: ", temp.id);
      return { User_gameID: temp.id };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserGameId(gameId: number, userId: number): Promise<{ User_gameId: number }> {
    console.log("Trying to get UserID", userId, "game in", gameId);

    let user_game = await this.user_game_repository.findOne({ where: { game_id: gameId, user_id: userId } });
    if (!user_game) throw new Error("User_game not found");
    return { User_gameId: user_game.id };
  }

  async addToDiscardStack(gameId: number, cardId: number): Promise<void> {
    console.log("gameId to discard is", gameId);
    const game = await this.game_repository.findOne({ where: { id: gameId } });
    console.log("found in the repo is gameId", game);
    if (!game) {
      throw new Error("Game not found");
    }

    const card = await this.card_repository.findOne({ where: { id: cardId } });
    if (!card) {
      throw new Error("Card not found");
    }

    if (!game.discard_stack) {
      game.discard_stack = [];
    }

    game.discard_stack.push(card); //Ajouter la carte dans la pile de défausse

    await this.game_repository.save(game);
  }

  //TODO simplifier la méthode
  async updateCardStackUserGameRelation(cardId: number, user_id: number): Promise<void> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const userGame = await this.user_game_repository.findOne({ where: { user_id: user_id } });
    if (!userGame) {
      throw new Error("UserGame non trouver");
    }

    let card: Best_Practice_Card | Bad_Practice_Card | Expert_Card;

    try {
      if (await this.best_practice_repository.findOne({ where: { id: cardId } })) {
        card = await this.best_practice_repository.findOne({ where: { id: cardId } });
        if (!card.cards_stack_users_game) {
          card.cards_stack_users_game = [];
        }
        card.cards_stack_users_game.push(userGame);
        await this.best_practice_repository.save(card);
      } else if (await this.bad_practice_repository.findOne({ where: { id: cardId } })) {
        card = await this.bad_practice_repository.findOne({ where: { id: cardId } });
        if (!card.cards_stack_users_game) {
          card.cards_stack_users_game = [];
        }
        card.cards_stack_users_game.push(userGame);
        await this.bad_practice_repository.save(card);
      } else if (await this.expert_repository.findOne({ where: { id: cardId } })) {
        card = await this.expert_repository.findOne({ where: { id: cardId } });
        if (!card.cards_stack_users_game) {
          card.cards_stack_users_game = [];
        }

        card.cards_stack_users_game.push(userGame);
        await this.expert_repository.save(card);
      } else if (await this.training_repository.findOne({ where: { id: cardId } })) {
        card = await this.training_repository.findOne({ where: { id: cardId } });
        if (!card.cards_stack_users_game) {
          card.cards_stack_users_game = [];
        }
        card.cards_stack_users_game.push(userGame);
        await this.training_repository.save(card);
      } else {
        throw new Error("Card not found");
      }
      await this.user_game_repository.save(userGame); //TODO : regarder pourquoi cela ne Sauvegarder pas la relation

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserCarbon(gameId: number, user_id: number, carbon: number): Promise<void> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const userGame = await this.user_game_repository.findOne({ where: { user_id: user_id, game_id: gameId } });
    if (!userGame) {
      throw new Error("UserGame non trouver");
    }

    try {
      userGame.carbon_loss += carbon; //attribue la nouvelle valeur de carbone
      await this.user_game_repository.save(userGame); //Sauvegarder la relation

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateGreenITBookletPracticeApply(card_id: number, user_id: number): Promise<void> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
      if (!booklet) {
        throw new Error(`Booklet pour l'utilisateur ${user_id} non trouvé`);
      }

      if (!booklet.practices_to_apply) {
        booklet.practices_to_apply = [];
      }

      console.log("booklet.practiceto apply", booklet.practices_to_apply);
      const alreadyAssociated = booklet.practices_to_apply.some(card => card.id === card_id);

      if (!alreadyAssociated) {
        const bestPracticeCard = await this.best_practice_repository.findOne({ where: { id: card_id } });
        if (!bestPracticeCard) {
          throw new Error(`BestPracticeCard ${card_id} non trouvé`);
        }

        booklet.practices_to_apply = [...booklet.practices_to_apply, bestPracticeCard];
        console.log("booklet.practiceto apply after push new card", booklet.practices_to_apply);

        await this.booklet_repository.save(booklet);
        console.log("booklet saved", booklet);
        await queryRunner.commitTransaction();
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateGreenITBookletPracticeBan(card_id: number, user_id: number): Promise<void> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const booklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
      if (!booklet) {
        throw new Error(`Booklet pour l'utilisateur ${user_id} non trouvé`);
      }
      const badPracticeCard = await this.bad_practice_repository.findOne({ where: { id: card_id } });
      if (!badPracticeCard) {
        throw new Error(`BadPracticeCard ${card_id} non trouvé`);
      }
      if (!booklet.practices_to_ban) {
        booklet.practices_to_ban = [];
      }
      booklet.practices_to_ban.push(badPracticeCard);

      await this.booklet_repository.save(booklet);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
