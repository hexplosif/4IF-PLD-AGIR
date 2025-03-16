import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

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
                    setIsAdmin(role === 'ADMIN');

                    return;
                } 
                setIsAuthenticated(false);
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
        navigate('./register')
    };

    const handleAdminConfirm = () => {
        navigate('/menu')
    }

    return (
        <>
            {!isAuthenticated && (
                <div className="alert">
                    <div>Veuillez vous connecter pour accéder à ces pages</div>
                    <button onClick={handleConfirm}>OK</button>
                </div>
            )}

            {isAuthenticated && isAdminRequired && !isAdmin && (
                <div className="alert">
                    <div>Vous devez être administrateur pour accéder à cette page</div>
                    <button onClick={handleAdminConfirm}>OK</button>
                </div>
            )
            }
            {isAuthenticated && (!isAdminRequired || isAdminRequired == isAdmin) ? children : <div>Chargement...</div>}
        </>
    );
}

export default RequireAuth;

