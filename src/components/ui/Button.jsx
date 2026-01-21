import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = variant === 'primary' ? 'btn-primary'
        : variant === 'outline' ? 'btn-outline'
            : ''; // ghost/default

    return (
        <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};
