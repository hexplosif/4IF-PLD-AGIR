import React, { useEffect, useState } from 'react';
import styles from './gameModeQuiz.module.css';

type OptionQuiz = {
    label: string;
    disabled?: boolean;
}

interface QuizProps {
	questionTitle: string;
	questionText: string;

	options: OptionQuiz[];
	onAnswer: (index: number | null, option: OptionQuiz | null) => void; // null means user didn't answer when timer expired
	correctAnswerIndex?: number | null,
	
	resultMessages?: string;
	timeToAnswer?: number | null; // Optional timer in seconds

	simulationImage?: React.ReactElement,
}

const GameModeQuiz: React.FC<QuizProps> = ({
	questionTitle,
	questionText,
	options,
	onAnswer,
	correctAnswerIndex = null,
	resultMessages,
	timeToAnswer = null,
	simulationImage,
}) => {
	const [message, setMessage] = useState("");

	const [answerChosenIndex, setAnswerChosenIndex] = useState<number | null>(null);
	const [quizzCompleted, setQuizzCompleted] = useState(false);

	const [timeRemaining, setTimeRemaining] = useState(timeToAnswer);
	const [timeIsUp, setTimeIsUp] = useState(false);

	// Countdown timer
	useEffect(() => {
		if (timeToAnswer === null) return;
		const timer = timeRemaining > 0 
		  ? setTimeout(() => setTimeRemaining(prev => prev - 1), 1000)
		  : setTimeout(() => setTimeIsUp(true), 0);
	
		return () => clearTimeout(timer);
	}, [timeRemaining]);


	// Handle timeout
	useEffect(() => {
		if (timeIsUp && !quizzCompleted) {
		    handleAnswer(null, null);
		}
	}, [timeIsUp, quizzCompleted]);


	const handleAnswer = (option: OptionQuiz | null, index: number | null) => {
		if (answerChosenIndex) return;
		setAnswerChosenIndex(index);
		onAnswer(index, option);
		
		// Customize result message if provided, otherwise use default
		const defaultMessage = 
			index === null
			? `Le temps est écoulé. Vous n'avez pas répondu.`
			: (correctAnswerIndex !== null
			    ? (correctAnswerIndex === index
					? `Bien joué, vous avez répondu correctement.`
					: `Dommage, ce n'est pas la bonne réponse.`)
				: `Vous avez chosis ${option.label}.`);

		
		setMessage( resultMessages || defaultMessage );
		setQuizzCompleted(true);
	}

	const getButtonClass = (answerIndex: number) => {
		if (!quizzCompleted) {
		  return answerChosenIndex === answerIndex 
			? styles.selectedResponseButton 
			: styles.responseButton;
		}
		
		const hasCorrectAnswer = correctAnswerIndex !== null;
		const isCorrectAnswer = correctAnswerIndex === answerIndex;
		const isChosenAnswer = answerIndex === answerChosenIndex;
	
		if ( (!hasCorrectAnswer && isChosenAnswer) || isCorrectAnswer) return styles.correctResponseButton;
		if (hasCorrectAnswer && isChosenAnswer && !isCorrectAnswer ) return styles.incorrectResponseButton;
		return styles.neutralResponseButton;
	  };

	return (
        <div className={`${styles.quizzContainer} ${simulationImage ? styles.withImage : ''}`}>
            <div className={styles.quizContentWrapper}>
                <div className={styles.quizContent}>
                    <h2 className={styles.quizTitle}>{questionTitle}</h2>

                    <div className={styles.timerContainer}>
                        <div 
                            className={styles.timer}
                            style={{
                            width: `${ quizzCompleted ? 0 : (timeRemaining / 15) * 100}%`,
                            backgroundColor: timeRemaining <= 5 ? 'var(--danger)' : 'var(--primary)'
                            }}
                        />
                    </div>
                    
                    <div className={styles.questionContainer}>
                        <label className={styles.questionText}>{questionText}</label>

                        <div className={styles.responsesContainer}>
                            {options.map((option, index) => (
                            <button
                                key={index}
                                className={`${getButtonClass(index)} ${styles.buttonReset} ${quizzCompleted || option.disabled ? styles.disableHover : ''}`}
                                onClick={() => handleAnswer(option, index)}
                                disabled={quizzCompleted || option.disabled }
                            >
                                {option.label}
                            </button>
                            ))}
                        </div>

                        {message && (
                            <div className={styles.resultMessageContainer}>
                                <p className={styles.resultMessage}>{message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {simulationImage && (
                <div className={styles.simulationImageContainer}>
                    {simulationImage}
                </div>
            )}
        </div>
    );
};

export default GameModeQuiz;