import React, { useCallback } from "react";
import { To, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import Header from "@app/js/components/header/Header";
import MenuCard from "@app/components/base/menuCard/menuCard";

import styles from './admin.module.css'; 
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";

interface AdminPageProps {}

const AdminPage : React.FC<AdminPageProps> = () => {
    const { t } = useTranslation("admin");
    const navigate = useNavigate();

    const redirectToPage = useCallback((path : To) => {
        navigate(path);
    }, []);

    const getMenuCard = useCallback((label : string, icon : React.ReactElement, pathToRedirect: string) => {
        return (
            <div className={styles.menuCardElement}>
                <MenuCard label={label} icon={icon} onClick={() => redirectToPage(pathToRedirect)}/>
            </div>
        );
    }, [redirectToPage]);

    return (
        <div className={styles.container}>
            <Header /> 
            <div className={`floating-container`}>
                <h2 className={`${styles.title} text-reset`}>{t("admin.title")}</h2>
                <div className={`${styles.menuCardsContainer}`}>
                    <div className={`${styles.menuCardsRow}`}>
                        {getMenuCard(t("admin.view-card"), <FaPlus />, '/admin/viewCard')}
                        {getMenuCard(t("admin.view-question"), <FaPlus />, '/admin/viewQuestions')}
                    </div>
                </div>
            </div>
            <BackgroundImg/>
        </div>
    );
}

export default AdminPage;
