import React, { FormEvent, useState } from 'react';
import styles from './connexionForm.module.css';
import cross from '@app/assets/icons/cross.png';
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useTranslation } from 'react-i18next';

interface ConnexionFormProps {
    onShowRegisterForm: () => void;
}
const ConnexionForm: React.FC<ConnexionFormProps> = ({
    onShowRegisterForm
}) => {
    const { t } = useTranslation("register");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        mail: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

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
                localStorage.setItem('role', data.role);
                navigate(data.role == 'ADMIN' ? '/admin' : '/menu');
            } else {
                const errorData = await response.json();
                setErrorMessage(t("noti.wrong-login-msg"));
                notifications.show({
                    title: t("noti.error-title"),
                    message: t("noti.wrong-login-msg"),
                    color: 'transparent',
                    icon: '🚨',
                });
                setOpenSnackbar(false);
            }
        } catch (error) {
            console.error('Erreur de connexion:', error instanceof Error ? error.message : error);
            setErrorMessage(t("noti.error-connect-msg"));
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className={styles.loginFormContainer}>  
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2>{t("login-form.title")}</h2>
                <input
                    type="email"
                    id="email"
                    name="mail"
                    placeholder={t("login-form.email")}
                    value={formData.mail}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder={t("login-form.password")}
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">{t("login-form.connexion-button")}</button>

                <div>
                    <span>{t("login-form.no-account-quote")} </span>
                    <a onClick={onShowRegisterForm}>{t("login-form.sign-up-link")}</a>
                </div>


            </form>

            {openSnackbar && (
                <div className={styles.snackbar}>
                    <span>{errorMessage}</span>
                    <img onClick={handleSnackbarClose} src={cross} className={styles.cross} />
                </div>
            )}
        </div>
    );
};

export default ConnexionForm;
