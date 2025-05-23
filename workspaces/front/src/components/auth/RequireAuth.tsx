import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { LoadingPage } from '@app/js/pages';
import AlertPopup, { PopupType } from '../base/alertPopup/alertPopup';
import { useTranslation } from 'react-i18next';

interface RequireAuthProps {
    children: React.ReactNode;
    isAdminRequired?: boolean;
}

const RequireAuth : React.FC<RequireAuthProps> = ({ 
    children,
    isAdminRequired = false,
}) => {
    const { i18n, t } = useTranslation('requireAuth');
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorFetching, setIsErrorFetching] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            setIsLoading(true);
            setIsErrorFetching(false);
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/isConnected`, {
                    method: 'GET',
                    headers: { 
                        'Accept-Language': i18n.language,
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Utilisation du token d'authentification
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    setIsAuthenticated(result.connected);
                    setIsAdmin(result.role === 'ADMIN');
                } else {
                    setIsAuthenticated(false);
                }  
            } catch (error) {
                console.error('Erreur lors de la vérification de la connexion:', error);
                setIsAuthenticated(false);
                setIsErrorFetching(true);
            }

            setIsLoading(false);
        };

        verifyUser();
    }, []);

    useEffect(() => {
        if (isLoading) {
            setShowAlert(false);
            return;
        };

        if (isErrorFetching) {
            setErrorMessage(t('errorMessages.connectionError'));
            setShowAlert(true);
            return;
        }

        if (!isAuthenticated) {
            setErrorMessage(t('errorMessages.loginRequired'));
            setShowAlert(true);
            return;
        }

        if (isAdminRequired && !isAdmin) {
            setErrorMessage(t('errorMessages.adminRequired'));
            setShowAlert(true);
            return;
        }
    }, [isAuthenticated, isLoading, isAdminRequired, isAdmin, t]);

    const handleConfirm = () => {
        setShowAlert(false);
        navigate('/register');
    };

    const handleAdminConfirm = () => {
        setShowAlert(false);
        navigate(isAuthenticated ? '/menu' : '/register');
    }

    return (
        <>
            {(!isLoading && isAuthenticated && (!isAdminRequired || isAdminRequired == isAdmin)) ? children : <LoadingPage/> }
            <AlertPopup
                type={PopupType.ERROR}
                message={errorMessage}
                isVisible={showAlert}
                clickOverlayToClose={false}
                onClose={isAdminRequired ? handleAdminConfirm : handleConfirm}
            />
        </>
    );
}

export default RequireAuth;