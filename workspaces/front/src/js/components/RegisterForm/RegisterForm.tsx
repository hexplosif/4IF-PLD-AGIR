import React, { useState } from 'react';
import '../../../CSS/App.css';
import cross from '../../../icons/cross.png';
import styles from './RegisterForm.module.css';
import { notifications } from '@mantine/notifications';


const RegisterForm = ({ onSuccessfulRegistration, onShowRegisterForm }) => {
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
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
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
        if (response.ok) {
          if (data.success) {
            onSuccessfulRegistration();
          } else {
            setErrorMessage(data.message || 'Une erreur s\'est produite lors de l\'inscription.');
            setOpenSnackbar(true);
          }
        } else {
          // Sinon, affichez l'erreur
          setErrorMessage(data.error || 'Une erreur s\'est produite lors de l\'inscription.');
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error('Error registering user:', error);
        setErrorMessage('Une erreur s\'est produite lors de l\'inscription.');
        setOpenSnackbar(true);
      }
    } else {
      notifications.show({
        title: 'Inscription échouée',
        message: 'Les mots de passe ne correspondent pas.',
        color: 'transparent',
        icon: '🚨',
      });
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setOpenSnackbar(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2>Inscription</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e-mail"
          required
        />

        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="nom"
          required
        />

        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="prénom"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="mot de passe"
          required
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="confirmation du mot de passe"
          required
        />

        <button type="submit">S'inscrire</button>

        <div>
          <span>Vous avez un compte ? </span>
          <a onClick={onShowRegisterForm}>Connectez vous.</a>
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



/*const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      // Effectuez ici votre action de soumission du formulaire
      setErrorMessage('');
      // Réinitialisez les champs de formulaire
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Basculez vers le formulaire de connexion
      onSuccessfulRegistration();
    } else {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      {openSnackbar && (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
          {errorMessage}
          <button onClick={handleSnackbarClose} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Fermer</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="inputContainerRegisterForm"> 
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="inputContainerRegisterForm">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>
        <div className="inputContainerRegisterForm">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmation du mot de passe"
            required
          />
        </div>
        <div>
          <button className={styles.buttonregister} type="submit">S'inscrire</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;*/