import React, { useState, useEffect, useMemo } from 'react';
import './CoursePlayer.css';
import Sidebar from '../components/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlayCircle, FileText, CheckCircle, Sun, Moon, Menu, List, ChevronRight, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useParams, useLocation } from 'react-router-dom';
import { getCourseDetails, getStudentProgress, markLessonComplete } from '../lib/api/courses';
import { ModuleList } from '../components/ModuleList';

import { courseCurriculum } from '../lib/courseContent';
import VerbToBeInteractive from '../components/lessons/InteractiveVerbToBe';
import InteractiveWelcome from '../components/lessons/InteractiveWelcome';

// Função para obter URL de embed de vídeo (Bunny.net, Vimeo, YouTube)
const getEmbedUrl = (url) => {
    if (!url) return null;

    // Bunny.net - já está em formato embed
    if (url.includes('mediadelivery.net')) {
        return url;
    }

    // Vimeo
    if (url.includes('vimeo')) {
        const videoId = url.split('/').pop().split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
    }

    // YouTube
    if (url.includes('youtube') || url.includes('youtu.be')) {
        const videoId = url.includes('watch?v=')
            ? url.split('watch?v=')[1].split('&')[0]
            : url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
};

const CoursePlayer = () => {
    const { id } = useParams();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [flatLessons, setFlatLessons] = useState([]);
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showMobileList, setShowMobileList] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const { course, lessons } = await getCourseDetails(id);
                const progress = await getStudentProgress();

                setCourse(course);
                setFlatLessons(lessons);

                // Merge progresso do Supabase com progresso local (para aulas legacy)
                const localProgress = JSON.parse(localStorage.getItem('legacy_progress') || '[]');
                setCompletedLessons([...progress, ...localProgress]);

                // NOVA LÓGICA: Sempre usa courseCurriculum como base
                // Faz match por título para adicionar video_url do banco quando disponível
                const mergedModules = courseCurriculum.map((module, modIndex) => {
                    return {
                        id: `mod-${modIndex}`,
                        title: module.title,
                        lessons: module.lessons.map((lessonItem, lessIndex) => {
                            const lessonTitle = typeof lessonItem === 'object' ? lessonItem.title : lessonItem;

                            // Busca no banco por título similar (primeiros 15 caracteres)
                            const dbLesson = lessons.find(l =>
                                l.title.toLowerCase().includes(lessonTitle.toLowerCase().substring(0, 15)) ||
                                lessonTitle.toLowerCase().includes(l.title.toLowerCase().substring(0, 15))
                            );

                            return {
                                id: dbLesson?.id || `legacy-${modIndex}-${lessIndex}`,
                                title: lessonTitle, // Mantém o título do currículo para consistência
                                duration: dbLesson?.duration || (typeof lessonItem === 'object' ? lessonItem.duration : '5 min'),
                                video_url: dbLesson?.video_url || (typeof lessonItem === 'object' ? lessonItem.video_url : null),
                                type: dbLesson?.type || (typeof lessonItem === 'object' ? lessonItem.type : 'video'),
                                component: dbLesson?.component || (typeof lessonItem === 'object' ? lessonItem.component : null),
                                isPlaceholder: !dbLesson
                            };
                        })
                    };
                });

                setModules(mergedModules);

                // Definir a aula ativa - usa o módulo selecionado ou o primeiro disponível
                const passedModuleIndex = location.state?.moduleIndex;

                if (passedModuleIndex !== undefined && mergedModules[passedModuleIndex]) {
                    const targetModule = mergedModules[passedModuleIndex];
                    if (targetModule && targetModule.lessons.length > 0) {
                        setActiveLessonId(targetModule.lessons[0].id);
                    }
                } else if (mergedModules.length > 0 && mergedModules[0].lessons.length > 0) {
                    setActiveLessonId(mergedModules[0].lessons[0].id);
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
        if (!activeLessonId) return;

        if (!completedLessons.includes(activeLessonId)) {
            setCompletedLessons(prev => [...prev, activeLessonId]);

            if (activeLessonId.toString().startsWith('legacy')) {
                // Salva progresso de aulas legacy no localStorage
                const localProgress = JSON.parse(localStorage.getItem('legacy_progress') || '[]');
                if (!localProgress.includes(activeLessonId)) {
                    localProgress.push(activeLessonId);
                    localStorage.setItem('legacy_progress', JSON.stringify(localProgress));
                }
            } else {
                await markLessonComplete(activeLessonId);
            }
        }
    };

    const activeLesson = flatLessons.find(l => l.id === activeLessonId) ||
        modules.flatMap(m => m.lessons).find(l => l.id === activeLessonId);
    const currentLessonIndex = flatLessons.findIndex(l => l.id === activeLessonId);
    const nextLesson = currentLessonIndex >= 0 ? flatLessons[currentLessonIndex + 1] : null;

    // Criar lookup map uma única vez para melhor performance (O(1) vs O(n²))
    const lessonActivityMap = useMemo(() => {
        const map = new Map();
        const normalizeTitle = (title) => title.toLowerCase().trim().replace(/\s+/g, ' ');

        for (const module of courseCurriculum) {
            for (const lesson of module.lessons) {
                if (typeof lesson !== 'object' || !lesson.activity_links) continue;
                const normalized = normalizeTitle(lesson.title);
                map.set(normalized, lesson.activity_links);
            }
        }

        return map;
    }, []); // Só cria uma vez no mount

    // Encontrar activity_links usando lookup O(1)
    const activityLinks = useMemo(() => {
        if (!activeLesson) return null;

        const normalizeTitle = (title) => title.toLowerCase().trim().replace(/\s+/g, ' ');
        const activeNormalized = normalizeTitle(activeLesson.title);

        // Busca exata primeiro
        if (lessonActivityMap.has(activeNormalized)) {
            return lessonActivityMap.get(activeNormalized);
        }

        // Fallback: busca por substring (mais lento, mas só quando necessário)
        for (const [lessonKey, links] of lessonActivityMap.entries()) {
            if (activeNormalized.includes(lessonKey) || lessonKey.includes(activeNormalized)) {
                return links;
            }
        }

        return null;
    }, [activeLesson?.title, lessonActivityMap]);

    // DEBUG: Log para investigar problema com activity_links
    console.log('🔍 DEBUG CoursePlayer:', {
        activeLesson: activeLesson?.title,
        activityLinks: activityLinks,
        activityLinksCount: activityLinks?.length || 0,
        courseCurriculumModules: courseCurriculum.length
    });

    if (loading) return (
        <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Carregando seu curso...</p>
        </div>
    );

    if (!course) return (
        <div className="flex-center" style={{ height: '100vh' }}>
            <Card style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1rem' }}>Curso não encontrado</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Não conseguimos localizar o curso que você está procurando.
                </p>
                <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
            </Card>
        </div>
    );

    return (
        <div className="course-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="course-main" id="main-content" role="main">
                <div className="course-content">
                    <div className="course-header">
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    {/* Hamburger Menu Button - visible on tablet/mobile */}
                                    <button
                                        className="hamburger-btn"
                                        onClick={() => setSidebarOpen(true)}
                                        aria-label="Abrir menu"
                                    >
                                        <Menu size={24} />
                                    </button>
                                    <div>
                                        <p className="eyebrow">Everyday Originals</p>
                                        <h1 className="course-title" style={{ marginTop: '0.4rem', fontSize: '1.9rem' }}>
                                            {activeLesson?.title || course.title}
                                        </h1>
                                    </div>
                                </div>
                                <div className="course-actions" style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
                                    <button
                                        onClick={toggleTheme}
                                        className="theme-toggle-btn"
                                        aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                                    >
                                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                        <span className="hide-mobile">
                                            {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                                        </span>
                                    </button>
                                    <Button
                                        variant={completedLessons.includes(activeLessonId) ? 'outline' : 'primary'}
                                        onClick={handleMarkComplete}
                                    >
                                        {completedLessons.includes(activeLessonId) ? (
                                            <><CheckCircle size={18} color="var(--success)" /> Concluída</>
                                        ) : (
                                            <>Marcar como concluída</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="course-meta" style={{ marginTop: '1rem' }}>
                                <span className="pill">{course.title}</span>
                                <span className="pill">{flatLessons.length} aulas</span>
                                <span className="pill">{activeLesson?.duration || '5 min'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="player-frame">
                        {activeLesson?.type === 'interactive' ? (
                            <div className="interactive-container">
                                {activeLesson.component === 'InteractiveWelcome' && (
                                    <InteractiveWelcome onComplete={handleMarkComplete} />
                                )}
                                {activeLesson.component === 'VerbToBeInteractive' && (
                                    <VerbToBeInteractive onComplete={handleMarkComplete} />
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="player-overlay">
                                    <span className="pill">Em reprodução</span>
                                    <span className="pill">{activeLesson?.duration || '5 min'}</span>
                                </div>
                                {activeLesson?.video_url ? (
                                    <iframe
                                        src={getEmbedUrl(activeLesson.video_url)}
                                        title={activeLesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                        allowFullScreen
                                        loading="lazy"
                                    ></iframe>
                                ) : (
                                    <div className="player-placeholder">
                                        <PlayCircle size={48} style={{ opacity: 0.6 }} />
                                        <p>
                                            {activeLesson
                                                ? "Este conteúdo não possui vídeo disponível."
                                                : "Selecione uma aula para assistir"
                                            }
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <Card style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <FileText size={18} style={{ color: 'var(--text-secondary)' }} />
                            <h3 style={{ margin: 0 }}>Sobre a aula</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            {activeLesson?.title?.toLowerCase().includes('verb') || activeLesson?.title?.toLowerCase().includes('to be')
                                ? 'Nesta aula você vai aprender o verbo TO BE (ser/estar), um dos verbos mais importantes do inglês. Domine as formas afirmativa, negativa e interrogativa com exemplos práticos do dia a dia.'
                                : activeLesson?.title?.toLowerCase().includes('adjetiv') || activeLesson?.title?.toLowerCase().includes('possessiv')
                                ? 'Aprenda a diferença entre pronomes possessivos (my, your, his, her) e adjetivos possessivos. Domine quando usar cada um em frases do cotidiano.'
                                : activeLesson?.title?.toLowerCase().includes('welcome') || activeLesson?.title?.toLowerCase().includes('bem-vindo')
                                ? 'Bem-vindo ao Everyday Conversation! Nesta aula de boas-vindas, você vai conhecer a metodologia do curso e dar os primeiros passos no seu aprendizado de inglês.'
                                : activeLesson?.title?.toLowerCase().includes('pronome') || activeLesson?.title?.toLowerCase().includes('pronoun')
                                ? 'Aprenda os pronomes pessoais em inglês (I, You, He, She, It, We, They) e como usá-los corretamente em frases do cotidiano.'
                                : activeLesson?.title?.toLowerCase().includes('present')
                                ? 'Domine o Present Tense em inglês! Aprenda a conjugar verbos no presente e formar frases para falar sobre rotinas e fatos.'
                                : activeLesson?.title?.toLowerCase().includes('past')
                                ? 'Aprenda o Past Tense para falar sobre eventos que já aconteceram. Verbos regulares, irregulares e expressões de tempo.'
                                : activeLesson?.title?.toLowerCase().includes('future')
                                ? 'Descubra como falar sobre o futuro em inglês usando will, going to e outras estruturas essenciais.'
                                : 'Aproveite esta aula do Everyday Conversation! Assista com atenção, pratique os exercícios e não esqueça de fazer os quizzes para fixar o conteúdo.'}
                        </p>

                        {/* Renderização dinâmica de activity_links */}
                        {activityLinks && activityLinks.length > 0 ? (
                            <div className="practice-section">
                                <div className="practice-section__header">
                                    <h3>Materiais de Prática</h3>
                                    <p>Atividades e exercícios para fixar o conteúdo</p>
                                </div>
                                <div className="practice-cards">
                                    {activityLinks.map((link, index) => {
                                        const isQuiz = link.title.toLowerCase().includes('quiz');
                                        return (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`practice-card ${isQuiz ? 'practice-card--quiz' : 'practice-card--examples'}`}
                                            >
                                                <div className="practice-card__icon">
                                                    {isQuiz ? <HelpCircle size={28} /> : <FileText size={28} />}
                                                </div>
                                                <div className="practice-card__content">
                                                    <span className="practice-card__label">{isQuiz ? 'Quiz' : 'Exemplos'}</span>
                                                    <h4 className="practice-card__title">{link.title}</h4>
                                                    <p className="practice-card__desc">
                                                        {isQuiz ? 'Teste seus conhecimentos' : 'Veja exemplos práticos'}
                                                    </p>
                                                </div>
                                                <div className="practice-card__arrow">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="practice-section">
                                <div className="practice-section__header">
                                    <h3>Materiais em breve</h3>
                                    <p>Estamos preparando exercícios e quizzes para esta aula</p>
                                </div>
                                <div className="practice-card practice-card--coming-soon" style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px dashed rgba(255,255,255,0.15)',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    borderRadius: '16px'
                                }}>
                                    <PlayCircle size={40} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
                                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                                        Os materiais de prática para "{activeLesson?.title}" estarão disponíveis em breve!
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Mobile toggle button for course list */}
                <button
                    className="mobile-list-toggle"
                    onClick={() => setShowMobileList(!showMobileList)}
                    aria-label={showMobileList ? 'Esconder lista de aulas' : 'Mostrar lista de aulas'}
                >
                    <List size={20} />
                    <span>{showMobileList ? 'Esconder aulas' : 'Ver aulas'}</span>
                </button>

                <div className={`course-list ${showMobileList ? 'course-list--mobile-open' : ''}`}>
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
                            onSelectLesson={(lessonId) => {
                                setActiveLessonId(lessonId);
                                // Close mobile list when lesson is selected
                                if (window.innerWidth <= 768) {
                                    setShowMobileList(false);
                                }
                            }}
                            expandedModuleIndex={location.state?.moduleIndex ?? 0}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CoursePlayer;
