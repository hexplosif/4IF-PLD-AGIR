import React, { useState } from "react";

import Header from "@app/js/components/header/Header";

import styles from "./createQuestion.module.css";
import AlertPopup, { PopupType } from "@app/components/base/alertPopup/alertPopup";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";
import arrowBack from "@app/assets/icons/arrowBack.png";
import { useNavigate } from "react-router-dom";

interface CreateQuestionProps {}

const CreateCardPage : React.FC<CreateQuestionProps> = () => {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<PopupType>(PopupType.ERROR);

    const navigate = useNavigate();

    const redirectToPage = (path) => {
        navigate(path);
    };

    return (
        <div className={styles.container}>
            <Header /> 
            <div className={styles.floatingContainer}>
                <div className={styles.headerContainer}>
                    <div className={styles.returnButton} onClick={() => redirectToPage('/admin/viewQuestions')}>
                        <img src={arrowBack} alt={'Back'}/>
                        <span>Back</span>
                    </div>

                    <h2 className={`${styles.title} text-reset`}>Create Question</h2>
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

export default CreateCardPage;
