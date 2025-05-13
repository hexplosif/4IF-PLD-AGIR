import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router"
import Header from "@app/js/components/header/Header";

import styles from "./createQuestion.module.css";
import AlertPopup, { PopupType } from "@app/components/base/alertPopup/alertPopup";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";
import arrowBack from "@app/assets/icons/arrowBack.png";
import { useNavigate } from "react-router-dom";
import {
    addQuestion,
    getQuestionById,
    QuestionProps,
    QuestionResponse,
    QuestionContent,
    updateQuestion
} from "@app/js/pages/createQuestion/questionApi.ts";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import { initialQuestionResponse, newFormData } from "@app/js/pages/createQuestion/constants.ts";
import { LanguagesField, ResponsesTable } from "@components/questionForm";
import { useTranslation } from "react-i18next";

interface CreateQuestionProps {}

const CreateQuestionPage : React.FC<CreateQuestionProps> = () => {
    const { search } = useLocation();
    const { t, i18n } = useTranslation('questions');

    const searchParams = useMemo(() => new URLSearchParams(search), [search]);
    const id = searchParams.get("id");
    const isEditMode = Boolean(id);

    const maxResponses = 3;

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<PopupType>(PopupType.ERROR);

    const [questionContents, setQuestionContents] = useState<QuestionResponse>(initialQuestionResponse);
    const [initialFormData, setInitialFormData] = useState<QuestionProps>(newFormData);
    const [formData, setFormData] = useState<QuestionProps>(newFormData);
    const [languages, setLanguages] = useState<string[]>([i18n.language]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

    const navigate = useNavigate();

    const redirectToPage = (path) => {
        navigate(path);
    };

    useEffect(() => {
        if (!isEditMode) {
            setLanguages([i18n.language]);
            setSelectedLanguage(i18n.language);
        }
    }, [i18n.language]);


    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getQuestionById(Number(id))
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message);
                }
                const question: QuestionResponse = await res.json();
                const languageList = Object.keys(question.contents);

                // console.log(question);
                // console.log(Object.keys(question.contents));
                setQuestionContents(question);

                setLanguages(languageList);
                setSelectedLanguage(languageList[0]);

                const content = question.contents[languageList[0]];
                updateContent(languageList[0], question.correct_response, content);

            } catch (error) {
                console.error(error);
                setShowAlert(true);
                setAlertMessage(''+ (error instanceof Error ? error.message : error));
                setAlertType(PopupType.ERROR);
            }
        }

        if (isEditMode) {
            fetchData();
        }
    }, [id]);

    const updateContent = (language: string, correct_response: number, content: QuestionContent | null) => {
        if (content) {
            const initialData: QuestionProps = {
                language,
                description: content.description,
                responses: content.responses,
                correct_response,
            };
            setInitialFormData(initialData);
            setFormData(initialData);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let res;
            if (isEditMode) {
                res = await updateQuestion(Number(id), {
                    language: formData.language,
                    description: formData.description,
                    responses: formData.responses,
                    correct_response : formData.correct_response,
                })
            } else {
                res = await addQuestion({
                    language: formData.language,
                    description: formData.description,
                    responses: formData.responses,
                    correct_response: formData.correct_response,
                });
            }

            if (res.ok) {
                setShowAlert(true);
                setAlertMessage(`Question ${isEditMode ? 'updated' : 'created'} successfully!`);
                setAlertType(PopupType.SUCCESS);

                const updatedQuestion: QuestionResponse = await res.json();
                const languageList = Object.keys(updatedQuestion.contents);

                setQuestionContents(updatedQuestion);

                setLanguages(languageList);

                const content = updatedQuestion.contents[selectedLanguage];
                updateContent(selectedLanguage, updatedQuestion.correct_response, content);
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
    };

    const resetForm = () => {
        setFormData(initialFormData);
    }

    const selectLanguage = (language: string) => {
        const content = questionContents.contents[language];
        const formToUpdate: QuestionProps = content ? { language, description: content.description, responses: content.responses, correct_response: questionContents.correct_response }
                                                    : { ...formData, language };

        setFormData(formToUpdate);
        setInitialFormData(formToUpdate);
        setSelectedLanguage(language);
    }

    const addNewLanguage = (language: string) => {
        setLanguages([ ...languages, language ])
    }

    const handleResponseChange = (index: number, value: string) => {
        const newResponses = [...formData.responses];
        newResponses[index] = value;
        setFormData({ ...formData, responses: newResponses });
    };

    const handleAddResponse = () => {
        setFormData({
            ...formData,
            responses: [...formData.responses, ""],
        });
    };

    const handleDeleteResponse = (index: number) => {
        const newResponses = formData.responses.filter((_, i) => i !== index);

        let updatedCorrect = formData.correct_response;

        if (index + 1 === formData.correct_response) {
            updatedCorrect = 1; // reset if deleted the selected correct
        } else if (index + 1 < formData.correct_response) {
            updatedCorrect -= 1; // shift up
        }

        setFormData({
            ...formData,
            responses: newResponses,
            correct_response: updatedCorrect,
        });
    };

    return (
        <div className={styles.container}>
            <Header /> 
            <div className={styles.floatingContainer}>
                <div className={styles.headerContainer}>
                    <div className={styles.returnButton} onClick={() => redirectToPage('/admin/viewQuestions')}>
                        <img src={arrowBack} alt={t('common.return-button')}/>
                        <span>{t('common.return-button')}</span>
                    </div>

                    <h2 className={`${styles.title} text-reset`}>
                        {isEditMode ? t('create-questions.update-title') : t('create-questions.create-title')}
                    </h2>

                    <form className={styles.questionForm} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="id" className={styles.label}>{t('create-questions.language')}</label>
                            <LanguagesField isEditMode={isEditMode} languages={languages} selectedLanguage={selectedLanguage} selectLanguage={selectLanguage} addNewLanguage={addNewLanguage} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="id" className={styles.label}>{t('create-questions.description')}</label>
                            <textarea id="description" className={styles.textarea} required
                                   value={formData.description}
                                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="id" className={styles.label}>{t('create-questions.responses')} <i>({maxResponses} {t('create-questions.max-responses')})</i></label>
                            <ResponsesTable formData={formData} setFormData={setFormData} handleResponseChange={handleResponseChange} handleDeleteResponse={handleDeleteResponse} />
                            {formData.responses.length < maxResponses && (
                                <div className={styles.centerDiv}>
                                    <button className={styles.addResponseButton} type="button" onClick={handleAddResponse} >
                                        <FiPlus style={{paddingTop: "0.2rem"}}/> {t('create-questions.add-response')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.formActions}>
                            <button type="button" className={styles.resetButton} onClick={resetForm}>
                            <FiX/> {t('create-questions.reset')}
                            </button>
                            <button type="submit" className={styles.submitButton}>
                                <FiSave/> {t('create-questions.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <BackgroundImg/>

            <AlertPopup
              type={alertType}
              message={alertMessage}
              isVisible={showAlert}
              onClose={() => setShowAlert(false)}
            />
        </div>
    );
}

export default CreateQuestionPage;
