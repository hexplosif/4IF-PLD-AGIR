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
import { Card, CardType, MultipleContentsCard } from "@shared/common/Cards";
import { AddUpdateCardDto } from "./dtos";
import { Language } from "@shared/common/Languages";
import { getActorType, getLanguage, mappingBadPracticeCard, mappingBestPracticeCard, mappingExpertCard, mappingMultiContentsBadPracticeCard, mappingMultiContentsBestPracticeCard, mappingMultiContentsExpertCard, mappingMultiContentsTrainingCard, mappingTrainingCard, shuffleArray } from "./helpers";

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
		console.log("Parsing CSV file");
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
				const { id, cardType, language, label, description, link, actorType : actorTitle, 
					networkGain, memoryGain, cpuGain, storageGain, difficulty,
					interfaceComposant, dataComposant, performanceComposant, networkComposant, systemComposant
				} = row;
				const lang = getLanguage(language);
				const actorType = getActorType(actorTitle, lang);
				
				// Check if the card already exists in the database
				let card: EntityCard = await this.cards_repository.findOne({ where: { id }, relations: ["contents", "actors"] });
				let card_already_exists = true;
				if (card == null) {
					card_already_exists = false;
					card = this.cards_repository.create({ id });
				}

				// Save card actors
				let actor = await this.actors_repository.findOne({ where: { language: lang, type: actorType } });
				if (actor == null) {
					actor = this.actors_repository.create({ language: lang, title: actorTitle, type: actorType });
					actor = await this.actors_repository.save(actor);
				}

				card.actors = card.actors?.filter((a) => a.id !== actor.id) || [];
				card.actors.push(actor);

				// Save card
				card = await this.cards_repository.save(card);
				switch (cardType) {
					case "Expert":
						const expert_card = card_already_exists 
											? await this.expert_cards_repository.findOne({ where: { id } }) 
											: new EntityExpert();
						card = await this.expert_cards_repository.save({...expert_card, ...card});
						break;
					case "Formation":
						const training_card = card_already_exists
											? await this.training_cards_repository.findOne({ where: { id } })
											: new EntityTraining();
						card = await this.training_cards_repository.save({ ...training_card, ...card, link });
						break;
					case "Mauvaise pratique":
						const bad_practice_card = card_already_exists
											? await this.bad_practice_cards_repository.findOne({ where: { id } })
											: new EntityBadPractice();
						card = await this.bad_practice_cards_repository.save({
							...bad_practice_card,
							...card,
							network_gain: !!Number(networkGain),
							memory_gain: !!Number(memoryGain),
							cpu_gain: !!Number(cpuGain),
							storage_gain: !!Number(storageGain),
							difficulty: difficulty,
							interface_composant: !!Number(interfaceComposant),
							data_composant: !!Number(dataComposant),
							network_composant: !!Number(networkComposant),
							performance_composant: !!Number(performanceComposant),
							system_composant: !!Number(systemComposant),
						});
						break;
					default:
						const best_practice_card = card_already_exists
											? await this.best_practice_cards_repository.findOne({ where: { id } })
											: new EntityBestPractice();
						card = await this.best_practice_cards_repository.save({
							...best_practice_card,
							...card,
							network_gain: !!Number(networkGain),
							memory_gain: !!Number(memoryGain),
							cpu_gain: !!Number(cpuGain),
							storage_gain: !!Number(storageGain),
							difficulty: difficulty,
							carbon_loss: parseInt(cardType),
							interface_composant: !!Number(interfaceComposant),
							data_composant: !!Number(dataComposant),
							network_composant: !!Number(networkComposant),
							performance_composant: !!Number(performanceComposant),
							system_composant: !!Number(systemComposant),
						});
						break;
				}

				// Save card contents
				let card_content = await this.card_contents_repository.findOne({ where: { card_id: card.id, language } });
				if (card_content == null) {
					card_content = this.card_contents_repository.create({ card_id: card.id, language, label, description });
				}
				card_content = await this.card_contents_repository.save({ ...card_content, label, description });

				card.contents = card.contents?.filter((c) => c.id !== card_content.id) || [];
				card.contents.push(card_content);
				
				cards.push(card);
			}

			return cards;
		} catch (error) {
			console.error("error parsing CSV", error);
			throw error;
		}
	}

	// Method to retrieve card by ID
	async getAllContentsCardById(id: number): Promise<MultipleContentsCard> {
		try {
			const card : MultipleContentsCard = 
				mappingMultiContentsBestPracticeCard( await this.best_practice_cards_repository.findOne({ where: { id }, relations: ["contents", "actors"] }))
				|| mappingMultiContentsBadPracticeCard( await this.bad_practice_cards_repository.findOne({ where: { id }, relations: ["contents", "actors"] }))
				|| mappingMultiContentsExpertCard( await this.expert_cards_repository.findOne({ where: { id }, relations: ["contents", "actors"] }))
				|| mappingMultiContentsTrainingCard( await this.training_cards_repository.findOne({ where: { id }, relations: ["contents", "actors"] }));

			// console.log("card", card);
			return card;
		} catch (error) {
			console.error("error getting card by id", error);
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
	async getAllCards(language : Language = Language.FRENCH): Promise<Card[]> {
		try {
			const bestPracticeCards = await this.getCardsByType("BestPractice", null, false, language);
			const badPracticeCards = await this.getCardsByType("BadPractice", null, false, language);
			const expertCards = await this.getCardsByType("Expert", null, false, language);
			const trainingCards = await this.getCardsByType("Formation", null, false, language);

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
	async getBestPracticeCardDetails(): Promise<{card_id: number; label: string; language: string }[]> {
		return await this.dataSource
			.getRepository(Card_Content)
			.createQueryBuilder("cc")
			.innerJoin("best_practice_card", "bpc", "cc.card_id = bpc.id")
			.select(["cc.card_id as card_id", "cc.label as label", "cc.language as language"]) 
			.getRawMany(); 
	}

	// Method to retrieve card details for bad practices
	async getBadPracticeCardDetails(): Promise<{card_id: number; label: string; language: string }[]> {
		const banCard = await this.dataSource.getRepository(Card_Content)
			.createQueryBuilder("cc")
			.innerJoin("bad_practice_card", "bpc", "cc.card_id = bpc.id")
			.select(["cc.card_id as card_id", "cc.label as label", "cc.language as language"])
			.getRawMany();
		
		if (!banCard) {
			throw new Error("No bad practice card found");
		}
		return banCard;
	}

	async getCardByIdAndLanguage(id: number, language: string): Promise<Card> {
		try {
			const card : Card =
				mappingBestPracticeCard( await this.best_practice_cards_repository.findOne({ where: { id }, relations: ["contents", "actors"] }), getLanguage(language))
				|| mappingBadPracticeCard( await this.bad_practice_cards_repository.findOne({ where: { id }, relations: ["contents", "actors"] }), getLanguage(language))
				|| mappingExpertCard( await this.expert_cards_repository.findOne({ where: { id }, relations: ["contents", "actors"] }), getLanguage(language))
				|| mappingTrainingCard( await this.training_cards_repository.findOne({ where: { id }, relations: ["contents", "actors"] }), getLanguage(language));

			// console.log("card", card);
			return card;
		} catch (error) {
			console.error("error getting card by id", error);
			throw error;
		}
	}

	async addCard(cardDto: AddUpdateCardDto): Promise<Card> {       
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
		let formattedCard : Card;
		switch (cardDto.cardType) {
			case "Expert":
				let expert_card = this.expert_cards_repository.create({ ...cardDto, ...card });
				card = await this.expert_cards_repository.save(expert_card);
				formattedCard = mappingExpertCard(card as EntityExpert, Language.FRENCH);
				break;
			case "Formation":
				let training_card = this.training_cards_repository.create({ ...cardDto, ...card });
				card = await this.training_cards_repository.save(training_card);
				formattedCard = mappingTrainingCard(card as EntityTraining, Language.FRENCH);
				break;
			case "BadPractice":
				let bad_practice_card = this.bad_practice_cards_repository.create({ ...cardDto, ...card });
				card = await this.bad_practice_cards_repository.save(bad_practice_card);
				formattedCard = mappingBadPracticeCard(card as EntityBadPractice, Language.FRENCH);
				break;
			case "BestPractice":
				let best_practice_card = this.best_practice_cards_repository.create({ ...cardDto, ...card });
				card = await this.best_practice_cards_repository.save(best_practice_card);
				formattedCard = mappingBestPracticeCard(card as EntityBestPractice, Language.FRENCH);
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
		const contents = await Promise.all(contentPromises);
		formattedCard.contents = (contents.find((c) => c.language === Language.FRENCH) || contents[0]).description;
		return formattedCard;
	}

	async updateCard(cardDto: AddUpdateCardDto): Promise<Card> {
		let card: EntityCard = await this.cards_repository.findOne({ where: { id: cardDto.id }, relations: ["contents", "actors"] });
		if (card == null) {
			throw new ConflictException(`Card with id ${cardDto.id} does not exist`);
		}

		// Update actors
		const actorsPromise = cardDto.languageContents.map(async (content) => {
			let actor = await this.actors_repository.findOne({ where: { language: content.language, title: content.actorName, type: content.actorType } });
			if (actor == null) {
				actor = this.actors_repository.create({ language: content.language, title: content.actorName, type: content.actorType });
				actor = await this.actors_repository.save(actor);
			}
			return actor;
		});
		const actors = await Promise.all(actorsPromise);

		// Update card content
		card.actors = actors;
		card = await this.cards_repository.save(card);

		let formattedCard : Card;
		switch (cardDto.cardType) {
			case "Expert":
				card = await this.expert_cards_repository.save({...cardDto, ...card});
				formattedCard = mappingExpertCard(card as EntityExpert, Language.FRENCH);
				break;
			case "Formation":
				card = await this.training_cards_repository.save({...cardDto, ...card });
				formattedCard = mappingTrainingCard(card as EntityTraining, Language.FRENCH);
				break;
			case "BadPractice":
				card = await this.bad_practice_cards_repository.save({...cardDto, ...card});
				formattedCard = mappingBadPracticeCard(card as EntityBadPractice, Language.FRENCH);
				break;
			case "BestPractice":
				card = await this.best_practice_cards_repository.save({...cardDto, ...card});
				formattedCard = mappingBestPracticeCard(card as EntityBestPractice, Language.FRENCH);
				break;
			default:
				throw new BadRequestException(`Unexpected card type: ${cardDto.cardType}`);
		}

		// Update card content
		const contentPromises = cardDto.languageContents.map(async (content) => {
			let card_content = await this.card_contents_repository.findOne({ where: { card_id: cardDto.id, language: content.language } });
			if (card_content == null) {
				card_content = this.card_contents_repository.create({ card_id: cardDto.id, language: content.language, label: content.title, description: content.description });
				card_content = await this.card_contents_repository.save(card_content);
			} else {
				card_content.label = content.title;
				card_content.description = content.description;
				card_content = await this.card_contents_repository.save(card_content);
			}
			return card_content;
		});
		await Promise.all(contentPromises);

		return formattedCard;
	}

	// ======================================================
	// PRIVATE METHODS
	// ======================================================

	async getCardsByType(type: CardType, quantity: number = null, shuffle: boolean = true, language : Language = Language.FRENCH): Promise<Card[]> {
		let cards: Card[] = [];
		switch (type) {
			case "BestPractice":
				const bestPracticeCards = await this.best_practice_cards_repository.find({ relations: ["contents", "actors"] });
				cards = bestPracticeCards.map((c) => mappingBestPracticeCard(c, language));
				break;
			case "BadPractice":
				const badPracticeCards = await this.bad_practice_cards_repository.find({ relations: ["contents", "actors"] });
				cards = badPracticeCards.map((c) => mappingBadPracticeCard(c, language));
				break;
			case "Expert":  
				const expertCards = await this.expert_cards_repository.find({ relations: ["contents", "actors"] });
				cards = expertCards.map((c) => mappingExpertCard(c, language));
				break;
			case "Formation":
				const trainingCards = await this.training_cards_repository.find({ relations: ["contents", "actors"] });
				cards = trainingCards.map((c) => mappingTrainingCard(c, language));
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
