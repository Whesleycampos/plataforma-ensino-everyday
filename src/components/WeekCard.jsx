import React from 'react';
import { PlayCircle, BookOpen, Music, FileText, HelpCircle } from 'lucide-react';

const WeekCard = ({ weekNumber, title, lessons, progress = 0, onClick }) => {
    const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

    // Função para determinar o ícone baseado no título da aula
    const getLessonIcon = (lessonTitle) => {
        const titleLower = lessonTitle.toLowerCase();
        if (titleLower.includes('música') || titleLower.includes('music')) {
            return <Music size={14} />;
        }
        if (titleLower.includes('quiz') || titleLower.includes('teste')) {
            return <HelpCircle size={14} />;
        }
        if (titleLower.includes('texto') || titleLower.includes('áudio')) {
            return <FileText size={14} />;
        }
        return <PlayCircle size={14} />;
    };

    // Extrai o título da aula (pode ser string ou objeto)
    const getLessonTitle = (lesson) => {
        if (typeof lesson === 'object' && lesson.title) {
            return lesson.title;
        }
        return lesson;
    };

    return (
        <div className="week-card" onClick={onClick}>
            <div className="week-card__header">
                <div className="week-card__number">
                    <span>{weekNumber}</span>
                </div>
                <div className="week-card__info">
                    <h3 className="week-card__title">{title}</h3>
                    <span className="week-card__count">
                        <BookOpen size={14} />
                        {lessons.length} aulas
                    </span>
                </div>
                <div className="week-card__progress-circle">
                    <svg viewBox="0 0 36 36">
                        <path
                            className="week-card__progress-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className="week-card__progress-fill"
                            strokeDasharray={`${safeProgress}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <span className="week-card__progress-text">{safeProgress}%</span>
                </div>
            </div>

            <div className="week-card__lessons">
                {lessons.map((lesson, index) => {
                    const lessonTitle = getLessonTitle(lesson);
                    return (
                        <div key={index} className="week-card__lesson">
                            {getLessonIcon(lessonTitle)}
                            <span>{lessonTitle}</span>
                        </div>
                    );
                })}
            </div>

            <div className="week-card__footer">
                <button className="week-card__btn">
                    <PlayCircle size={18} />
                    Assistir
                </button>
            </div>
        </div>
    );
};

export default WeekCard;
