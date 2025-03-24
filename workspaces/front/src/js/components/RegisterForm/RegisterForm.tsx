import React, { useState, useTransition } from 'react';
import '../../../CSS/App.css';
import cross from '@app/assets/icons/cross.png';
import styles from './RegisterForm.module.css';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';


const RegisterForm = ({ onSuccessfulRegistration, onShowRegisterForm }) => {
  const { t } = useTranslation("register");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage(t("register-errors.password-too-short"));
      setOpenSnackbar(true);
      return;
    }
    if (password === confirmPassword) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mail: email,
            password: password,
            lastname: lastname, // Ajoutez le nom et le prénom ici si nécessaire
            firstname: firstname, // Ajoutez le nom et le prénom ici si nécessaire
          }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
            onSuccessfulRegistration();
        } else {
            setErrorMessage(data.message || t("register-errors.registration-error"));
            setOpenSnackbar(true);
        }
      } catch (error) {
        console.error('Error registering user:', error);
        setErrorMessage(t("register-errors.registration-error"));
        setOpenSnackbar(true);
      }
    } else {
      notifications.show({
        title: t("register-errors.registration-failed"),
        message: t("register-errors.password-mismatch"),
        color: 'transparent',
        icon: '🚨',
      });
      setErrorMessage(t("register-errors.password-mismatch"));
      setOpenSnackbar(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={styles.registerFormContainer}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2>{t("register.title")}</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("register.email-placeholder")}
          required
        />

        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder={t("register.lastname-placeholder")}
          required
        />

        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder={t("register.firstname-placeholder")}
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("register.password-placeholder")}
          required
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("register.confirm-password-placeholder")}
          required
        />

        <button type="submit">{t("register.submit-button")}</button>

        <div>
          <span>{t("register.already-have-account")} </span>
          <a onClick={onShowRegisterForm}>{t("register.login-link")}</a>
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

export default RegisterForm;