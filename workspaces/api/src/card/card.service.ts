import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
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
import { Card, CardType } from "@shared/common/Cards";
import { AddCardDto } from "./dtos";
import { Language } from "@shared/common/Languages";
import { getActorType, getLanguage, mappingBadPracticeCard, mappingBestPracticeCard, mappingExpertCard, mappingTrainingCard, shuffleArray } from "./helpers";

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
				parse<CsvCard>(file.buffer.toString(), {
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
				const { id, cardType, language, label, description, link, actorType : actorTitle, networkGain, memoryGain, cpuGain, storageGain, difficulty } = row;
				let card: EntityCard = await this.cards_repository.findOne({ where: { id } });
				let card_already_exists = true;
				if (card == null) {
					card_already_exists = false;
					card = this.cards_repository.create({ id });
				}


				let actorType = getActorType(actorTitle);
				let lang = getLanguage(language);
				let actor = await this.actors_repository.findOne({ where: { language: lang, title: actorTitle, type: actorType } });
				if (actor == null) {
					actor = this.actors_repository.create({ language: lang, title: actorType, type: actorType });
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
							network_gain: !!Number(networkGain),
							memory_gain: !!Number(memoryGain),
							cpu_gain: !!Number(cpuGain),
							storage_gain: !!Number(storageGain),
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

						console.log(id, networkGain, memoryGain, cpuGain, storageGain, difficulty);
						console.log("Check", typeof networkGain, typeof memoryGain, typeof cpuGain, typeof storageGain)
						console.log("Check", !!networkGain, !!memoryGain, !!cpuGain, !!storageGain)

						best_practice_card = {
							...best_practice_card,
							network_gain: !!Number(networkGain),
							memory_gain: !!Number(memoryGain),
							cpu_gain: !!Number(cpuGain),
							storage_gain: !!Number(storageGain),
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
			const bestPracticeCards = await this.getCardsByType("BestPractice", 50, true);
			const badPracticeCards = await this.getCardsByType("BadPractice", 12, true);
			const expertCards = await this.getCardsByType("Expert", 3, true);
			const trainingCards = await this.getCardsByType("Formation", 18, true);

			const allCards = [
				...bestPracticeCards,
				...badPracticeCards,
				...expertCards,
				...trainingCards,
			];

			return shuffleArray(allCards);
		} catch (error) {
			console.error("error getting deck", error);
			throw error;
		}
	}

	// Method to retrieve all cards
	async getAllCards(): Promise<Card[]> {
		try {
			const bestPracticeCards = await this.getCardsByType("BestPractice", null, false);
			const badPracticeCards = await this.getCardsByType("BadPractice", null, false);
			const expertCards = await this.getCardsByType("Expert", null, false);
			const trainingCards = await this.getCardsByType("Formation", null, false);

			return [
				...bestPracticeCards,
				...badPracticeCards,
				...expertCards,
				...trainingCards,
			];
		} catch (error) {
			console.error("error getting all cards", error);
			throw error;
		}
	}

	// Method to retrieve card details for best practices
	async getBestPracticeCardDetails(): Promise<{id: number; label: string }[]> {
		return await this.dataSource
			.getRepository(Card_Content) // Assuming CardContent is the entity name for "card_content"
			.createQueryBuilder("cc") // Alias "cc" for CardContent
			.innerJoin("best_practice_card", "bpc", "cc.card_id = bpc.id") // Assuming there's a direct way to join without a relation defined
			.select(["cc.card_id", "cc.label"])
			.getMany();
	}

	// Method to retrieve card details for bad practices
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

	async addCard(cardDto: AddCardDto): Promise<EntityCard> {       
		let card: EntityCard = await this.cards_repository.findOne({ where: {  id: cardDto.id} });
		if (card != null) {
			throw new ConflictException(`Card with id ${cardDto.id} already exists`);
		}

		// Create actor if it does not exist
		const actorsPromise = cardDto.languageContents.map(async (content) => {
			let actor = await this.actors_repository.findOne({ where: { language: content.language, title: content.actorName, type: content.actorType } });
			if (actor == null) {
				actor = this.actors_repository.create({ language: content.language, title: content.actorName, type: content.actorType });
				actor = await this.actors_repository.save(actor);
			}
			return actor;
		});
		const actors = await Promise.all(actorsPromise);

		// Create card content
		card = this.cards_repository.create({ id: cardDto.id, actors: actors });
		card = await this.cards_repository.save(card);

		// Add card to repository based on card type
		switch (cardDto.cardType) {
			case "Expert":
				let expert_card = this.expert_cards_repository.create({ ...card });
				card = await this.expert_cards_repository.save(expert_card);
				break;
			case "Formation":
				let training_card = this.training_cards_repository.create({ ...card, link: cardDto.link });
				card = await this.training_cards_repository.save(training_card);
				break;
			case "BadPractice":
					let bad_practice_card = this.bad_practice_cards_repository.create({ ...card, network_gain: cardDto.network_gain, memory_gain: cardDto.memory_gain, cpu_gain: cardDto.cpu_gain, storage_gain: cardDto.storage_gain, difficulty: cardDto.difficulty });
					card = await this.bad_practice_cards_repository.save(bad_practice_card);
					break;
			case "BestPractice":
					let best_practice_card = this.best_practice_cards_repository.create({ ...card, network_gain: cardDto.network_gain, memory_gain: cardDto.memory_gain, cpu_gain: cardDto.cpu_gain, storage_gain: cardDto.storage_gain, difficulty: cardDto.difficulty, carbon_loss: cardDto.carbon_loss });
					card = await this.best_practice_cards_repository.save(best_practice_card);
					break;
			default:
					throw new BadRequestException(`Unexpected card type: ${cardDto.cardType}`);
		}

		// Create card content
		const contentPromises = cardDto.languageContents.map(async (content) => {
			let card_content = this.card_contents_repository.create({ card_id: cardDto.id, language: content.language, label: content.title, description: content.description });
			card_content = await this.card_contents_repository.save(card_content);
			return card_content;
		});
		await Promise.all(contentPromises);

		return card;
	}

	// ======================================================
	// PRIVATE METHODS
	// ======================================================

	async getCardsByType(type: CardType, quantity: number = null, shuffle: boolean = true): Promise<Card[]> {
		let cards: Card[] = [];
		switch (type) {
			case "BestPractice":
				const bestPracticeCards = await this.best_practice_cards_repository.find({ relations: ["contents", "actors"] });
				cards = bestPracticeCards.map((c) => mappingBestPracticeCard(c, Language.FRENCH));
				break;
			case "BadPractice":
				const badPracticeCards = await this.bad_practice_cards_repository.find({ relations: ["contents", "actors"] });
				cards = badPracticeCards.map((c) => mappingBadPracticeCard(c, Language.FRENCH));
				break;
			case "Expert":  
				const expertCards = await this.expert_cards_repository.find({ relations: ["contents", "actors"] });
				cards = expertCards.map((c) => mappingExpertCard(c, Language.FRENCH));
				break;
			case "Formation":
				const trainingCards = await this.training_cards_repository.find({ relations: ["contents", "actors"] });
				cards = trainingCards.map((c) => mappingTrainingCard(c, Language.FRENCH));
				break;
			default:
				throw new BadRequestException(`Unexpected card type: ${type}`);
		}

		if (shuffle) {
			cards = shuffleArray(cards);
		}
		if (quantity) {
			cards = cards.slice(0, quantity);
		}

		return cards;
	}



}
