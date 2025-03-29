import { HttpStatus, Injectable } from '@nestjs/common';
import { QuizzCsvData } from './sensibilisation.type';
import {parse, ParseResult} from "papaparse";
import { Question } from '@app/entity/question';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question_Content } from '@app/entity/question_content';
import { SensibilisationQuestion } from '@shared/common/Game';
import { AppException } from '@app/exceptions/app.exception';
import { BaseErrorCode, QuizzErrorCode } from '@app/exceptions/enums';
import { getLanguage } from '@shared/common/Languages';

@Injectable()
export class SensibilisationService {
	constructor(
		@InjectRepository(Question)
		private question_repository: Repository<Question>,
		@InjectRepository(Question_Content)
		private question_content_repository: Repository<Question_Content>
	) {}

	async parseCsv(file: Express.Multer.File) {
		console.log('[sensibilisation.service] parseCsv from file: ', file.originalname);

		const csvData : QuizzCsvData[] = [];
		parse<QuizzCsvData>(file.buffer.toString(), { 
			header: true,
			skipEmptyLines: 'greedy', 
			complete: (result : ParseResult<QuizzCsvData>) => csvData.push(...result.data),
			error: (error : any) => { throw new AppException(BaseErrorCode.READ_CSV_FILE_ERROR, HttpStatus.BAD_REQUEST, error.message); }
		});

		const allQuizz = []
		for (const row of csvData) {
			const { id, language, question, response1, response2, response3, solutionnb } = row;

			let quizz: Question = await this.question_repository.findOne({ where: { id } });
			if (quizz) {
				console.log('[sensibilisation.service] parseCsv quizz already exists: ', quizz);
				throw new AppException(QuizzErrorCode.CARD_ID_EXISTED, HttpStatus.BAD_REQUEST, `Quizz id ${id} already exists`);
			}

			quizz = this.question_repository.create({ id, correct_response: solutionnb  });
			quizz = await this.question_repository.save(quizz);
			console.log('[sensibilisation.service] parseCsv quizz: ', quizz.id);

			// Save quiz content to database
			let quizz_content = this.question_content_repository.create({
				question_id: id,
				language: getLanguage(language),
				description: question,
				responses: [response1, response2, response3]
			});
			quizz_content = await this.question_content_repository.save(quizz_content);
			// Save quizz to database
			quizz.question_contents = [quizz_content];
			
			allQuizz.push (await this.question_repository.save(quizz));
		};

		return allQuizz;
	}

	async getSensibilisationQuizz(): Promise<SensibilisationQuestion> {
		let allQuizz: Question[] = await this.question_repository.find();
		const index = Math.floor(Math.random() * (allQuizz.length))

		let quizz = allQuizz[index];
		let quizzContent: Question_Content = await this.question_content_repository.findOne({ where: { question_id: quizz.id } });

		// Initialise sensibilisation avec des valeurs par défaut
		const sensibilisation: SensibilisationQuestion = {
			question_id: quizzContent.question_id,
			question: quizzContent.description,
			answers: {
				responses: quizzContent.responses,
				answer: quizz.correct_response,
			}
		};

		return sensibilisation;
	}
}
