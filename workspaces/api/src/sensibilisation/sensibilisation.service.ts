import { HttpStatus, Injectable } from '@nestjs/common';
import { QuizzCsvData } from './sensibilisation.type';
import { parse, ParseResult } from "papaparse";
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
	) { }

	async parseCsv(file: Express.Multer.File) {
		console.log('[sensibilisation.service] parseCsv from file: ', file.originalname);

		const csvData: QuizzCsvData[] = [];
		parse<QuizzCsvData>(file.buffer.toString(), {
			header: true,
			skipEmptyLines: 'greedy',
			complete: (result: ParseResult<QuizzCsvData>) => csvData.push(...result.data),
			error: (error: any) => { throw new AppException(BaseErrorCode.READ_CSV_FILE_ERROR, HttpStatus.BAD_REQUEST, error.message); }
		});

		const allQuizz = []
		for (const row of csvData) {
			const { id, language, question, response1, response2, response3, solutionnb } = row;

			// 首先创建或获取问题
			let quizz: Question = await this.question_repository.findOne({ where: { id } });
			if (!quizz) {
				quizz = this.question_repository.create({ id, correct_response: solutionnb });
				quizz = await this.question_repository.save(quizz);
				console.log('[sensibilisation.service] parseCsv quizz: ', quizz.id);
			}

			// 检查是否已存在相同语言的内容
			const existingContent = await this.question_content_repository.findOne({
				where: {
					question_id: quizz.id,
					language: getLanguage(language)
				}
			});

			if (existingContent) {
				// 如果存在，更新内容
				existingContent.description = question;
				existingContent.responses = [response1, response2, response3];
				await this.question_content_repository.save(existingContent);
			} else {
				// 如果不存在，创建新内容
				const quizz_content = this.question_content_repository.create({
					question_id: quizz.id,
					language: getLanguage(language),
					description: question,
					responses: [response1, response2, response3]
				});
				await this.question_content_repository.save(quizz_content);
			}
		};

		// 返回所有问题
		return await this.question_repository.find({ relations: ['question_contents'] });
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
