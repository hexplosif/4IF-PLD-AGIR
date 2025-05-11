import styles from "@app/js/pages/viewQuestions/viewQuestions.module.css";
import Header from "@components/header/Header.tsx";
import BackgroundImg from "@components/BackgroundImage/BackgroundImg.tsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import arrowBack from "@app/assets/icons/arrowBack.png";
import plusIcon from "@app/assets/icons/plus.png";
import editIcon from "@app/assets/icons/edit.png";
import { useNavigate } from "react-router-dom";
import { ViewModeQuiz } from "@app/components/question";

interface ViewQuestionsProps {}

const ViewQuestionsPage : React.FC<ViewQuestionsProps> = () => {
  const { t } = useTranslation('viewQuestions');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path);
  };

  const openModal = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedQuestion(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/sensibilisation/all-questions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(t('errors.fetch_questions'));
        }
        const allQuestions = await response.json();
        setQuestions(allQuestions);
      } catch (error) {
        console.error('Error fetching card info:', error.message);
        throw error;
      }
    }
    fetchData();
  }, [t]);

  console.log(questions.at(0));


  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.floatingContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.returnButton} onClick={() => redirectToPage('/admin')}>
            <img src={arrowBack} alt={t('return_button')}/>
            <span>{t('return_button')}</span>
          </div>

          <h2 className={`${styles.title} text-reset`}>{t('page_title')}</h2>

          <div className={styles.addButton} onClick={() => redirectToPage('/admin/question')}>
            <img src={plusIcon} alt={t('add_button')}/>
            <span>{t('add_button')}</span>
          </div>
        </div>

        <div className={styles.listContainer}>
          {questions.map((question, index) => (
            <div key={index} className={styles.questionContainer} onClick={() => openModal(question)}>
              <span className={styles.questionIndex}>{String(index + 1).padStart(2, '0')}</span>
              <div className={styles.divider}/>
              <span className={styles.questionContent}>{question.question}</span>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className={styles.modalBackdrop}>
            <div className={`${styles.modalContent}`}>

              <div className={styles.backButton} onClick={closeModal}>
                <img src={arrowBack} alt={t('return_button')}/>
              </div>

              <ViewModeQuiz questionText={selectedQuestion.question}
                            options={selectedQuestion.answers.responses.map((str, index) => ({
                              label: str,
                              isCorrectAnswer: index === selectedQuestion.answers.answer - 1
                            }))}
              />

              <div className={styles.editButton} onClick={() => redirectToPage(`/admin/question?id=${selectedQuestion.question_id}`)}>
                <img src={editIcon} alt={t('edit_button')}/>
                <span>{t('edit_button')}</span>
              </div>

            </div>
          </div>
        )}
      </div>
      <BackgroundImg/>
    </div>
  )
}

export default ViewQuestionsPage;