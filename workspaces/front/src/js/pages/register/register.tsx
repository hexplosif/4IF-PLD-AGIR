import ConnexionForm from "@app/js/components/connexionForm/connexionForm";
import React, { useEffect, useState } from 'react';
import RegisterForm from "@app/js/components/RegisterForm/RegisterForm";
import Header from "@app/js/components/header/Header";
import styles from './register.module.css';
import { useNavigate } from "react-router-dom";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";
import { useTranslation } from "react-i18next";

interface RegisterPageProps { }
const RegisterPage: React.FC<RegisterPageProps> = () => {
  const {i18n} = useTranslation();
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté, si oui, il est navigé vers menu
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) { return; }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/isConnected`, {
          method: 'POST',
          headers: { 
            'Accept-Language': i18n.language,
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({ token: token }),
        });

        if (response.ok) {
          const result = await response.json();
          result.connected && navigate(result.role == 'ADMIN' ? '/admin' : '/menu');
        }
        localStorage.removeItem('token');
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion:', error);
        localStorage.removeItem('token');
      }
    };
    verifyUser();
  }, []);

  const handleSuccessfulRegistration = () => {
    setShowLoginForm(true); // Revenir au formulaire de connexion après une inscription réussie
  };

  return (
    <div className={`${styles.registerPage}`}>
      <Header />
      {showLoginForm ? (
        <ConnexionForm onShowRegisterForm={() => setShowLoginForm(false)} />
      ) : (
        <RegisterForm onSuccessfulRegistration={handleSuccessfulRegistration} onShowRegisterForm={() => setShowLoginForm(true)} />
      )}
      <BackgroundImg/>
    </div>
  );
};

export default RegisterPage;
