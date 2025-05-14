import styles from "@app/js/pages/viewQuestions/viewQuestions.module.css";
import Header from "@components/header/Header.tsx";
import BackgroundImg from "@components/BackgroundImage/BackgroundImg.tsx";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import arrowBack from "@app/assets/icons/arrowBack.png";
import editIcon from "@app/assets/icons/edit.png";
import { useNavigate } from "react-router-dom";
import { ViewModeQuiz } from "@app/components/question";
import { FiPlus, FiUpload } from "react-icons/fi";
import { loadQuestionCsv } from "@app/js/pages/createQuestion/questionApi.ts";
import AlertPopup, { PopupType } from "@app/components/base/alertPopup/alertPopup.tsx";

interface ViewQuestionsProps {}

const ViewQuestionsPage : React.FC<ViewQuestionsProps> = () => {
  const { t, i18n } = useTranslation('questions');

  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<PopupType>(PopupType.ERROR);

  const csvFormRef = useRef(null);

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

  const fetchData = async ()=> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sensibilisation/all-questions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': i18n.language,
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

  const handleCsvButtonClick = () => {
    csvFormRef.current.click();
  }

  const handleCsvInput = async (event) => {

    try {
      const file = event.target.files[0];
      if (!file) {
        throw new Error(t('errors.upload-file'))
      };

      const res = await loadQuestionCsv(file);

      if (res.ok) {
        await fetchData();

        setShowAlert(true);
        setAlertMessage(t('success.upload-file'));
        setAlertType(PopupType.SUCCESS);
      } else {
        const error = await res.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
      setShowAlert(true);
      setAlertMessage(''+ (error instanceof Error ? error.message : error));
      setAlertType(PopupType.ERROR);
    }
  }

  useEffect(() => {
   fetchData();
  }, [t]);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.floatingContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.returnButton} onClick={() => redirectToPage('/admin')}>
            <img src={arrowBack} alt={t('common.return-button')}/>
            <span>{t('common.return-button')}</span>
          </div>

          <h2 className={`${styles.title} text-reset`}>{t('view-questions.page-title')}</h2>
          <div className={styles.buttonContainer}>
            <button className={styles.addButton} onClick={handleCsvButtonClick}>
              <FiUpload/> {t('view-questions.load-button')}
            </button>
            <input
              type="file"
              accept=".csv"
              ref={csvFormRef}
              style={{display: 'none'}}
              onChange={handleCsvInput}
            />
            <button className={styles.addButton} onClick={() => redirectToPage('/admin/question')}>
              <FiPlus/> {t('view-questions.add-button')}
            </button>
          </div>
        </div>

        <div className={styles.listContainer}>
          {questions.map((question, index) => {
            const content = question.contents[0];
            return (
              <div key={index} className={styles.questionContainer} onClick={() => openModal(question)}>
                <span className={styles.questionIndex}>{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.divider}/>
                <span className={styles.questionContent}>{content.description}</span>
              </div>
            )
          })}
        </div>

        {isModalOpen && (() => {
          const content = selectedQuestion.contents[0];

          return (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalContent}>

                <div className={styles.backButton} onClick={closeModal}>
                  <img src={arrowBack} alt={t('common.return-button')} />
                </div>

                <ViewModeQuiz
                  questionText={content.description}
                  options={content.responses.map((str, index) => ({
                    label: str,
                    isCorrectAnswer: index === selectedQuestion.correct_response - 1
                  }))}
                />

                <div
                  className={styles.editButton}
                  onClick={() => redirectToPage(`/admin/question?id=${selectedQuestion.question_id}`)}
                >
                  <img src={editIcon} alt={t('view-questions.edit-button')} />
                  <span>{t('view-questions.edit-button')}</span>
                </div>

              </div>
            </div>
          );
        })()}
      </div>
      <BackgroundImg/>
      <AlertPopup
        type={alertType}
        message={alertMessage}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  )
}

export default ViewQuestionsPage;