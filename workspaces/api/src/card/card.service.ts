import { Injectable } from "@nestjs/common";
import { parse } from "papaparse";
import { CsvCard } from "./card.type";
import { Card as EntityCard } from "@app/entity/card";
import { Expert_Card as EntityExpert } from "@app/entity/expert_card";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Best_Practice_Card as EntityBestPractice } from "@app/entity/best_practice_card";
import { Bad_Practice_Card as EntityBadPractice } from "@app/entity/bad_practice_card";
import { Training_Card as EntityTraining } from "@app/entity/training_card";
import { Card_Content } from "@app/entity/card_content";
import { Actor as EntityActor } from "@app/entity/actor";
import { Card, Formation_Card, Best_Practice_Card, Bad_Practice_Card, Expert_Card } from "@shared/common/Cards";
import { Actor } from "@shared/common/Cards";

@Injectable()
export class CardService {
  
  constructor(
    @InjectRepository(EntityCard)
    private cards_repository: Repository<EntityCard>,
    @InjectRepository(EntityBestPractice)
    private best_practice_cards_repository: Repository<EntityBestPractice>,
    @InjectRepository(EntityBadPractice)
    private bad_practice_cards_repository: Repository<EntityBadPractice>,
    @InjectRepository(EntityExpert)
    private expert_cards_repository: Repository<EntityExpert>,
    @InjectRepository(EntityTraining)
    private training_cards_repository: Repository<EntityTraining>,
    @InjectRepository(Card_Content)
    private card_contents_repository: Repository<Card_Content>,
    @InjectRepository(EntityActor)
    private actors_repository: Repository<EntityActor>,

    private dataSource: DataSource,
  ) {}

  // Method to parse CSV file and create cards
  async parseCsv(file: Express.Multer.File) {
    try {
      const csvData: CsvCard[] = await new Promise((resolve, reject) => {
        const data: CsvCard[] = [];
        parse(file.buffer.toString(), {
          header: true,
          complete: results => {
            data.push(...results.data);
            resolve(data);
          },
          skipEmptyLines: true,
          error: err => reject(err),
        });
      });

      const cards = [];
      // Iterating through parsed CSV data
      for (const row of csvData) {
        // Extracting data from each row
        const { id, cardType, language, label, description, link, actorType, networkGain, memoryGain, cpuGain, storageGain, difficulty } = row;
        let card: EntityCard = await this.cards_repository.findOne({ where: { id } });
        let card_already_exists = true;
        if (card == null) {
          card_already_exists = false;
          card = this.cards_repository.create({ id });
        }

        let actor = await this.actors_repository.findOne({ where: { language, title: actorType } });
        if (actor == null) {
          actor = this.actors_repository.create({ language, title: actorType });
          actor = await this.actors_repository.save(actor);
        }
        if (card.actors) {
          card.actors.push(actor);
        } else {
          card.actors = [actor];
        }
        card = await this.cards_repository.save(card);

        switch (cardType) {
          case "Expert":
            let expert_card = new EntityExpert();
            Object.assign(expert_card, card);
            if (card_already_exists) {
              expert_card = await this.expert_cards_repository.findOne({ where: { id } });
            }
            card = await this.expert_cards_repository.save(expert_card);
            break;
          case "Formation":
            let training_card = new EntityTraining();
            Object.assign(training_card, card);
            if (card_already_exists) {
              training_card = await this.training_cards_repository.findOne({ where: { id } });
            }
            training_card.link = link;
            card = await this.training_cards_repository.save(training_card);
            break;
          case "Mauvaise pratique":
            let bad_practice_card = new EntityBadPractice();
            Object.assign(bad_practice_card, card);
            if (card_already_exists) {
              bad_practice_card = await this.bad_practice_cards_repository.findOne({ where: { id } });
            }
            bad_practice_card = {
              ...bad_practice_card,
              network_gain: !!networkGain,
              memory_gain: !!memoryGain,
              cpu_gain: !!cpuGain,
              storage_gain: !!storageGain,
              difficulty: difficulty,
            };
            card = await this.bad_practice_cards_repository.save(bad_practice_card);
            break;
          default:
            let best_practice_card = new EntityBestPractice();
            Object.assign(best_practice_card, card);
            if (card_already_exists) {
              best_practice_card = await this.best_practice_cards_repository.findOne({ where: { id } });
            }
            best_practice_card = {
              ...best_practice_card,
              network_gain: !!networkGain,
              memory_gain: !!memoryGain,
              cpu_gain: !!cpuGain,
              storage_gain: !!storageGain,
              difficulty: difficulty,
              carbon_loss: parseInt(cardType),
            };
            card = await this.best_practice_cards_repository.save(best_practice_card);
            break;
        }
        let card_content = await this.card_contents_repository.findOne({ where: { card_id: card.id, language } });
        if (card_content == null) {
          card_content = this.card_contents_repository.create({ card_id: card.id, card, language, label, description });
        }
        card_content = await this.card_contents_repository.save(card_content);
        cards.push(card);
      }
      return cards;
    } catch (error) {
      console.error("error parsing CSV", error);
      throw error;
    }
  }

