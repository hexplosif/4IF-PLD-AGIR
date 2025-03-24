import { useState } from 'react';
import tonne_de_bonnes_pratiques from '../../images/1_tonne_de_bonnes_pratiques.avif';
import logout from '@app/icons/logout_icon.webp';
import { Menu } from '@mantine/core';
import { FiChevronDown } from 'react-icons/fi';
import { LANGUAGES_INFO } from '@app/js/constants/lang';

import styles from './Header.module.css';
import { Language } from '@shared/common/Languages';

function Header() {
    const [langue, setLangue] = useState<Language>(Language.ENGLISH);

    const changerLangue = (newLangue: Language) => {
        setLangue(newLangue);
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
        <header className={styles.header}>

            
            <img src={logout} alt="Déconnexion" onClick={handleLogout} className={styles.logoutButton} />
           
            
            <img src={tonne_de_bonnes_pratiques} className={styles.logo} alt='1 tonne de bonnes pratiques'/>
            

            <Menu width={200} shadow="md" position="bottom-end"
                classNames={{
                    dropdown: `${styles.langDropdown}`,
                    item: `${styles.langItem} button-reset`
                }}
            >
                <Menu.Target>
                    <button className={`button-reset ${styles.langButton}`}>
                        <img className={styles.langButtonIcon} src={LANGUAGES_INFO[langue].img} alt="Changer de langue" />
                        <span className={styles.langCode}>{langue.toUpperCase()}</span>
                        <FiChevronDown className={styles.arrowIcon} />
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Sélectionner la langue</Menu.Label>
                    {Object.keys(LANGUAGES_INFO).map((lang) => {
                        const langueInfo = LANGUAGES_INFO[lang as Language];
                        if (langueInfo) {
                            return (
                                <Menu.Item 
                                    key={langueInfo.code} 
                                    onClick={() => changerLangue(langueInfo.code as Language)} 
                                    leftSection={<img src={langueInfo.img} alt={langueInfo.name} width={20} />}
                                >
                                    {langueInfo.name}
                                </Menu.Item>
                            );
                        }
                        return null;
                    })}
                </Menu.Dropdown>
            </Menu>

        </header>

    );
}

export default Header;
