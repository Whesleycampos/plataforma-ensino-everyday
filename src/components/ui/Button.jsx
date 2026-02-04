import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
    children,
    variant = 'primary',
    className = '',
    loading = false,
    disabled = false,
    loadingText = '',
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = variant === 'primary' ? 'btn-primary'
        : variant === 'outline' ? 'btn-outline'
            : variant === 'ghost' ? 'btn-ghost'
                : '';

    const isDisabled = disabled || loading;

    return (
        <button
            className={`${baseClass} ${variantClass} ${loading ? 'btn--loading' : ''} ${className}`}
            disabled={isDisabled}
            aria-busy={loading}
            {...props}
        >
            {loading && (
                <Loader2
                    size={18}
                    className="btn__spinner"
                    aria-hidden="true"
                />
            )}
            <span className={loading ? 'btn__text--loading' : ''}>
                {loading && loadingText ? loadingText : children}
            </span>
        </button>
    );
};
