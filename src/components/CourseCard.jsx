import React from 'react';
import { Card } from './ui/Card';
import { PlayCircle, Music, HelpCircle, FileText } from 'lucide-react';

const CourseCard = ({ title, description, progress = 0, image, onClick, label, lessons = [] }) => {
    const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

    // Função para determinar o ícone baseado no título da aula
    const getLessonIcon = (lessonTitle) => {
        const titleLower = lessonTitle.toLowerCase();
        if (titleLower.includes('música') || titleLower.includes('music')) {
            return <Music size={12} className="lesson-icon music" />;
        }
        if (titleLower.includes('quiz') || titleLower.includes('teste')) {
            return <HelpCircle size={12} className="lesson-icon quiz" />;
        }
        if (titleLower.includes('texto') || titleLower.includes('áudio')) {
            return <FileText size={12} className="lesson-icon text" />;
        }
        return <PlayCircle size={12} className="lesson-icon video" />;
    };

    // Extrai o título da aula (pode ser string ou objeto)
    const getLessonTitle = (lesson) => {
        if (typeof lesson === 'object' && lesson.title) {
            return lesson.title;
        }
        return lesson;
    };

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

                {/* Lista de todas as aulas */}
                {lessons.length > 0 && (
                    <ul className="course-card__lessons">
                        {lessons.map((lesson, index) => {
                            const lessonTitle = getLessonTitle(lesson);
                            return (
                                <li key={index} className="course-card__lesson-item">
                                    {getLessonIcon(lessonTitle)}
                                    <span>{lessonTitle}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Fallback para description se não houver lessons */}
                {lessons.length === 0 && description && (
                    <p className="course-card__desc">{description}</p>
                )}

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
