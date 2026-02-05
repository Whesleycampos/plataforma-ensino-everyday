import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Flame, Sparkles, Clock, ChevronRight, Shield, Users, BookOpen, TrendingUp, Sun, Moon, Menu } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import Sidebar from '../components/Sidebar';
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalModules: modules.length,
        totalLessons: 0
    });

    // Detectar mobile para otimizações
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     window.innerWidth <= 768;

    const heroLessons = modules[0]?.lessons?.length ?? 0;
    const totalLessonsCount = modules.reduce((acc, m) => acc + m.lessons.length, 0);

    useEffect(() => {
        checkAdminStatus();
        calculateStats();
    }, []);

    const checkAdminStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email === 'whesleycampos@hotmail.com') {
            setIsAdmin(true);
        }
    };

    const calculateStats = () => {
        const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
        setStats(prev => ({ ...prev, totalLessons }));

        // Buscar estatísticas reais do banco
        fetchUserStats();
    };

    const fetchUserStats = async () => {
        try {
            // Total de usuários
            const { count: totalUsers } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // Usuários ativos (com progresso nos últimos 7 dias)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const { count: activeUsers } = await supabase
                .from('student_progress')
                .select('user_id', { count: 'exact', head: true })
                .gte('completed_at', sevenDaysAgo.toISOString());

            setStats(prev => ({
                ...prev,
                totalUsers: totalUsers || 0,
                activeUsers: activeUsers || 0
            }));
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
        }
    };

    return (
        <div className="dashboard-shell" id="main-content" role="main" data-mobile={isMobile}>
            {!isMobile && <div className="stars" />}
            {!isMobile && <div className="dashboard-glow" />}

            {/* Mobile Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <header className="topbar">
                {/* Hamburger Menu Button - visible on tablet/mobile */}
                <button
                    className="hamburger-btn"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Abrir menu"
                >
                    <Menu size={24} />
                </button>

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
                    <input placeholder="Buscar aulas, temas ou professores" />
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
                    <span className="pill">Original Everyday · Intensivo</span>
                    <h1 className={isMobile ? "" : "text-gradient-animated"}>Inglês com ritmo de streaming</h1>
                    <p>
                        Uma experiência premium de aprendizado contínuo: interface de streaming, lançamentos semanais e aulas rápidas para maratonar como se fosse sua série favorita.
                    </p>
                    <div className="hero__meta">
                        <span className="pill">Nova aula toda semana</span>
                        <span className="pill">{modules.length} módulos</span>
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
                        Everyday Conversation em formato de temporada. Retorme o episódio em andamento ou descubra o próximo drop.
                    </p>
                    <div className="hero__progress">
                        <div className="hero__progress-bar">
                            <span />
                        </div>
                        <span className="pill" style={{ background: 'rgba(94, 231, 255, 0.1)' }}>37% concluído</span>
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
                            {modules.length} semanas · {totalLessonsCount} aulas · Maratone em ordem ou escolha o tema que quer dominar.
                        </p>
                    </div>
                </div>

                <div className="shelf__grid">
                    {modules.map((module, index) => (
                        <CourseCard
                            key={module.title}
                            title={module.title}
                            label={`${module.lessons.length} aulas`}
                            lessons={module.lessons}
                            progress={Math.max(5, Math.min(95, 10 + (index * 4.5)))}
                            image="/poster-week-1.jpg"
                            onClick={() => navigate('/course/1', { state: { moduleIndex: index } })}
                        />
                    ))}
                </div>
            </section>

            {isAdmin && (
                <section className="admin-section">
                    <div className="eyebrow">Acesso Restrito</div>
                    <h2>
                        <Shield size={28} />
                        Painel de Administrador
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Estatísticas e métricas da plataforma Everyday Conversation
                    </p>

                    <div className="admin-grid">
                        <div className="admin-stat">
                            <h3>Total de Alunos</h3>
                            <p>{stats.totalUsers}</p>
                            <small>
                                <Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Usuários cadastrados
                            </small>
                        </div>

                        <div className="admin-stat">
                            <h3>Alunos Ativos</h3>
                            <p>{stats.activeUsers}</p>
                            <small>
                                <TrendingUp size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Últimos 7 dias
                            </small>
                        </div>

                        <div className="admin-stat">
                            <h3>Módulos Disponíveis</h3>
                            <p>{stats.totalModules}</p>
                            <small>
                                <BookOpen size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Semanas de conteúdo
                            </small>
                        </div>

                        <div className="admin-stat">
                            <h3>Total de Aulas</h3>
                            <p>{stats.totalLessons}</p>
                            <small>
                                <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Vídeos + Quizzes
                            </small>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Dashboard;
