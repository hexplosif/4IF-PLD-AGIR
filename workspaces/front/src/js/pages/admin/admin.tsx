import React, { useCallback } from "react";
import { To, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";

import Header from "@app/js/components/header/Header";
import MenuCard from "@app/components/base/menuCard/menuCard";

import styles from './admin.module.css'; 

interface AdminPageProps {}

const AdminPage : React.FC<AdminPageProps> = () => {
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
                <h2 className={`${styles.title} text-reset`}>Admin</h2>
                <div className={`${styles.menuCardsContainer}`}>
                    <div className={`${styles.menuCardsRow}`}>
                        {getMenuCard('Créer carte', <FaPlus />, '/createCard')}
                        {getMenuCard('???', <FaPlus />, '/register')}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
