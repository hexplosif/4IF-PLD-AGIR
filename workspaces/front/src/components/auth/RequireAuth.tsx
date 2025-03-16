import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { LoadingPage } from '@app/js/pages';
import ErrorPopup from '../base/errorPopup/errorPopup';

interface RequireAuthProps {
    children: React.ReactNode;
    isAdminRequired?: boolean;
}

const RequireAuth : React.FC<RequireAuthProps> = ({ 
    children,
    isAdminRequired = false,
}) => {
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
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify({ access_token: token }),
                });

                if (response.ok) {
                    const result = await response.json();
                    setIsAuthenticated(result.isAuthenticated);
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
            setErrorMessage('Une erreur s\'est produite lors de la vérification de la connexion');
            setShowAlert(true);
            return;
        }

        if (!isAuthenticated) {
            setErrorMessage('Veuillez vous connecter pour accéder à ces pages');
            setShowAlert(true);
            return;
        }

        if (isAdminRequired && !isAdmin) {
            setErrorMessage('Vous devez être administrateur pour accéder à cette page');
            setShowAlert(true);
            return;
        }
    }, [isAuthenticated, isLoading]);

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
            <ErrorPopup
                message={errorMessage}
                isVisible={showAlert}
                clickOverlayToClose={false}
                onClose={isAdminRequired ? handleAdminConfirm : handleConfirm}
            />
        </>
    );
}

export default RequireAuth;

