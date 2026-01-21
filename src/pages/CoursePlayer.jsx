import React, { useState, useEffect } from 'react';
import './CoursePlayer.css'; // Import Responsive Styles
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
    const [flatLessons, setFlatLessons] = useState([]); // Keep flat list for easy navigation logic
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load course data
    useEffect(() => {
        async function loadData() {
            try {
                const { course, lessons } = await getCourseDetails(id);
                const progress = await getStudentProgress();

                setCourse(course);
                setFlatLessons(lessons);
                setCompletedLessons(progress);

                // --- MERGE STATIC STRUCTURE WITH DB DATA ---
                // We use the static curriculum as the base structure.
                // We try to find a matching lesson in the DB by title.
                // If found, we attach the real lesson details (id, video_url).
                // If not found, we mark it as 'locked' or 'coming soon' (or just show title without link).

                const mergedModules = courseCurriculum.map((module, modIndex) => ({
                    id: `mod-${modIndex}`,
                    title: module.title,
                    lessons: module.lessons.map((lessonTitle, lessIndex) => {
                        // Fuzzy match or exact match the title
                        // For now, exact match or partial include
                        const dbLesson = lessons.find(l =>
                            l.title.toLowerCase().trim() === lessonTitle.toLowerCase().trim() ||
                            l.title.toLowerCase().includes(lessonTitle.toLowerCase().substring(0, 20)) // primitive fuzzy
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

                // Set active lesson logic
                const passedModuleIndex = location.state?.moduleIndex;

                if (passedModuleIndex !== undefined && passedModuleIndex !== null && mergedModules[passedModuleIndex]) {
                    // Check if specific module requested
                    const targetModule = mergedModules[passedModuleIndex];
                    if (targetModule && targetModule.lessons.length > 0) {
                        const firstReal = targetModule.lessons.find(l => !l.isPlaceholder);
                        setActiveLessonId(firstReal ? firstReal.id : targetModule.lessons[0].id);
                    }
                } else if (mergedModules.length > 0 && mergedModules[0].lessons.length > 0) {
                    // Default fallback
                    const firstReal = mergedModules[0].lessons.find(l => !l.isPlaceholder);
                    if (firstReal) setActiveLessonId(firstReal.id);
                    else setActiveLessonId(mergedModules[0].lessons[0].id);
                } else if (lessons.length > 0) {
                    setActiveLessonId(lessons[0].id);
                }
                // --------------------------------

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    const handleMarkComplete = async () => {
        if (!activeLessonId || activeLessonId.toString().startsWith('legacy')) return;
        await markLessonComplete(activeLessonId);
        setCompletedLessons([...completedLessons, activeLessonId]);
    };

    // Find the active lesson object from either grouping or flat list fallback
    const activeLesson = flatLessons.find(l => l.id === activeLessonId) ||
        modules.flatMap(m => m.lessons).find(l => l.id === activeLessonId);

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Carregando aula...</div>;
    if (!course) return <div className="flex-center" style={{ height: '100vh' }}>Curso não encontrado</div>;

    return (
        <div className="course-layout">
            <Sidebar />

            <main className="course-main">
                {/* Content Area */}
                <div className="course-content">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{course.title}</span>
                        <h1 style={{ marginTop: '0.5rem', fontSize: '1.75rem' }}>
                            {activeLesson?.title || 'Selecione uma aula'}
                        </h1>
                    </div>

                    {/* Video Player */}
                    <div style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        background: 'black',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '2rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {activeLesson?.video_url ? (
                            <iframe
                                width="100%"
                                height="100%"
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
                            <div className="flex-center" style={{ height: '100%', flexDirection: 'column', background: 'var(--bg-input)' }}>
                                <PlayCircle size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                <p>Selecione uma aula para assistir</p>
                            </div>
                        )}
                    </div>

                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Descrição da Aula</h3>
                            <Button
                                variant={completedLessons.includes(activeLessonId) ? 'outline' : 'primary'}
                                onClick={handleMarkComplete}
                            >
                                {completedLessons.includes(activeLessonId) ? (
                                    <><CheckCircle size={18} color="var(--success)" /> Concluída</>
                                ) : (
                                    <>Marcar como Concluída</>
                                )}
                            </Button>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            {course.description}
                        </p>
                    </Card>
                </div>

                {/* Lesson List Sidebar */}
                <div className="course-list" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Conteúdo do Curso</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {flatLessons.length} aulas disponíveis
                        </p>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
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
