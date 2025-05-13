import { QuestionProps, QuestionResponse } from "@app/js/pages/createQuestion/questionApi.ts";

export const newFormData: QuestionProps = {
  language: 'en',
  description: '',
  responses: ["", ""],
  correct_response: 1,
}

export const initialQuestionResponse: QuestionResponse = {
  question_id : 0,
  correct_response: 0,
  contents: {},
}