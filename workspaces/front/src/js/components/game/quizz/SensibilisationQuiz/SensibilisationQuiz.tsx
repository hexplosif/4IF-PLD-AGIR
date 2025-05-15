import React from 'react';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useRecoilState } from 'recoil';
import { SensibilisationQuestionState } from "@app/js/states/gameStates";
import { GameModeQuiz } from "@app/components/question";
import { useTranslation } from "react-i18next";

interface SensibilisationQuizProps {
}

const SensibilisationQuiz: React.FC<SensibilisationQuizProps> = ({}) => {
	const { t, i18n } = useTranslation('game');

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

	const content = sensibilisationQuestion?.contents.find(
		(c) => c.language === i18n.language
	);

	return (
		<GameModeQuiz
			questionTitle={t('quizzTitle')}
			questionText={content?.description ?? ''}
			options={content?.responses.map(r => ({ label: r })) ?? []}
			onAnswer={handleResult}
			correctAnswerIndex={sensibilisationQuestion?.correct_response - 1}
			
			timeToAnswer={15}
		/>
	);
};

export default SensibilisationQuiz;