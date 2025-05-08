import { HttpStatus, Injectable } from '@nestjs/common';
import { QuizzCsvData } from './sensibilisation.type';
import { parse, ParseResult } from "papaparse";
import { Question } from '@app/entity/question';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question_Content } from '@app/entity/question_content';
import { SensibilisationQuestion } from '@shared/common/Game';
import { AppException } from '@app/exceptions/app.exception';
import { BaseErrorCode } from '@app/exceptions/enums';
import { getLanguage } from '@shared/common/Languages';
import { QuestionContent, QuestionDto, QuestionResponse } from "@app/sensibilisation/dtos";
import { appendQuestionToCSV, mappingQuestionResponse, updateQuestionInCSV } from "@app/sensibilisation/helpers";

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

		// console.log(csvData);

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
			//
			// console.log(quizz.id, language);
			// console.log(existingContent);

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

	async getSensibilisationQuizzById(id: number): Promise<QuestionResponse> {
		let quizz: Question = await this.question_repository.findOne({ where: { id } });
		let quizzContents: Question_Content[] = await this.question_content_repository.find({ where: { question_id: quizz.id } });

		let quizzDetails = quizzContents.reduce<Record<string, QuestionContent>>((acc, content) => {
			acc[content.language] = {
				description: content.description,
				responses: content.responses,
			};
			return acc;
		}, {});

		// Initialise sensibilisation avec des valeurs par défaut
		const questionResponse: QuestionResponse = {
			id: quizz.id,
			correct_response: quizz.correct_response,
			contents: quizzDetails
		}

		return questionResponse;
	}

	async getAllQuizz(): Promise<SensibilisationQuestion[]> {
		let allQuizz: Question[] = await this.question_repository.find();
		let allQuizzContent = await this.question_content_repository.find();

		const sensibilisationList: SensibilisationQuestion[] = allQuizz.map(quizz => {
			const quizzContent = allQuizzContent.find(content => content.question_id === quizz.id);

			if (!quizzContent) return null;

			return {
				question_id: quizzContent.question_id,
				question: quizzContent.description,
				answers: {
					responses: quizzContent.responses,
					answer: quizz.correct_response,
				}
			};
		}).filter((q): q is SensibilisationQuestion => q !== null); // Remove nulls

		return sensibilisationList;
	}

	async addQuestion(questionDto: QuestionDto): Promise<QuestionResponse> {

		const question = this.question_repository.create({
			correct_response: questionDto.correct_response,
		});

		const savedQuestion = await this.question_repository.save(question);

		// 2. Tạo nội dung cho câu hỏi
		const content = this.question_content_repository.create({
			question_id: savedQuestion.id,
			language: getLanguage(questionDto.language),
			description: questionDto.description,
			responses: questionDto.responses,
		});

		await this.question_content_repository.save(content);

		await appendQuestionToCSV(savedQuestion.id, questionDto);

		const createdQuestion = await this.question_repository.findOne({
			where: { id: savedQuestion.id },
			relations: ['question_contents'],
		});

		if (!createdQuestion) {
			throw new Error(`Failed to reload created question with ID ${savedQuestion.id}`);
		}

		return mappingQuestionResponse(createdQuestion);
	}

	async updateQuestionById(id: number, questionDto: QuestionDto): Promise<QuestionResponse> {
		// 1. Tìm câu hỏi hiện tại
		const existingQuestion = await this.question_repository.findOne({
			where: { id },
			relations: ['question_contents'],
		});

		if (!existingQuestion) {
			throw new Error(`Question with ID ${id} not found`);
		}

		// 2. Cập nhật thông tin chính của câu hỏi
		existingQuestion.correct_response = questionDto.correct_response;
		await this.question_repository.save(existingQuestion);

		// 3. Cập nhật nội dung câu hỏi (theo ngôn ngữ)
		const language = getLanguage(questionDto.language);
		let existingContent = existingQuestion.question_contents.find(
			content => content.language === language
		);

		if (existingContent) {
			// Cập nhật nội dung đã có
			existingContent.description = questionDto.description;
			existingContent.responses = questionDto.responses;
		} else {
			// Tạo nội dung mới nếu chưa có
			existingContent = this.question_content_repository.create({
				question_id: id,
				language,
				description: questionDto.description,
				responses: questionDto.responses,
			});
		}

		await this.question_content_repository.save(existingContent);

		await updateQuestionInCSV(id, questionDto);

		// 4. Tải lại câu hỏi đã cập nhật cùng các nội dung
		const updatedQuestion = await this.question_repository.findOne({
			where: { id },
			relations: ['question_contents'],
		});

		if (!updatedQuestion) {
			throw new Error(`Failed to reload updated question with ID ${id}`);
		}

		return mappingQuestionResponse(updatedQuestion);
	}
}
