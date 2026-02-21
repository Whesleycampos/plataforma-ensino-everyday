import React from 'react';

export const Card = ({
    children,
    className = '',
    hover = false,
    style = {},
    ...props
}) => {
    return (
        <div
            className={`glass-panel ${className}`}
            style={{
                padding: '1.5rem',
                transition: 'var(--transition-base)',
                ...(hover ? { cursor: 'pointer' } : {}),
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    );
};
