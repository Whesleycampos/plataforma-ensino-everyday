import React from 'react';

/**
 * LoadingSpinner - Componente de loading para code splitting
 * Exibido durante carregamento lazy de páginas
 */
export const LoadingSpinner = () => (
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

export default LoadingSpinner;
