import { useEffect, useState } from 'react';
import tonne_de_bonnes_pratiques from '@app/assets/images/1_tonne_de_bonnes_pratiques.avif';
import logout from '@app/assets/icons/logout_icon.webp';
import { Menu } from '@mantine/core';
import { FiChevronDown } from 'react-icons/fi';
import { LANGUAGES_INFO } from '@app/js/constants/lang';

import styles from './Header.module.css';
import { Language } from '@shared/common/Languages';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Header() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [langue, setLangue] = useState<Language>(i18n.language as Language);

    const changerLangue = (newLangue: Language) => {
        setLangue(newLangue);
        i18n.changeLanguage(newLangue);
    };

    useEffect(() => {
        document.body.dir = i18n.dir(); //sets the body to ltr or rtl
    }, [i18n, i18n.language]);

    const handleLogout = async () => {
        const confirmLogout = window.confirm('Voulez-vous vous déconnecter ?');
        if (confirmLogout) {
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/auth/signout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Utilisation du token d'authentification
                    }
                });
                
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error.message);
            } finally {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };


    return (
        <header className={styles.header}>

            
            <img src={logout} alt="Déconnexion" onClick={handleLogout} className={styles.logoutButton} />
           
            <a href='/' className={styles.logo}>
                <img src={tonne_de_bonnes_pratiques}  alt='1 tonne de bonnes pratiques'/>
            </a>
            

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
                                    onClick={() => changerLangue(lang as Language)} 
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
