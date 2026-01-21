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
        <div className="module-item" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div
                className="module-header"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '1rem 1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)',
                    transition: 'background-color 0.2s',
                    userSelect: 'none'
                }}
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
                <div style={{ background: 'var(--bg-main)' }}>
                    {moduleLessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson.id)}
                            style={{
                                padding: '0.75rem 1.5rem 0.75rem 2.5rem',
                                cursor: 'pointer',
                                background: activeLessonId === lesson.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                borderLeft: activeLessonId === lesson.id ? '3px solid var(--primary)' : '3px solid transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'var(--transition)'
                            }}
                        >
                            {completedLessons.includes(lesson.id) ? (
                                <CheckCircle size={16} color="var(--success)" />
                            ) : activeLessonId === lesson.id ? (
                                <PlayCircle size={16} style={{ color: 'var(--primary)' }} />
                            ) : (
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--text-muted)' }} />
                            )}

                            <div style={{ flex: 1 }}>
                                <p style={{
                                    fontSize: '0.9rem',
                                    margin: 0,
                                    color: activeLessonId === lesson.id ? 'var(--primary)' : 'var(--text-primary)'
                                }}>
                                    {lesson.title}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lesson.duration}</span>
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
