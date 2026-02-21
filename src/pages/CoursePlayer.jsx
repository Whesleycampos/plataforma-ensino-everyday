import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './CoursePlayer.css';
import '../styles/mobile-optimizations.css';
import Sidebar from '../components/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlayCircle, FileText, CheckCircle, Sun, Moon, Menu, List, ChevronRight, HelpCircle, Hammer } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getCourseDetails, getStudentProgress, markLessonComplete } from '../lib/api/courses';
import { ModuleList } from '../components/ModuleList';

import { courseCurriculum } from '../lib/courseContent';
import VerbToBeInteractive from '../components/lessons/InteractiveVerbToBe';
import InteractiveWelcome from '../components/lessons/InteractiveWelcome';

// Detectar se é mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;

// Função para obter URL de embed de vídeo (Bunny.net, Vimeo, YouTube)
const getEmbedUrl = (url) => {
    if (!url) return null;

    // Bunny.net - adiciona parâmetros de otimização
    if (url.includes('mediadelivery.net')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}preload=true&autoplay=false`;
    }

    // Vimeo - converte URL pública para embed player
    if (url.includes('vimeo.com')) {
        // Extrair ID do vídeo (funciona com vimeo.com/ID ou player.vimeo.com/video/ID)
        let videoId = url.split('/').pop().split('?')[0];

        // Se já for URL de player, extrair o ID correto
        if (url.includes('player.vimeo.com/video/')) {
            videoId = url.split('player.vimeo.com/video/')[1].split('?')[0];
        } else if (url.includes('vimeo.com/')) {
            videoId = url.split('vimeo.com/')[1].split('?')[0].split('/')[0];
        }

        console.log('🎬 Vimeo Video ID extraído:', videoId);

        // URL embed do Vimeo com parâmetros otimizados
        return `https://player.vimeo.com/video/${videoId}?autoplay=0&muted=0&controls=1&title=1&byline=1&portrait=1`;
    }

    // YouTube - adiciona parâmetros de otimização
    if (url.includes('youtube') || url.includes('youtu.be')) {
        const videoId = url.includes('watch?v=')
            ? url.split('watch?v=')[1].split('&')[0]
            : url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
    }

    return url;
};