  // Method to retrieve shuffled deck of cards
  async getDeck(): Promise<Card[]> {
    console.log("[card.service] Starting to get deck method in card.service");
    try {
      // Shuffling and formatting bad practice cards
      const badPracticeCards = await this.bad_practice_cards_repository.find({ relations: ["contents", "actors"] });
      const deckBadPracticeCards = this.shuffleArray(badPracticeCards).slice(0, 12);
      const formattedBadPracticeCards: Bad_Practice_Card[] = deckBadPracticeCards.map((card: EntityBadPractice) => ({
        id: card.id.toString(),
        actor: this.getActorName(card.actors[0].title),
        title: card.contents[0] ? card.contents[0].label : "No label",
        contents: card.contents[0] ? card.contents[0].description : "No description",
        cardType: "BadPractice",
        network_gain: card.network_gain,
        memory_gain: card.memory_gain,
        cpu_gain: card.cpu_gain,
        storage_gain: card.storage_gain,
        difficulty: card.difficulty,
      }));

      // Shuffling and formatting best practice cards
      const bestPracticeCards = await this.best_practice_cards_repository.find({ relations: ["contents", "actors"] });
      const deckBestPracticeCards = this.shuffleArray(bestPracticeCards).slice(0, 50);
      const formattedBestPracticeCards: Best_Practice_Card[] = deckBestPracticeCards.map((card: EntityBestPractice) => ({
        id: card.id.toString(),
        actor: this.getActorName(card.actors[0].title),
        title: card.contents[0] ? card.contents[0].label : "No label",
        contents: card.contents[0] ? card.contents[0].description : "No description",
        cardType: "BestPractice",
        network_gain: card.network_gain,
        memory_gain: card.memory_gain,
        cpu_gain: card.cpu_gain,
        storage_gain: card.storage_gain,
        difficulty: card.difficulty,
        carbon_loss: card.carbon_loss,
      }));

      // Shuffling and formatting expert cards
      const expertCards = await this.expert_cards_repository.find({ relations: ["contents", "actors"] });
      const deckExpertCards = this.shuffleArray(expertCards).slice(0, 3);
      const formattedExpertCards: Expert_Card[] = deckExpertCards.map((card: EntityExpert) => ({
        id: card.id.toString(),
        actor: this.getActorName(card.actors[0].title),
        title: card.contents[0] ? card.contents[0].label : "No label",
        contents: card.contents[0] ? card.contents[0].description : "No description",
        cardType: "Expert",
      }));

      // Shuffling and formatting training cards
      const trainingCards = await this.training_cards_repository.find({ relations: ["contents", "actors"] });
      const deckTrainingCards = this.shuffleArray(trainingCards).slice(0, 18);
      const formattedTrainingCards: Formation_Card[] = deckTrainingCards.map((card: EntityTraining) => ({
        id: card.id.toString(),
        actor: this.getActorName(card.actors[0].title),
        title: card.contents[0] ? card.contents[0].label : "No label",
        contents: card.contents[0] ? card.contents[0].description : "No description",
        cardType: "Formation",
        linkToFormation: card.link,
      }));

      const allCards = [...formattedBadPracticeCards, ...formattedBestPracticeCards, ...formattedExpertCards, ...formattedTrainingCards];

      const shuffledCards = this.shuffleArray(allCards);
      return shuffledCards;
    } catch (error) {
      console.error("error getting deck", error);
      throw error;
    }
  }

