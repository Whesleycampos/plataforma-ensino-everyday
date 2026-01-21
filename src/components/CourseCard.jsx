import React from 'react';
import { Card } from './ui/Card';
import { PlayCircle } from 'lucide-react';

const CourseCard = ({ title, description, progress = 0, image, onClick, label }) => {
    const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

    return (
        <Card
            className="course-card"
            hover
            onClick={onClick}
            style={{
                padding: 0,
                overflow: 'hidden',
                background: 'var(--bg-card)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: 'var(--shadow-md)'
            }}
        >
            <div className="course-card__media">
                <img
                    src={image || 'https://placehold.co/600x800/0c1324/FFF?text=Playlist'}
                    alt={title}
                />
                <div className="course-card__overlay" />
                <div className="course-card__pill pill">
                    {label || 'Playlist'}
                </div>
                <div className="course-card__play">
                    <PlayCircle size={26} />
                </div>
            </div>

            <div className="course-card__body">
                <h3 className="course-card__title">{title}</h3>
                <p className="course-card__desc">
                    {description || 'Aulas liberadas para maratonar'}
                </p>
                <div className="course-card__footer">
                    <div className="course-card__progress">
                        <span style={{ width: `${safeProgress}%` }} />
                    </div>
                    <span className="course-card__progress-label">{safeProgress}%</span>
                </div>
            </div>
        </Card>
    );
};

export default CourseCard;
