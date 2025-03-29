import { Green_IT_Booklet } from "../entity/green_it_booklet";
import { User } from "@app/entity/user";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Green_IT_Booklet_Bad_Practice_Card } from "@app/entity/green_it_booklet_bad_practice_card";
import { Green_IT_Booklet_Best_Practice_Card } from "@app/entity/green_it_booklet_best_practice_card";
import { ExportDto } from "./dtos";
import jsPDF from "jspdf";
import { AppException } from "@app/exceptions/app.exception";
import { BookletErrorCode } from "@app/exceptions/enums/bookletErrorCode.enum";

@Injectable()
export class BookletService {
	constructor(
		@InjectRepository(User)
		private user_repository: Repository<User>,
		@InjectRepository(Green_IT_Booklet)
		private readonly booklet_repository: Repository<Green_IT_Booklet>,
		@InjectRepository(Green_IT_Booklet_Bad_Practice_Card)
		private readonly booklet_bad_practice_repository: Repository<Green_IT_Booklet_Bad_Practice_Card>,
		@InjectRepository(Green_IT_Booklet_Best_Practice_Card)
		private readonly booklet_best_practice_repository: Repository<Green_IT_Booklet_Best_Practice_Card>,
		private dataSource: DataSource,
	) {}
	

	async createBooklet(user_id: number): Promise<{ booklet: Green_IT_Booklet }> {
		let user = await this.user_repository.findOne({ where: { id: user_id } });
		if (!user) {
			throw new AppException(BookletErrorCode.USER_ID_NOT_FOUND, HttpStatus.NOT_FOUND );
		}

		let booklet: Green_IT_Booklet = this.booklet_repository.create({
			user_id: user_id,
			practices_to_ban: [],
			practices_to_apply: [],
			//trainings : [],
		});
		await this.booklet_repository.save(booklet);
		user.green_it_booklet_id = booklet.id;
		await this.user_repository.save(user);

		return { booklet: booklet };
	}


