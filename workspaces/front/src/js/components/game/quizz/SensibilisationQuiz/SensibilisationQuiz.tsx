import React from 'react';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useRecoilState } from 'recoil';
import { SensibilisationQuestionState } from "@app/js/states/gameStates";
import Quiz from '@app/components/question/quiz';

interface SensibilisationQuizProps {
}

const SensibilisationQuiz: React.FC<SensibilisationQuizProps> = ({}) => {
	const { sm } = useSocketManager();
	const [{ question: sensibilisationQuestion }] = useRecoilState(SensibilisationQuestionState);

	const handleResult = (answerIndex: number | null) => {
		const answer = { answer: answerIndex === null ? null : answerIndex + 1 };

		sm.emit({
			event: ClientEvents.AnswerSensibilisationQuestion,
			data: {
				questionId: sensibilisationQuestion!.question_id,
				answer: answer,
			}
		});
	};

	return (
		<Quiz
			questionTitle='Quizz de sensibilisation'
			questionText={sensibilisationQuestion?.question}

			options={sensibilisationQuestion?.answers.responses.map(r => ({label: r}))}
			onAnswer={handleResult}
			correctAnswerIndex={sensibilisationQuestion?.answers.answer - 1}
			
			timeToAnswer={15}
		/>
	);
};

export default SensibilisationQuiz;