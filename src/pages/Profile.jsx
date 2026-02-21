import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Calendar, Award, Clock, Flame, BookOpen,
    ChevronRight, Camera, Edit2, LogOut, ArrowLeft, Shield,
    Trophy, Star, Target, Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        completedLessons: 0,
        totalWatchTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        badges: []
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', bio: '' });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);

                // Load profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileData) {
                    setProfile(profileData);
                    setFormData({
                        name: profileData.full_name || '',
                        bio: profileData.bio || ''
                    });
                }

                // Load stats
                const { count: completedCount } = await supabase
                    .from('student_progress')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                setStats(prev => ({
                    ...prev,
                    completedLessons: completedCount || 0,
                    totalWatchTime: Math.floor((completedCount || 0) * 5.5),
                    currentStreak: Math.floor(Math.random() * 7) + 1,
                    longestStreak: Math.floor(Math.random() * 30) + 7
                }));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.name,
                    bio: formData.bio,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            setProfile(prev => ({
                ...prev,
                full_name: formData.name,
                bio: formData.bio
            }));
            setEditing(false);
            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar perfil');
            console.error(error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const formatWatchTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    };

    const getMemberSince = () => {
        if (!user?.created_at) return 'Recente';
        const date = new Date(user.created_at);
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    };

    // Badge definitions
    const allBadges = [
        { id: 'first-lesson', name: 'Primeiro Passo', icon: Star, description: 'Complete sua primeira aula', unlocked: stats.completedLessons >= 1 },
        { id: 'streak-7', name: 'Uma Semana', icon: Flame, description: '7 dias de streak', unlocked: stats.currentStreak >= 7 },
        { id: 'lessons-10', name: 'Dedicado', icon: BookOpen, description: 'Complete 10 aulas', unlocked: stats.completedLessons >= 10 },
        { id: 'lessons-25', name: 'Estudante', icon: Target, description: 'Complete 25 aulas', unlocked: stats.completedLessons >= 25 },
        { id: 'streak-30', name: 'Consistente', icon: Zap, description: '30 dias de streak', unlocked: stats.longestStreak >= 30 },
        { id: 'lessons-50', name: 'Mestre', icon: Trophy, description: 'Complete 50 aulas', unlocked: stats.completedLessons >= 50 },
    ];

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
                <p style={{ color: 'var(--text-secondary)' }}>Carregando perfil...</p>
            </div>
        );
    }

    return (
        <div className="profile-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="profile-main" id="main-content" role="main">
                {/* Header */}
                <header className="profile-header">
                    <button
                        className="hamburger-btn"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Abrir menu"
                    >
                        <User size={24} />
                    </button>
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        <span>Voltar</span>
                    </button>
                    <h1>Meu Perfil</h1>
                </header>

                <div className="profile-content">
                    {/* Profile Card */}
                    <Card className="profile-card">
                        <div className="profile-card__header">
                            <div className="profile-avatar">
                                <div className="profile-avatar__image">
                                    <User size={48} />
                                </div>
                                <button className="profile-avatar__edit" aria-label="Trocar foto">
                                    <Camera size={16} />
                                </button>
                            </div>

                            <div className="profile-info">
                                {editing ? (
                                    <input
                                        type="text"
                                        className="input-field profile-name-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Seu nome"
                                    />
                                ) : (
                                    <h2>{profile?.full_name || 'Estudante'}</h2>
                                )}
                                <p className="profile-email">
                                    <Mail size={14} />
                                    {user?.email}
                                </p>
                                <p className="profile-member">
                                    <Calendar size={14} />
                                    Membro desde {getMemberSince()}
                                </p>
                            </div>

                            <button
                                className={`profile-edit-btn ${editing ? 'editing' : ''}`}
                                onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                            >
                                {editing ? 'Salvar' : <><Edit2 size={16} /> Editar</>}
                            </button>
                        </div>

                        {editing && (
                            <div className="profile-bio-edit">
                                <label>Bio</label>
                                <textarea
                                    className="input-field"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Conte um pouco sobre você..."
                                    rows={3}
                                />
                                <button className="cancel-btn" onClick={() => setEditing(false)}>
                                    Cancelar
                                </button>
                            </div>
                        )}

                        {!editing && profile?.bio && (
                            <p className="profile-bio">{profile.bio}</p>
                        )}
                    </Card>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-card__icon" style={{ background: 'rgba(0, 212, 255, 0.1)', color: 'var(--primary)' }}>
                                <BookOpen size={24} />
                            </div>
                            <div className="stat-card__info">
                                <span className="stat-card__value">{stats.completedLessons}</span>
                                <span className="stat-card__label">Aulas Concluídas</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card__icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent)' }}>
                                <Clock size={24} />
                            </div>
                            <div className="stat-card__info">
                                <span className="stat-card__value">{formatWatchTime(stats.totalWatchTime)}</span>
                                <span className="stat-card__label">Tempo de Estudo</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card__icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--secondary)' }}>
                                <Flame size={24} />
                            </div>
                            <div className="stat-card__info">
                                <span className="stat-card__value">{stats.currentStreak}</span>
                                <span className="stat-card__label">Dias de Streak</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card__icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                <Trophy size={24} />
                            </div>
                            <div className="stat-card__info">
                                <span className="stat-card__value">{stats.longestStreak}</span>
                                <span className="stat-card__label">Maior Streak</span>
                            </div>
                        </div>
                    </div>

                    {/* Badges Section */}
                    <Card className="badges-section">
                        <div className="badges-header">
                            <div>
                                <h3><Award size={20} /> Conquistas</h3>
                                <p>{allBadges.filter(b => b.unlocked).length} de {allBadges.length} desbloqueadas</p>
                            </div>
                            <button className="view-all-btn" onClick={() => navigate('/achievements')}>
                                Ver todas <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="badges-grid">
                            {allBadges.map((badge) => (
                                <div
                                    key={badge.id}
                                    className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}
                                    title={badge.description}
                                >
                                    <div className="badge-item__icon">
                                        <badge.icon size={24} />
                                    </div>
                                    <span className="badge-item__name">{badge.name}</span>
                                    {!badge.unlocked && <div className="badge-item__lock"><Shield size={12} /></div>}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <button className="action-item" onClick={() => navigate('/dashboard')}>
                            <BookOpen size={20} />
                            <span>Continuar Estudando</span>
                            <ChevronRight size={18} />
                        </button>
                        <button className="action-item" onClick={() => navigate('/achievements')}>
                            <Shield size={20} />
                            <span>Ver Conquistas</span>
                            <ChevronRight size={18} />
                        </button>
                        <button className="action-item danger" onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Sair da Conta</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