const CoursePlayer = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [flatLessons, setFlatLessons] = useState([]);
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showMobileList, setShowMobileList] = useState(false);
    const iframeRef = useRef(null);
    const [hasRequestedFullscreen, setHasRequestedFullscreen] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    // Função para entrar em fullscreen em mobile ao tocar no iframe
    const handleIframeTouchStart = useCallback(() => {
        if (isMobile && !hasRequestedFullscreen && iframeRef.current) {
            const iframe = iframeRef.current;
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen().catch(() => { });
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe.webkitEnterFullscreen) {
                iframe.webkitEnterFullscreen();
            }
            setHasRequestedFullscreen(true);
        }
    }, [hasRequestedFullscreen]);

    // Reset fullscreen flag quando muda de aula
    useEffect(() => {
        setHasRequestedFullscreen(false);
    }, [activeLessonId]);

    useEffect(() => {
        async function loadData() {
            try {
                const { course, lessons } = await getCourseDetails(id);
                const progress = await getStudentProgress();

                setCourse(course);
                setFlatLessons(lessons);
                setCompletedLessons(progress);

                // LÓGICA SIMPLIFICADA: Usa courseCurriculum como fonte única de verdade
                // O banco só serve para progresso do aluno, não para URLs de vídeo
                const mergedModules = courseCurriculum.map((module, modIndex) => {
                    return {
                        id: `mod-${modIndex}`,
                        title: module.title,
                        lessons: module.lessons.map((lessonItem, lessIndex) => {
                            const lessonTitle = typeof lessonItem === 'object' ? lessonItem.title : lessonItem;

                            // Busca no banco apenas para pegar o ID (para progresso)
                            const dbLesson = lessons.find(l =>
                                l.title.toLowerCase().includes(lessonTitle.toLowerCase().substring(0, 15)) ||
                                lessonTitle.toLowerCase().includes(l.title.toLowerCase().substring(0, 15))
                            );

                            // USA SEMPRE o courseCurriculum como fonte de dados
                            const videoUrl = typeof lessonItem === 'object' ? lessonItem.video_url : null;
                            const duration = typeof lessonItem === 'object' ? lessonItem.duration : '5 min';
                            const type = typeof lessonItem === 'object' ? lessonItem.type : 'video';
                            const component = typeof lessonItem === 'object' ? lessonItem.component : null;

                            return {
                                id: dbLesson?.id || `legacy-${modIndex}-${lessIndex}`,
                                title: lessonTitle,
                                duration: duration,
                                video_url: videoUrl,
                                type: type,
                                component: component,
                                isPlaceholder: !videoUrl
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
            await markLessonComplete(activeLessonId);
        }
    };

    const activeLesson = flatLessons.find(l => l.id === activeLessonId) ||
        modules.flatMap(m => m.lessons).find(l => l.id === activeLessonId);

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
    }, [activeLesson, lessonActivityMap]);

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
                <div className={`course-content ${showMobileList ? 'player-hidden' : ''}`}>
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
                                    // Usar iframe para todos os vídeos (Bunny.net, Vimeo, YouTube)
                                    (() => {
                                        const embedUrl = getEmbedUrl(activeLesson.video_url);
                                        console.log('🎬 URL Original:', activeLesson.video_url);
                                        console.log('🎬 URL Embed:', embedUrl);
                                        return (
                                            <iframe
                                                ref={iframeRef}
                                                src={embedUrl}
                                                title={activeLesson.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                                allowFullScreen
                                                style={{ backgroundColor: '#000' }}
                                                onTouchStart={handleIframeTouchStart}
                                            ></iframe>
                                        );
                                    })()
                                ) : (
                                    <div className="player-placeholder under-construction">
                                        <div className="construction-badge">
                                            <Hammer size={48} className="construction-icon" />
                                        </div>
                                        <h3 className="construction-title">Em construção</h3>
                                        <p className="construction-subtitle">Pronto em menos de 5 dias</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Materiais de Prática - só mostra se tiver activity_links */}
                    {activityLinks && activityLinks.length > 0 && (
                        <div className="practice-card-wrapper" style={{ marginTop: '0.5rem' }}>
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
                        </div>
                    )}

                    {/* Botão de Concluir Aula - visível em mobile, abaixo dos materiais */}
                    <button
                        className={`mobile-complete-btn ${completedLessons.includes(activeLessonId) ? 'mobile-complete-btn--done' : ''}`}
                        onClick={() => setShowConfirmPopup(true)}
                    >
                        <CheckCircle size={24} />
                        <span>{completedLessons.includes(activeLessonId) ? 'Aula Concluída!' : 'Concluir Aula'}</span>
                    </button>
                </div>

                {/* Popup de confirmação */}
                {showConfirmPopup && (
                    <div className="confirm-popup-overlay" onClick={() => setShowConfirmPopup(false)}>
                        <div className="confirm-popup" onClick={e => e.stopPropagation()}>
                            <h3>Você já estudou os materiais de prática?</h3>
                            <div className="confirm-popup__buttons">
                                <button
                                    className="confirm-popup__btn confirm-popup__btn--yes"
                                    onClick={() => {
                                        handleMarkComplete();
                                        setShowConfirmPopup(false);
                                    }}
                                >
                                    Sim
                                </button>
                                <button
                                    className="confirm-popup__btn confirm-popup__btn--no"
                                    onClick={() => setShowConfirmPopup(false)}
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile toggle button for course list */}
                <button
                    className="mobile-list-toggle"
                    onClick={() => {
                        const newState = !showMobileList;
                        setShowMobileList(newState);
                        if (newState) {
                            setTimeout(() => {
                                document.querySelector('.mobile-list-toggle')?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }, 100);
                        }
                    }}
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