  async getAllCards(): Promise<Card[]> {
    // Shuffling and formatting bad practice cards
    const badPracticeCards = await this.bad_practice_cards_repository.find({ relations: ["contents", "actors"] });
    const deckBadPracticeCards = this.shuffleArray(badPracticeCards).slice(0, 12);
    const formattedBadPracticeCards: Bad_Practice_Card[] = deckBadPracticeCards.map((card: EntityBadPractice) => ({
      id: card.id.toString(),
      actor: this.getActorName(card.actors[0].title),
      title: card.contents[0] ? card.contents[0].label : "No label",
      contents: card.contents[0] ? card.contents[0].description : "No description",
      cardType: "BadPractice",
      network_gain: card.network_gain,
      memory_gain: card.memory_gain,
      cpu_gain: card.cpu_gain,
      storage_gain: card.storage_gain,
      difficulty: card.difficulty,
    }));

    // Shuffling and formatting best practice cards
    const bestPracticeCards = await this.best_practice_cards_repository.find({ relations: ["contents", "actors"] });
    const deckBestPracticeCards = this.shuffleArray(bestPracticeCards).slice(0, 50);
    const formattedBestPracticeCards: Best_Practice_Card[] = deckBestPracticeCards.map((card: EntityBestPractice) => ({
      id: card.id.toString(),
      actor: this.getActorName(card.actors[0].title),
      title: card.contents[0] ? card.contents[0].label : "No label",
      contents: card.contents[0] ? card.contents[0].description : "No description",
      cardType: "BestPractice",
      network_gain: card.network_gain,
      memory_gain: card.memory_gain,
      cpu_gain: card.cpu_gain,
      storage_gain: card.storage_gain,
      difficulty: card.difficulty,
      carbon_loss: card.carbon_loss,
    }));

    // Shuffling and formatting expert cards
    const expertCards = await this.expert_cards_repository.find({ relations: ["contents", "actors"] });
    const deckExpertCards = this.shuffleArray(expertCards).slice(0, 3);
    const formattedExpertCards: Expert_Card[] = deckExpertCards.map((card: EntityExpert) => ({
      id: card.id.toString(),
      actor: this.getActorName(card.actors[0].title),
      title: card.contents[0] ? card.contents[0].label : "No label",
      contents: card.contents[0] ? card.contents[0].description : "No description",
      cardType: "Expert",
    }));

    // Shuffling and formatting training cards
    const trainingCards = await this.training_cards_repository.find({ relations: ["contents", "actors"] });
    const deckTrainingCards = this.shuffleArray(trainingCards).slice(0, 18);
    const formattedTrainingCards: Formation_Card[] = deckTrainingCards.map((card: EntityTraining) => ({
      id: card.id.toString(),
      actor: this.getActorName(card.actors[0].title),
      title: card.contents[0] ? card.contents[0].label : "No label",
      contents: card.contents[0] ? card.contents[0].description : "No description",
      cardType: "Formation",
      linkToFormation: card.link,
    }));

    const allCards = [...formattedBestPracticeCards, ...formattedBadPracticeCards, ...formattedTrainingCards, ...formattedExpertCards];
    return allCards;
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private getActorName(actorTitle: string): Actor {
    switch (actorTitle) {
      case "Architecte":
        return "Architect";
      case "Développeur":
        return "Developer";
      case "Product Owner":
        return "ProductOwner";
      default:
        throw new Error(`Unexpected actor title: ${actorTitle}`);
    }
  }

  async getBadPracticeCard(): Promise<EntityBadPractice[]> {
    return this.bad_practice_cards_repository.find({ relations: ["contents", "actors"] });
  }

  async getBestPracticeCardDetails(): Promise<{id: number; label: string }[]> {
    return await this.dataSource
      .getRepository(Card_Content) // Assuming CardContent is the entity name for "card_content"
      .createQueryBuilder("cc") // Alias "cc" for CardContent
      .innerJoin("best_practice_card", "bpc", "cc.card_id = bpc.id") // Assuming there's a direct way to join without a relation defined
      .select(["cc.card_id", "cc.label"])
      .getMany();
  }

  async getBadPracticeCardDetails(): Promise<{id: number; label: string }[]> {
    const banCard = await this.dataSource.getRepository(Card_Content)
    .createQueryBuilder("cc")
    .innerJoin("bad_practice_card", "bpc", "cc.card_id = bpc.id")
    .select(["cc.card_id", "cc.label"])
    .getMany();
    if (!banCard) {
      throw new Error("No bad practice card found");
    }
    return banCard
  }
}
