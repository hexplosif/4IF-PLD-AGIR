import { Injectable } from "@nestjs/common";
import { Game, Game_Status } from "@app/entity/game";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository, QueryRunner } from "typeorm";
import { User_Game } from "@app/entity/user_game";
import { Card } from "@app/entity/card";
import { Best_Practice_Card } from "@app/entity/best_practice_card";
import { Bad_Practice_Card } from "@app/entity/bad_practice_card";
import { Expert_Card } from "@app/entity/expert_card";
import { Green_IT_Booklet } from "@app/entity/green_it_booklet";
import { User } from "@app/entity/user";
import { Training_Card } from "@app/entity/training_card";
import { Green_IT_Booklet_Best_Practice_Card } from "@app/entity/green_it_booklet_best_practice_card";
import { Green_IT_Booklet_Bad_Practice_Card } from "@app/entity/green_it_booklet_bad_practice_card";

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

    @InjectRepository(Green_IT_Booklet_Best_Practice_Card)
    private green_it_booklet_best_practice_card_repository: Repository<Green_IT_Booklet_Best_Practice_Card>,

    @InjectRepository(Green_IT_Booklet_Bad_Practice_Card)
    private green_it_booklet_bad_practice_card_repository: Repository<Green_IT_Booklet_Bad_Practice_Card>,

    private dataSource: DataSource,
  ) {}

  async createGame(): Promise<{ game_id: number }> {
    console.log("[GameService] createGame");

    let game = this.game_repository.create({
      created_at: new Date(),
      round: 1,
      user_turn: 1,
      status: Game_Status.STARTED,
      discard_stack: [],
      deck_stack: [],
      winner_id: null,
    });
    game = await this.game_repository.save(game);
    return { game_id: game.id };
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

  async addToDiscardStack(gameId: number, cardId: number): Promise<void> {
    const game = await this.game_repository.findOne({ where: { id: gameId } });
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
    const userGame = await this.user_game_repository.findOne({ where: { user_id: user_id, game_id: gameId } });
    if (!userGame) {
      throw new Error("UserGame non trouver");
    }

    userGame.carbon_loss += carbon; //attribue la nouvelle valeur de carbone
    await this.user_game_repository.save(userGame); //Sauvegarder la relation
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

      const bestPracticeCard = await this.best_practice_repository.findOne({ where: { id: card_id } });
      if (!bestPracticeCard) {
        throw new Error(`BestPracticeCard ${card_id} non trouvé`);
      }

      // Check if the association already exists
      const existingAssociation = await this.green_it_booklet_best_practice_card_repository.findOne({
        where: { greenItBookletId: booklet.id, bestPracticeCardId: bestPracticeCard.id },
      });

      if (!existingAssociation) {
        // If no association exists, create a new one
        const newAssociation = this.green_it_booklet_best_practice_card_repository.create({
          greenItBookletId: booklet.id,
          bestPracticeCardId: bestPracticeCard.id,
          priority: 1,
        });
        console.log("newAssociation", newAssociation);
        console.log("booklet", booklet);

        await this.green_it_booklet_best_practice_card_repository.save(newAssociation);
      }

      await queryRunner.commitTransaction();
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
        throw new Error(`badPracticeCard ${card_id} non trouvé`);
      }

      // Check if the association already exists
      const existingAssociation = await this.green_it_booklet_bad_practice_card_repository.findOne({
        where: { greenItBookletId: booklet.id, badPracticeCardId: badPracticeCard.id },
      });

      if (!existingAssociation) {
        // If no association exists, create a new one
        const newAssociation = this.green_it_booklet_bad_practice_card_repository.create({
          greenItBookletId: booklet.id,
          badPracticeCardId: badPracticeCard.id,
          priority: 1,
        });
        console.log("newAssociation", newAssociation);
        console.log("booklet", booklet);
        await this.green_it_booklet_bad_practice_card_repository.save(newAssociation);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
