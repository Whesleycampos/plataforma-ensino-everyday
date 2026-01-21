import React, { useState, useEffect } from 'react';
import './CoursePlayer.css';
import Sidebar from '../components/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlayCircle, FileText, CheckCircle } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import { getCourseDetails, getStudentProgress, markLessonComplete } from '../lib/api/courses';
import { ModuleList } from '../components/ModuleList';

import { courseCurriculum } from '../lib/courseContent';

const CoursePlayer = () => {
    const { id } = useParams();
    const location = useLocation();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [flatLessons, setFlatLessons] = useState([]);
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const { course, lessons } = await getCourseDetails(id);
                const progress = await getStudentProgress();

                setCourse(course);
                setFlatLessons(lessons);
                setCompletedLessons(progress);

                const mergedModules = courseCurriculum.map((module, modIndex) => ({
                    id: `mod-${modIndex}`,
                    title: module.title,
                    lessons: module.lessons.map((lessonTitle, lessIndex) => {
                        const dbLesson = lessons.find(l =>
                            l.title.toLowerCase().trim() === lessonTitle.toLowerCase().trim() ||
                            l.title.toLowerCase().includes(lessonTitle.toLowerCase().substring(0, 20))
                        );

                        return {
                            id: dbLesson ? dbLesson.id : `legacy-${modIndex}-${lessIndex}`,
                            title: lessonTitle,
                            duration: dbLesson ? dbLesson.duration : '5 min',
                            video_url: dbLesson ? dbLesson.video_url : null,
                            isPlaceholder: !dbLesson
                        };
                    })
                }));

                setModules(mergedModules);

                const passedModuleIndex = location.state?.moduleIndex;

                if (passedModuleIndex !== undefined && passedModuleIndex !== null && mergedModules[passedModuleIndex]) {
                    const targetModule = mergedModules[passedModuleIndex];
                    if (targetModule && targetModule.lessons.length > 0) {
                        const firstReal = targetModule.lessons.find(l => !l.isPlaceholder);
                        setActiveLessonId(firstReal ? firstReal.id : targetModule.lessons[0].id);
                    }
                } else if (mergedModules.length > 0 && mergedModules[0].lessons.length > 0) {
                    const firstReal = mergedModules[0].lessons.find(l => !l.isPlaceholder);
                    if (firstReal) setActiveLessonId(firstReal.id);
                    else setActiveLessonId(mergedModules[0].lessons[0].id);
                } else if (lessons.length > 0) {
                    setActiveLessonId(lessons[0].id);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id, location.state]);

    const handleMarkComplete = async () => {
        if (!activeLessonId || activeLessonId.toString().startsWith('legacy')) return;
        await markLessonComplete(activeLessonId);
        setCompletedLessons([...completedLessons, activeLessonId]);
    };

    const activeLesson = flatLessons.find(l => l.id === activeLessonId) ||
        modules.flatMap(m => m.lessons).find(l => l.id === activeLessonId);
    const currentLessonIndex = flatLessons.findIndex(l => l.id === activeLessonId);
    const nextLesson = currentLessonIndex >= 0 ? flatLessons[currentLessonIndex + 1] : null;

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Carregando aula...</div>;
    if (!course) return <div className="flex-center" style={{ height: '100vh' }}>Curso não encontrado</div>;

    return (
        <div className="course-layout">
            <Sidebar />

            <main className="course-main">
                <div className="course-content">
                    <div className="course-header">
                        <div>
                            <p className="eyebrow">Everyday Originals</p>
                            <h1 style={{ marginTop: '0.4rem', fontSize: '1.9rem' }}>
                                {activeLesson?.title || course.title}
                            </h1>
                            <div className="course-meta">
                                <span className="pill">{course.title}</span>
                                <span className="pill">{flatLessons.length} aulas</span>
                                <span className="pill">{activeLesson?.duration || '5 min'}</span>
                            </div>
                        </div>
                        <Button
                            variant={completedLessons.includes(activeLessonId) ? 'outline' : 'primary'}
                            onClick={handleMarkComplete}
                        >
                            {completedLessons.includes(activeLessonId) ? (
                                <><CheckCircle size={18} color="var(--success)" /> Aula concluída</>
                            ) : (
                                <>Marcar como concluída</>
                            )}
                        </Button>
                    </div>

                    <div className="player-frame">
                        <div className="player-overlay">
                            <span className="pill">Em reprodução</span>
                            <span className="pill">{activeLesson?.duration || '5 min'}</span>
                        </div>
                        {activeLesson?.video_url ? (
                            <iframe
                                src={
                                    activeLesson.video_url.includes('vimeo')
                                        ? `https://player.vimeo.com/video/${activeLesson.video_url.split('/').pop().split('?')[0]}`
                                        : activeLesson.video_url.replace('watch?v=', 'embed/')
                                }
                                title={activeLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="player-placeholder">
                                <PlayCircle size={48} style={{ opacity: 0.6 }} />
                                <p>Selecione uma aula para assistir</p>
                            </div>
                        )}
                    </div>

                    <Card style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <FileText size={18} style={{ color: 'var(--text-secondary)' }} />
                                    <h3 style={{ margin: 0 }}>Sobre a aula</h3>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    {course.description || 'Aproveite o modo cinema para assistir em tela cheia e use a lista ao lado para navegar entre as aulas.'}
                                </p>
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px',
                                padding: '1rem'
                            }}>
                                <p className="eyebrow">Próximo episódio</p>
                                <h4 style={{ margin: '0.35rem 0' }}>{nextLesson?.title || 'Você está no último conteúdo'}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {nextLesson ? 'Assista na sequência para manter o ritmo.' : 'Revise qualquer módulo na barra lateral.'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="course-list">
                    <div className="course-list__header">
                        <h3 style={{ fontSize: '1.1rem' }}>Conteúdo do curso</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {flatLessons.length} aulas disponíveis
                        </p>
                    </div>

                    <div className="course-list__body">
                        <ModuleList
                            modules={modules}
                            allLessons={flatLessons}
                            activeLessonId={activeLessonId}
                            completedLessons={completedLessons}
                            onSelectLesson={setActiveLessonId}
                            expandedModuleIndex={location.state?.moduleIndex ?? 0}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CoursePlayer;
