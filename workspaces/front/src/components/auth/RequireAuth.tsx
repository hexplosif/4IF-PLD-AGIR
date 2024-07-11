import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ children }) {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/isConnected`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ access_token: token }),
                });

                if (response.ok) {
                    const result = await response.json();
                    setIsAuthenticated(result.success);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de la connexion:', error);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };

        verifyUser();
    }, []);

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            setShowAlert(true);
        }
    }, [isAuthenticated, isLoading]);

    const handleConfirm = () => {
        setShowAlert(false);
        window.location.href = '/register';
    };

    return (
        <>
            {showAlert && (
                <div className="alert">
                    <div>Veuillez vous connecter pour accéder à ces pages</div>
                    <button onClick={handleConfirm}>OK</button>
                </div>
            )}
            {isAuthenticated ? children : <div>Chargement...</div>}
        </>
    );
}

export default RequireAuth;

