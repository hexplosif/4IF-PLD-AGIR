import React, { FormEvent, useState } from 'react';
import styles from './connexionForm.module.css';
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useTranslation } from 'react-i18next';

interface ConnexionFormProps {
    onShowRegisterForm: () => void;
}
const ConnexionForm: React.FC<ConnexionFormProps> = ({
    onShowRegisterForm
}) => {
    const { t, i18n } = useTranslation("register");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ mail: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Accept-Language': i18n.language,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json(); // Récupération de la réponse JSON
                notifications.show({
                    title: t("noti.welcome-title"),
                    message: t("noti.welcome-msg"),
                    color: 'transparent',
                    icon: '👋',
                });
                localStorage.setItem('token', data.access_token); // Stockage du token dans le Local Storage
                navigate(data.role == 'ADMIN' ? '/admin' : '/menu');
                return;
            } 

            const errorData = await response.json();
            setErrorMessage( errorData?.message || t("noti.wrong-login-msg"));
        } catch (error) {
            console.error('Erreur de connexion:', error instanceof Error ? error.message : error);
            setErrorMessage(t("noti.error-connect-msg"));
        }
    };

    return (
        <div className={styles.loginFormContainer}>  
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2>{t("login-form.title")}</h2>
                <input
                    type="email" id="email" name="mail" required
                    placeholder={t("login-form.email")}
                    value={formData.mail} onChange={handleChange}
                />

                <input
                    type="password" id="password" name="password" required
                    placeholder={t("login-form.password")}
                    value={formData.password} onChange={handleChange}
                />

                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

                <button type="submit">{t("login-form.connexion-button")}</button>

                <div>
                    <span>{t("login-form.no-account-quote")} </span>
                    <a onClick={onShowRegisterForm}>{t("login-form.sign-up-link")}</a>
                </div>


            </form>
        </div>
    );
};

export default ConnexionForm;
