import React, { FormEvent, useState } from 'react';
import styles from './connexionForm.module.css';
import cross from '../../../icons/cross.png';
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

interface ConnexionFormProps {
    onShowRegisterForm: () => void;
}
const ConnexionForm: React.FC<ConnexionFormProps> = ({
    onShowRegisterForm
}) => {
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
                    title: 'Bienvenue !',
                    message: 'Vous êtes maintenant connecté.',
                    color: 'transparent',
                    icon: '👋',
                });
                localStorage.setItem('token', data.access_token); // Stockage du token dans le Local Storage
                localStorage.setItem('role', data.role);
                navigate(data.role == 'ADMIN' ? '/admin' : '/menu');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Une erreur s\'est produite lors de la connexion.');
                notifications.show({
                    title: 'Connexion échouée',
                    message: 'Veuillez vérifier votre mot de passe ou identifiant.',
                    color: 'transparent',
                    icon: '🚨',
                });
                setOpenSnackbar(false);
            }
        } catch (error) {
            console.error('Erreur de connexion:', error instanceof Error ? error.message : error);
            setErrorMessage('Une erreur s\'est produite lors de la connexion.');
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2>Connexion</h2>
                <input
                    type="email"
                    id="email"
                    name="mail"
                    placeholder="e-mail"
                    value={formData.mail}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Connexion</button>

                <div>
                    <span>Pas de compte ? </span>
                    <a onClick={onShowRegisterForm}>Inscrivez vous.</a>
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
