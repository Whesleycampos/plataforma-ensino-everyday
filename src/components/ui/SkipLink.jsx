import React from 'react';
import './SkipLink.css';

/**
 * SkipLink component for keyboard navigation accessibility
 * Allows users to skip directly to main content
 */
export const SkipLink = ({ href = '#main-content', children = 'Pular para o conteúdo principal' }) => {
    return (
        <a href={href} className="skip-link">
            {children}
        </a>
    );
};

export default SkipLink;
