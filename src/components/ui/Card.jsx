import React from 'react';

export const Card = ({
    children,
    className = '',
    hover = false,
    ...props
}) => {
    return (
        <div
            className={`glass-panel ${className}`}
            style={{
                padding: '1.5rem',
                transition: 'var(--transition)',
                ...(hover ? { cursor: 'pointer' } : {})
            }}
            {...props}
        >
            {children}
        </div>
    );
};
