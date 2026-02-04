import React from 'react';
import './Skeleton.css';

/**
 * Skeleton Loader component for loading states
 * @param {string} variant - 'text' | 'circular' | 'rectangular' | 'card'
 * @param {string} width - CSS width value
 * @param {string} height - CSS height value
 * @param {number} count - Number of skeleton items to render
 */
export const Skeleton = ({
    variant = 'text',
    width,
    height,
    count = 1,
    className = '',
    style = {}
}) => {
    const skeletons = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={`skeleton skeleton--${variant} ${className}`}
            style={{
                width: width,
                height: height,
                ...style
            }}
        />
    ));

    return count > 1 ? <>{skeletons}</> : skeletons[0];
};

/**
 * Skeleton for Course Card
 */
export const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-card__media">
            <Skeleton variant="rectangular" height="100%" />
        </div>
        <div className="skeleton-card__body">
            <Skeleton variant="text" width="40%" height="14px" />
            <Skeleton variant="text" width="90%" height="20px" />
            <Skeleton variant="text" width="70%" height="14px" />
            <div className="skeleton-card__footer">
                <Skeleton variant="rectangular" width="70%" height="6px" />
                <Skeleton variant="text" width="30px" height="14px" />
            </div>
        </div>
    </div>
);

/**
 * Skeleton for Module List
 */
export const SkeletonModuleList = ({ count = 3 }) => (
    <div className="skeleton-module-list">
        {Array.from({ length: count }, (_, i) => (
            <div key={i} className="skeleton-module-item">
                <div className="skeleton-module-header">
                    <div style={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" height="16px" />
                        <Skeleton variant="text" width="30%" height="12px" style={{ marginTop: '4px' }} />
                    </div>
                    <Skeleton variant="circular" width="18px" height="18px" />
                </div>
                {i === 0 && (
                    <div className="skeleton-lessons">
                        {Array.from({ length: 3 }, (_, j) => (
                            <div key={j} className="skeleton-lesson-item">
                                <Skeleton variant="circular" width="16px" height="16px" />
                                <div style={{ flex: 1 }}>
                                    <Skeleton variant="text" width="80%" height="14px" />
                                    <Skeleton variant="text" width="40px" height="12px" style={{ marginTop: '4px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ))}
    </div>
);

/**
 * Skeleton for Hero Section
 */
export const SkeletonHero = () => (
    <div className="skeleton-hero">
        <div className="skeleton-hero__content">
            <Skeleton variant="rectangular" width="150px" height="28px" style={{ borderRadius: '999px' }} />
            <Skeleton variant="text" width="70%" height="40px" style={{ marginTop: '1rem' }} />
            <Skeleton variant="text" width="90%" height="16px" style={{ marginTop: '0.5rem' }} />
            <Skeleton variant="text" width="60%" height="16px" style={{ marginTop: '0.25rem' }} />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Skeleton variant="rectangular" width="100px" height="28px" style={{ borderRadius: '999px' }} />
                <Skeleton variant="rectangular" width="100px" height="28px" style={{ borderRadius: '999px' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Skeleton variant="rectangular" width="140px" height="44px" style={{ borderRadius: '10px' }} />
                <Skeleton variant="rectangular" width="140px" height="44px" style={{ borderRadius: '10px' }} />
            </div>
        </div>
        <div className="skeleton-hero__card">
            <Skeleton variant="text" width="100px" height="12px" />
            <Skeleton variant="text" width="80%" height="20px" style={{ marginTop: '0.5rem' }} />
            <Skeleton variant="text" width="100%" height="14px" style={{ marginTop: '0.5rem' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                <Skeleton variant="rectangular" width="70%" height="8px" style={{ borderRadius: '999px' }} />
                <Skeleton variant="rectangular" width="80px" height="24px" style={{ borderRadius: '999px' }} />
            </div>
        </div>
    </div>
);

export default Skeleton;
