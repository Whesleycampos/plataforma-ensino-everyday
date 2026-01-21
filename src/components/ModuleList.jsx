import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, PlayCircle, CheckCircle, Lock } from 'lucide-react';

const ModuleItem = ({ module, lessons, activeLessonId, completedLessons, onSelectLesson, isDefaultOpen }) => {
    const [isOpen, setIsOpen] = useState(isDefaultOpen);

    // Update isOpen when isDefaultOpen changes (e.g. navigation from dashboard)
    useEffect(() => {
        setIsOpen(isDefaultOpen);
    }, [isDefaultOpen]);

    // Filter lessons that belong to this module (if we used IDs)
    // For now, we assume 'lessons' passed here ARE the lessons for this module
    const moduleLessons = lessons;

    const totalLessons = moduleLessons.length;
    const completedCount = moduleLessons.filter(l => completedLessons.includes(l.id)).length;

    return (
        <div className="module-item">
            <div
                className="module-header"
                onClick={() => setIsOpen(!isOpen)}
                style={{ userSelect: 'none' }}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{module.title}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {completedCount}/{totalLessons} Aulas
                    </span>
                </div>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </div>

            {isOpen && (
                <div style={{ background: 'transparent' }}>
                    {moduleLessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson.id)}
                            className={`lesson-item ${activeLessonId === lesson.id ? 'active' : ''}`}
                        >
                            {completedLessons.includes(lesson.id) ? (
                                <CheckCircle size={16} color="var(--success)" />
                            ) : activeLessonId === lesson.id ? (
                                <PlayCircle size={16} style={{ color: 'var(--primary)' }} />
                            ) : (
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--text-muted)' }} />
                            )}

                            <div style={{ flex: 1 }}>
                                <p className="lesson-title">
                                    {lesson.title}
                                </p>
                                <span className="lesson-duration">{lesson.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const ModuleList = ({ modules, allLessons, activeLessonId, completedLessons, onSelectLesson, expandedModuleIndex }) => {
    return (
        <div className="module-list">
            {modules.map((module, index) => (
                <ModuleItem
                    key={index}
                    module={module}
                    lessons={module.lessons} // Use the pre-grouped lessons
                    activeLessonId={activeLessonId}
                    completedLessons={completedLessons}
                    onSelectLesson={onSelectLesson}
                    isDefaultOpen={expandedModuleIndex === index}
                />
            ))}
        </div>
    );
};
