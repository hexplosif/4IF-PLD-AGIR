import ConnexionForm from "@app/js/components/connexionForm/connexionForm";
import React, { useEffect, useState } from 'react';
import RegisterForm from "@app/js/components/RegisterForm/RegisterForm";
import Header from "@app/js/components/header/Header";
import styles from './register.module.css';
import { useNavigate } from "react-router-dom";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";

interface RegisterPageProps { }
const RegisterPage: React.FC<RegisterPageProps> = () => {
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
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ token: token }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Résultat de la vérification de la connexion:', result);
          if (result.connected) {
            navigate('/menu');
            return;
          }
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
    <div className={`${styles.registerPage} main-bg-image`}>
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
