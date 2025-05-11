import React, { useEffect, useState } from 'react';
import styles from './viewModeQuiz.module.css';

type OptionQuiz = {
    label: string;
    isCorrectAnswer: boolean;
}

interface QuizProps {
	questionText: string;

	options: OptionQuiz[];
}

const ViewModeQuiz: React.FC<QuizProps> = ({
	questionText,
	options,
}) => {
  console.log(options);

	return (
        <div className={styles.quizzContainer}>
            <div className={styles.quizContentWrapper}>
                <div className={styles.quizContent}>
                    <label className={styles.questionText}>{questionText}</label>
                    <div className={styles.responsesContainer}>
                        {options.map((option, index) => (
                        <div
                            key={index}
                            className={option.isCorrectAnswer === true ? styles.correctResponseButton : styles.neutralResponseButton}
                        >
                          {option.label}
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewModeQuiz;