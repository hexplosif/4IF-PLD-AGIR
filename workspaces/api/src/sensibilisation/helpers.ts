import { resolve } from 'path';
import { existsSync, readFileSync, appendFileSync, createReadStream } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import * as csv from 'csv-parser';
import { QuestionDto, QuestionResponse } from "@app/sensibilisation/dtos";
import { Question } from "@app/entity/question";

export const mappingQuestionResponse = (question: Question) : QuestionResponse => {
    const response: QuestionResponse = {
        id: question.id,
        correct_response: question.correct_response,
        contents: {},
    };

    for (const content of question.question_contents) {
        response.contents[content.language] = {
            description: content.description,
            responses: content.responses,
        };
    }

    return response;
}

const csvFilePath = resolve(__dirname, '../../../../src/dataQuizz.csv');

export async function appendQuestionToCSV(id: number, questionDto: QuestionDto) {
    const responses = questionDto.responses ?? [];

    // Ensure file ends with a newline (to avoid appending on same line)
    if (existsSync(csvFilePath)) {
        const content = readFileSync(csvFilePath, 'utf-8');
        if (!content.endsWith('\n')) {
            appendFileSync(csvFilePath, '\n');
        }
    }

    const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
            { id: 'id', title: 'id' },
            { id: 'language', title: 'language' },
            { id: 'question', title: 'question' },
            { id: 'response1', title: 'response1' },
            { id: 'response2', title: 'response2' },
            { id: 'response3', title: 'response3' },
            { id: 'solutionnb', title: 'solutionnb' },
        ],
        append: true,
        fieldDelimiter: ';', // Important for your format!
    });

    await csvWriter.writeRecords([
        {
            id,
            language: questionDto.language,
            question: questionDto.description,
            response1: responses[0] || '',
            response2: responses[1] || '',
            response3: responses[2] || '',
            solutionnb: questionDto.correct_response,
        },
    ]);
}

export async function updateQuestionInCSV(id: number, questionDto: QuestionDto) {
    return new Promise<void>((resolve, reject) => {
        const records: any[] = [];
        let foundId = false;
        let foundLanguage = false;

        createReadStream(csvFilePath)
          .pipe(csv({ separator: ';' }))
          .on('data', (row) => {
              console.log('row.id:', row.id, typeof row.id);
              console.log('parsed:', parseInt(row.id), typeof parseInt(row.id));
              console.log('id:', id, typeof id);
              console.log('equal1:', parseInt(row.id) === id);
              console.log('equal2:', row.id === id);

              if (row.id === id) {
                  foundId = true;
              }

              if (row.id === id && row.language === questionDto.language) {
                  foundLanguage = true;

                  const responses = questionDto.responses ?? [];
                  records.push({
                      id: id.toString(),
                      language: questionDto.language,
                      question: questionDto.description,
                      response1: responses[0] || '',
                      response2: responses[1] || '',
                      response3: responses[2] || '',
                      solutionnb: questionDto.correct_response,
                  });
              } else {
                  // Keep other rows as-is
                  records.push({
                      id: row.id,
                      language: row.language,
                      question: row.question,
                      response1: row.response1,
                      response2: row.response2,
                      response3: row.response3,
                      solutionnb: row.solutionnb,
                  });
              }
          })
          .on('end', () => {
              if (!foundId) {
                  return reject(new Error(`ID ${id} not found in file CSV.`));
              }

              if (foundId && !foundLanguage) {
                  const responses = questionDto.responses ?? [];
                  records.push({
                      id,
                      language: questionDto.language,
                      question: questionDto.description,
                      response1: responses[0] || '',
                      response2: responses[1] || '',
                      response3: responses[2] || '',
                      solutionnb: questionDto.correct_response,
                  });
              }

              const csvWriter = createObjectCsvWriter({
                  path: csvFilePath,
                  header: [
                      { id: 'id', title: 'id' },
                      { id: 'language', title: 'language' },
                      { id: 'question', title: 'question' },
                      { id: 'response1', title: 'response1' },
                      { id: 'response2', title: 'response2' },
                      { id: 'response3', title: 'response3' },
                      { id: 'solutionnb', title: 'solutionnb' },
                  ],
                  fieldDelimiter: ';', // Important fix!
              });

              csvWriter
                .writeRecords(records)
                .then(() => resolve())
                .catch(reject);
          })
          .on('error', reject);
    });
}
