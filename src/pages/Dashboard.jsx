import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Flame, Sparkles, Clock, Shield, Users, BookOpen, TrendingUp, Sun, Moon } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import '../components/ui/Stars.css';
import './Dashboard.css';
import '../styles/mobile-optimizations.css';
import { courseCurriculum } from '../lib/courseContent';

const Dashboard = () => {
    const navigate = useNavigate();
    const modules = courseCurriculum;
    const { theme, toggleTheme } = useTheme();
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalModules: modules.length,
        totalLessons: 0
    });

    // Detectar mobile para otimizacoes
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     window.innerWidth <= 768;

    const heroLessons = modules[0]?.lessons?.length ?? 0;
    const totalLessonsCount = modules.reduce((acc, m) => acc + m.lessons.length, 0);

    const checkAdminStatus = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'whesleycampos@hotmail.com').toLowerCase();
        if (user && user.email?.toLowerCase() === adminEmail) {
            setIsAdmin(true);
        }
    }, []);

    const fetchUserStats = useCallback(async () => {
        try {
            const { count: totalUsers } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const { data: activeProgress } = await supabase
                .from('student_progress')
                .select('user_id')
                .gte('completed_at', sevenDaysAgo.toISOString());

            const uniqueActiveUsers = new Set((activeProgress || []).map((item) => item.user_id)).size;

            setStats(prev => ({
                ...prev,
                totalUsers: totalUsers || 0,
                activeUsers: uniqueActiveUsers
            }));
        } catch (error) {
            console.error('Erro ao buscar estatisticas:', error);
        }
    }, []);

    const calculateStats = useCallback(async () => {
        const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
        setStats(prev => ({ ...prev, totalLessons }));
        await fetchUserStats();
    }, [fetchUserStats, modules]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            checkAdminStatus();
            calculateStats();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [calculateStats, checkAdminStatus]);

    const filteredModules = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        if (!normalizedQuery) {
            return modules.map((module, originalIndex) => ({ module, originalIndex }));
        }

        return modules
            .map((module, originalIndex) => ({ module, originalIndex }))
            .filter(({ module }) => {
                if (module.title.toLowerCase().includes(normalizedQuery)) return true;

                return module.lessons.some((lesson) => {
                    const lessonTitle = typeof lesson === 'object' ? lesson.title : lesson;
                    return lessonTitle.toLowerCase().includes(normalizedQuery);
                });
            });
    }, [modules, searchQuery]);

    return (
        <div className="dashboard-shell" id="main-content" role="main" data-mobile={isMobile} style={isMobile ? {
            animation: 'none',
            transition: 'none'
        } : {}}>
            {!isMobile && <div className="stars" />}
            {!isMobile && <div className="dashboard-glow" />}
            {isMobile && <style>{`
                * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
                .text-gradient-animated { animation: none !important; }
                .course-card:hover { transform: none !important; }
                .course-card__overlay { backdrop-filter: none !important; background: rgba(0,0,0,0.5) !important; }
                .pill { backdrop-filter: none !important; background: rgba(255,255,255,0.1) !important; }
            `}</style>}

            <header className="topbar">
                <div className="brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                    <img
                        src="/logo-curso.png"
                        alt="Everyday Conversation"
                        className="brand-logo"
                    />
                    <div className="brand-text">
                        <span className="brand-title">Everyday</span>
                        <span className="brand-sub">Streaming Class</span>
                    </div>
                </div>

                <div className="topbar-search">
                    <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        placeholder="Buscar aulas, temas ou professores"
                        aria-label="Buscar aulas"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />
                </div>

                <div className="topbar-actions">
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn"
                        aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="hide-mobile">
                            {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                        </span>
                    </button>
                    <div className="divider" style={{ width: '1px', height: '24px', margin: '0 0.5rem', background: 'var(--border-color)' }} />
                    <button className="pill" onClick={() => navigate('/dashboard')}>Explorar</button>
                    <button className="pill" onClick={() => navigate('/course/1', { state: { moduleIndex: 0 } })}>Continuar</button>
                </div>
            </header>

            <section className="hero" data-mobile={isMobile}>
                <div className="hero__content">
                    <span className="pill">Original Everyday - Intensivo</span>
                    <h1 className={isMobile ? '' : 'text-gradient-animated'}>Ingles com ritmo de streaming</h1>
                    <p>
                        Uma experiencia premium de aprendizado continuo: interface de streaming, lancamentos semanais e aulas rapidas para maratonar como se fosse sua serie favorita.
                    </p>
                    <div className="hero__meta">
                        <span className="pill">Nova aula toda semana</span>
                        <span className="pill">{modules.length} modulos</span>
                        <span className="pill">{heroLessons}+ aulas iniciais</span>
                    </div>
                    <div className="hero__actions">
                        <Button onClick={() => navigate('/course/1', { state: { moduleIndex: 0 } })}>
                            Assistir agora
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>
                            Minha biblioteca
                        </Button>
                    </div>
                </div>

                <div className="hero__card">
                    <div className="eyebrow">Sua maratona</div>
                    <h3>Continue de onde parou</h3>
                    <p className="shelf__subtitle">
                        Everyday Conversation em formato de temporada. Retome o episodio em andamento ou descubra o proximo drop.
                    </p>
                    <div className="hero__progress">
                        <div className="hero__progress-bar">
                            <span />
                        </div>
                        <span className="pill" style={{ background: 'rgba(94, 231, 255, 0.1)' }}>37% concluido</span>
                    </div>
                    <div className="hero__chips">
                        <span className="pill"><Clock size={14} /> 12h assistidas</span>
                        <span className="pill"><Flame size={14} /> Streak ativo</span>
                        <span className="pill"><Sparkles size={14} /> Playlists exclusivas</span>
                    </div>
                </div>
            </section>

            <section className="shelf">
                <div className="shelf__header">
                    <div>
                        <p className="eyebrow">Curso Completo</p>
                        <h2 className="shelf__title">Todas as 20 Semanas</h2>
                        <p className="shelf__subtitle">
                            {filteredModules.length} de {modules.length} semanas - {totalLessonsCount} aulas.
                        </p>
                    </div>
                </div>

                <div className="shelf__grid">
                    {filteredModules.map(({ module, originalIndex }, index) => (
                        <CourseCard
                            key={module.title}
                            title={module.title}
                            label={`${module.lessons.length} aulas`}
                            lessons={module.lessons}
                            progress={Math.max(5, Math.min(95, 10 + (index * 4.5)))}
                            image="/poster-week-1.jpg"
                            onClick={() => navigate('/course/1', { state: { moduleIndex: originalIndex } })}
                        />
                    ))}
                </div>

                {filteredModules.length === 0 && (
                    <p className="shelf__subtitle" style={{ marginTop: '0.25rem' }}>
                        Nenhuma semana encontrada para sua busca.
                    </p>
                )}
            </section>

            {isAdmin && (
                <section className="admin-section">
                    <div className="eyebrow">Acesso Restrito</div>
                    <h2>
                        <Shield size={28} />
                        Painel de Administrador
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Estatisticas e metricas da plataforma Everyday Conversation
                    </p>

                    <div className="admin-grid">
                        <div className="admin-stat">
                            <h3>Total de Alunos</h3>
                            <p>{stats.totalUsers}</p>
                            <small>
                                <Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Usuarios cadastrados
                            </small>
                        </div>

                        <div className="admin-stat">
                            <h3>Alunos Ativos</h3>
                            <p>{stats.activeUsers}</p>
                            <small>
                                <TrendingUp size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Ultimos 7 dias
                            </small>
                        </div>

                        <div className="admin-stat">
                            <h3>Modulos Disponiveis</h3>
                            <p>{stats.totalModules}</p>
                            <small>
                                <BookOpen size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Semanas de conteudo
                            </small>
                        </div>

                        <div className="admin-stat">
                            <h3>Total de Aulas</h3>
                            <p>{stats.totalLessons}</p>
                            <small>
                                <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Videos + Quizzes
                            </small>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Dashboard;