	async getBooklet(user_id: number): Promise<{ booklet: Green_IT_Booklet }> {
		const existingBooklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
		if (!existingBooklet) {
			throw new AppException(BookletErrorCode.BOOKLET_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return { booklet: existingBooklet };
	}


	async getAppliedPractices(user_id: number): Promise<{ practices: { id: number; priority: number }[] }> {
		const existingBooklet = await this.getBooklet(user_id);
		if (!existingBooklet) {
			throw new AppException(BookletErrorCode.BOOKLET_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const bestPracticeCards = await this.booklet_best_practice_repository.find({ 
			where: { greenItBookletId:  existingBooklet.booklet.id }, relations: ["bestPracticeCard"] 
		});
		
		return {
			practices: bestPracticeCards.map(practice => ({
				id: practice.bestPracticeCard.id,
				priority: practice.priority,
			})),
		};
	}

	async getBannedPractices(user_id: number): Promise<{ practices: { id: number; priority: number }[] }> {
		const existingBooklet = this.getBooklet(user_id);
		if (!existingBooklet) {
			throw new Error(`Booklet for user with id ${user_id} not found`);
		}
		const practice = await this.booklet_bad_practice_repository.find({ where: { greenItBookletId: (await existingBooklet).booklet.id }, relations: ["badPracticeCard"] });
		return {
			practices: practice.map(practice => ({
				id: practice.badPracticeCard.id,
				priority: practice.priority,
			})),
		};
	}

	async addBanToBooklet(user_id: number, practice_id: number, priority: number): Promise<{ booklet: Green_IT_Booklet }> {
		const existingBooklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
		if (!existingBooklet) {
			throw new Error(`Booklet for user with id ${user_id} not found`);
		}
		const practice = await this.booklet_bad_practice_repository.findOne({ where: { greenItBookletId: existingBooklet.id, badPracticeCardId: practice_id } });
		if (practice) {
			throw new Error(`Practice with id ${practice_id} already banned`);
		}
		const badPractice = this.booklet_bad_practice_repository.create({
			greenItBookletId: existingBooklet.id,
			badPracticeCardId: practice_id,
			priority: priority,
		});
		await this.booklet_bad_practice_repository.save(badPractice);
		return { booklet: existingBooklet };
	}

	async removeBanFromBooklet(user_id: number, practice_id: number): Promise<{ booklet: Green_IT_Booklet }> {
		const existingBooklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
		if (!existingBooklet) {
			throw new Error(`Booklet for user with id ${user_id} not found`);
		}
		const practice = await this.booklet_bad_practice_repository.findOne({ where: { greenItBookletId: existingBooklet.id, badPracticeCardId: practice_id } });
		if (!practice) {
			throw new Error(`Practice with id ${practice_id} not banned`);
		}
		await this.booklet_bad_practice_repository.remove(practice);
		return { booklet: existingBooklet };
	}

	async addApplyToBooklet(user_id: number, practice_id: number, priority: number): Promise<{ booklet: Green_IT_Booklet }> {
		const existingBooklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
		if (!existingBooklet) {
			throw new Error(`Booklet for user with id ${user_id} not found`);
		}
		const practice = await this.booklet_best_practice_repository.findOne({ where: { greenItBookletId: existingBooklet.id, bestPracticeCardId: practice_id } });
		if (practice) {
			throw new Error(`Practice with id ${practice_id} already applied`);
		}
		const bestPractice = this.booklet_best_practice_repository.create({
			greenItBookletId: existingBooklet.id,
			bestPracticeCardId: practice_id,
			priority: priority,
		});
		await this.booklet_best_practice_repository.save(bestPractice);
		return { booklet: existingBooklet };
	}

	async removeApplyFromBooklet(user_id: number, practice_id: number): Promise<{ booklet: Green_IT_Booklet }> {
		const existingBooklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
		if (!existingBooklet) {
			throw new Error(`Booklet for user with id ${user_id} not found`);
		}
		const practice = await this.booklet_best_practice_repository.findOne({ where: { greenItBookletId: existingBooklet.id, bestPracticeCardId: practice_id } });
		if (!practice) {
			throw new Error(`Practice with id ${practice_id} not applied`);
		}

		await this.booklet_best_practice_repository.remove(practice);
		return { booklet: existingBooklet };
	}

	async updatePriority(user_id: number, practice_id: number, priority: number, typePractice: string): Promise<{ booklet: Green_IT_Booklet }> {
		const existingBooklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
		console.log("[service] updatePriority, type of Practice being updated ", typePractice);
		if (!existingBooklet) {
			throw new Error(`Booklet for user with id ${user_id} not found`);
		}
		if (typePractice === "bad") {
			const practice = await this.booklet_bad_practice_repository.findOne({ where: { greenItBookletId: existingBooklet.id, badPracticeCardId: practice_id } });
			if (!practice) {
				throw new Error(`Practice with id ${practice_id} not banned`);
			}
			practice.priority = priority;
			await this.booklet_bad_practice_repository.save(practice);
			console.log("updated priority", practice);
		} else {
			const practice = await this.booklet_best_practice_repository.findOne({ where: { greenItBookletId: existingBooklet.id, bestPracticeCardId: practice_id } });
			if (!practice) {
				throw new Error(`Practice with id ${practice_id} not applied`);
			}
			practice.priority = priority;
			await this.booklet_best_practice_repository.save(practice);
			console.log("updated priority", practice);
		}
		return { booklet: existingBooklet };
	}

	//method to export the booklet with all ban and applied practice, status + titre et description from card_content
	async exportBooklet(user_id: number): Promise<any> {
		// Ensure the booklet exists for the given user_id
		const existingBooklet = await this.booklet_repository.findOne({ where: { user_id: user_id } });
		if (!existingBooklet) {
			throw new Error(`Booklet for user with id ${user_id} not found`);
		}

		try {
			// Query for applied practices
			const appliedPractices = await this.dataSource.getRepository(Green_IT_Booklet_Best_Practice_Card)
			.createQueryBuilder("bpp")
			.innerJoin("best_practice_card", "bpc", "bpc.id = bpp.bestPracticeCardId")
			.innerJoin("card_content", "cc", "cc.card_id = bpc.id")
			.where("bpp.greenItBookletId = :bookletId", { bookletId: existingBooklet.id })
			.select(["cc.label AS title", "bpp.priority AS priority", "cc.description AS description"])
			.getRawMany();

			// Query for banned practices
			const bannedPractices = await this.dataSource.getRepository(Green_IT_Booklet_Bad_Practice_Card)
				.createQueryBuilder("bpp")
				.leftJoinAndSelect("bad_practice_card", "bpc", "bpc.id = bpp.badPracticeCardId")
				.leftJoinAndSelect("card_content", "cc", "cc.card_id = bpc.id")
				.where("bpp.greenItBookletId = :bookletId", { bookletId: existingBooklet.id })
				.select(["cc.label AS title", "bpp.priority AS priority", "cc.description AS description"])
				.getRawMany();

			// Combine and format the results
			const practices = [...appliedPractices.map(practice => ({ ...practice, status: "applied" })), ...bannedPractices.map(practice => ({ ...practice, status: "ban" }))];
			return practices;
		} catch (error) {
			console.error("[bookletservice] Error while exporting booklet", error);
			throw new Error("Error while exporting booklet");
		}
	}

	//To DO : method qui enlève toutes pratiques appliquées et bannies du booklet
	async clearBooklet (user_id: number): Promise<any> {
	}

	async generateFileContent(ExportDto: ExportDto): Promise<string | Uint8Array> {
		const { data, format } = ExportDto;

		if (format === 'csv') {
			return this.generateCSV(data);
		} else if (format === 'pdf') {
			return this.generatePDF(data);
		} else {
			throw new Error('Unsupported format');
		}
	}

	//TODO: finir la structure des doonées et le retour utf 8
	private generateCSV(data: any[]): string {
		const header = ['Status', 'Priority', 'Title', 'Description'];
		const csvRows = [];

		// Add header row
		const headerRow = header.join(',');
		csvRows.push(headerRow);
		console.log("headerRow", headerRow);

		// Loop over the rows and add them to the CSV
		data.forEach(row => {
			const values = [
				`"${row.status}"`, // Enclose in quotes to handle commas within the status
				`"${row.priority}"`, // Enclose in quotes to handle commas within the priority
				`"${row.title}"`, // Enclose in quotes to handle commas within the title
				`"${row.description.replace(/(\r\n|\n|\r)/gm, '\\n')}"`, // Replace newlines and enclose in quotes
			];
			const rowString = values.join(',');
			csvRows.push(rowString);
		});

		console.log("return of generateCSV service method ",csvRows.join('\n'));
		return csvRows.join('\n');
	}

	//TODO: Finir le rendu pdf 
	// Fournir bien un fichier pdf mais mise en page à faire, 
	// Retrasncrit les données dans un tableau ideallement 
	private generatePDF(data: any[]): Uint8Array {
		const doc = new jsPDF();

		data.forEach((item, index) => {
			const yPosition = 20 + (index * 40); // Adjust spacing as needed
			doc.text(`Status: ${item.status}`, 10, yPosition);
			doc.text(`Priority: ${item.priority}`, 10, yPosition + 5);
			doc.text(`Title: ${item.title}`, 10, yPosition + 10);
			doc.text(`Description: ${item.description}`, 10, yPosition + 15);
		});
		const arrayBuffer = doc.output('arraybuffer');

		return new Uint8Array(arrayBuffer); 
	}

}
