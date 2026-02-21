import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Componente que protege rotas autenticadas
 * Redireciona para /login se o usuário não estiver autenticado
 */
const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar se existe email no localStorage
        const checkUser = () => {
            const userEmail = (localStorage.getItem('userEmail') || '').trim().toLowerCase();
            if (userEmail) {
                setUser({ email: userEmail });
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    if (loading) {
        return (
            <div className="flex-center" style={{
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid var(--border-color)',
                    borderTop: '3px solid var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: 'var(--text-secondary)' }}>Carregando...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
