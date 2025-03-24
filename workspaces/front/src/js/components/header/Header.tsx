import React, { useState } from 'react';
import './Header.css';
import tonne_de_bonnes_pratiques from '@app/assets/images/1_tonne_de_bonnes_pratiques.avif';

import drapeau_fr from '@app/assets/icons/drapeau_fr.webp';
import drapeau_en from '@app/assets/icons/drapeau_en.webp';
import logout from '@app/assets/icons/logout_icon.webp';

function Header() {
    const [langue, setLangue] = useState('fr');

    const changerLangue = () => {
        setLangue(langue === 'fr' ? 'en' : 'fr');
    };

    const handleLogout = async () => {
        const confirmLogout = window.confirm('Voulez-vous vous déconnecter ?');
        if (confirmLogout) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Utilisation du token d'authentification
                    }
                });

                if (response.ok) {
                    localStorage.removeItem('token');
                    console.log('Déconnexion réussie.');
                    window.location.href = '/'; // Redirection vers la page de connexion
                } else {
                    console.error('Erreur lors de la déconnexion:', response.statusText);
                }
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error.message);
            }
        }
    };


    return (
        <header className="header">

            
            <img src={logout} alt="Déconnexion" onClick={handleLogout} className="logout-btn" />
           
            
            <img src={tonne_de_bonnes_pratiques} className="logo" alt='1 tonne de bonnes pratiques'/>
            

            <img src={langue === 'fr' ? drapeau_fr : drapeau_en} alt="Changer de langue" onClick={changerLangue} className="lang-btn" />
     

        </header>

    );
}

export default Header;
