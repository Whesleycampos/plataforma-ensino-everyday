import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Trophy, Star, Flame, BookOpen, Target, Zap, Award,
    Shield, ArrowLeft, Lock, CheckCircle, Crown, Gem,
    Rocket, Heart, Brain, Sparkles, Medal, Gift
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import './Achievements.css';

const Achievements = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        completedLessons: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalXP: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedBadge, setSelectedBadge] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { count } = await supabase
                    .from('student_progress')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                const completedLessons = count || 0;
                setStats({
                    completedLessons,
                    currentStreak: Math.min(completedLessons, 7),
                    longestStreak: Math.min(completedLessons * 2, 30),
                    totalXP: completedLessons * 100
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Badge categories and definitions
    const badgeCategories = [
        {
            name: 'Primeiros Passos',
            description: 'Conquistas para começar sua jornada',
            badges: [
                { id: 'welcome', name: 'Bem-vindo', icon: Gift, description: 'Crie sua conta', xp: 50, unlocked: true },
                { id: 'first-lesson', name: 'Primeiro Passo', icon: Star, description: 'Complete sua primeira aula', xp: 100, unlocked: stats.completedLessons >= 1 },
                { id: 'profile-complete', name: 'Perfil Completo', icon: CheckCircle, description: 'Preencha todas as informações do perfil', xp: 75, unlocked: false },
            ]
        },
        {
            name: 'Constância',
            description: 'Mantenha o ritmo de estudos',
            badges: [
                { id: 'streak-3', name: '3 Dias', icon: Flame, description: '3 dias consecutivos de estudo', xp: 150, unlocked: stats.currentStreak >= 3 },
                { id: 'streak-7', name: 'Uma Semana', icon: Flame, description: '7 dias consecutivos de estudo', xp: 300, unlocked: stats.currentStreak >= 7 },
                { id: 'streak-14', name: 'Duas Semanas', icon: Flame, description: '14 dias consecutivos de estudo', xp: 500, unlocked: stats.longestStreak >= 14 },
                { id: 'streak-30', name: 'Um Mês', icon: Zap, description: '30 dias consecutivos de estudo', xp: 1000, unlocked: stats.longestStreak >= 30 },
            ]
        },
        {
            name: 'Progresso',
            description: 'Avance no conteúdo',
            badges: [
                { id: 'lessons-5', name: 'Iniciante', icon: BookOpen, description: 'Complete 5 aulas', xp: 200, unlocked: stats.completedLessons >= 5 },
                { id: 'lessons-10', name: 'Dedicado', icon: Target, description: 'Complete 10 aulas', xp: 400, unlocked: stats.completedLessons >= 10 },
                { id: 'lessons-25', name: 'Estudante', icon: Brain, description: 'Complete 25 aulas', xp: 750, unlocked: stats.completedLessons >= 25 },
                { id: 'lessons-50', name: 'Avançado', icon: Rocket, description: 'Complete 50 aulas', xp: 1500, unlocked: stats.completedLessons >= 50 },
                { id: 'lessons-100', name: 'Expert', icon: Crown, description: 'Complete 100 aulas', xp: 3000, unlocked: stats.completedLessons >= 100 },
            ]
        },
        {
            name: 'Especiais',
            description: 'Conquistas raras e especiais',
            badges: [
                { id: 'night-owl', name: 'Coruja', icon: Sparkles, description: 'Estude após meia-noite', xp: 250, unlocked: false },
                { id: 'early-bird', name: 'Madrugador', icon: Heart, description: 'Estude antes das 6h', xp: 250, unlocked: false },
                { id: 'weekend-warrior', name: 'Guerreiro', icon: Shield, description: 'Estude todo final de semana do mês', xp: 500, unlocked: false },
                { id: 'perfectionist', name: 'Perfeccionista', icon: Gem, description: 'Acerte 100% em 10 quizzes', xp: 1000, unlocked: false },
                { id: 'champion', name: 'Campeão', icon: Trophy, description: 'Desbloqueie todas as outras conquistas', xp: 5000, unlocked: false },
            ]
        }
    ];

    const totalBadges = badgeCategories.reduce((acc, cat) => acc + cat.badges.length, 0);
    const unlockedBadges = badgeCategories.reduce((acc, cat) =>
        acc + cat.badges.filter(b => b.unlocked).length, 0);
    const totalXPEarned = badgeCategories.reduce((acc, cat) =>
        acc + cat.badges.filter(b => b.unlocked).reduce((sum, b) => sum + b.xp, 0), 0);

    const getProgressToNextLevel = () => {
        const levels = [0, 500, 1500, 3000, 5000, 8000, 12000, 20000];
        const currentLevel = levels.findIndex(xp => totalXPEarned < xp);
        const prevLevel = levels[currentLevel - 1] || 0;
        const nextLevel = levels[currentLevel] || levels[levels.length - 1];
        const progress = ((totalXPEarned - prevLevel) / (nextLevel - prevLevel)) * 100;
        return { level: currentLevel, progress: Math.min(100, progress), nextLevel };
    };

    const levelInfo = getProgressToNextLevel();

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem' }}>
                <div className="spinner" style={{
                    width: '40px', height: '40px',
                    border: '3px solid rgba(255,255,255,0.1)',
                    borderTopColor: 'var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: 'var(--text-secondary)' }}>Carregando conquistas...</p>
            </div>
        );
    }

    return (
        <div className="achievements-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="achievements-main" id="main-content" role="main">
                {/* Header */}
                <header className="achievements-header">
                    <button className="back-btn" onClick={() => navigate('/profile')}>
                        <ArrowLeft size={20} />
                        <span>Voltar</span>
                    </button>
                    <div>
                        <h1><Trophy size={28} /> Conquistas</h1>
                        <p>{unlockedBadges} de {totalBadges} desbloqueadas</p>
                    </div>
                </header>

                {/* Level Progress */}
                <Card className="level-card">
                    <div className="level-card__content">
                        <div className="level-badge">
                            <Medal size={32} />
                            <span>Nível {levelInfo.level}</span>
                        </div>
                        <div className="level-info">
                            <div className="level-xp">
                                <span className="xp-current">{totalXPEarned} XP</span>
                                <span className="xp-next">/ {levelInfo.nextLevel} XP</span>
                            </div>
                            <div className="level-progress">
                                <div
                                    className="level-progress__bar"
                                    style={{ width: `${levelInfo.progress}%` }}
                                />
                            </div>
                            <p className="level-hint">
                                {levelInfo.nextLevel - totalXPEarned} XP para o próximo nível
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Badge Categories */}
                <div className="badge-categories">
                    {badgeCategories.map((category, catIndex) => (
                        <div key={category.name} className="badge-category" style={{ animationDelay: `${catIndex * 0.1}s` }}>
                            <div className="category-header">
                                <h2>{category.name}</h2>
                                <p>{category.description}</p>
                                <span className="category-progress">
                                    {category.badges.filter(b => b.unlocked).length}/{category.badges.length}
                                </span>
                            </div>

                            <div className="badges-list">
                                {category.badges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'} ${selectedBadge === badge.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                                    >
                                        <div className="badge-card__icon">
                                            <badge.icon size={28} />
                                            {!badge.unlocked && (
                                                <div className="badge-lock">
                                                    <Lock size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="badge-card__info">
                                            <h3>{badge.name}</h3>
                                            <p>{badge.description}</p>
                                            <span className="badge-xp">+{badge.xp} XP</span>
                                        </div>
                                        {badge.unlocked && (
                                            <div className="badge-check">
                                                <CheckCircle size={20} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Achievements;
