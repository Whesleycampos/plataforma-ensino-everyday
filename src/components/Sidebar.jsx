import React from 'react';
import { Home, BookOpen, MessageCircle, Settings, LogOut, User, X, Trophy } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { icon: <Home size={20} />, label: 'Início', path: '/dashboard' },
        { icon: <BookOpen size={20} />, label: 'Meus Cursos', path: '/course/1' },
        { icon: <Trophy size={20} />, label: 'Conquistas', path: '/achievements' },
        { icon: <Settings size={20} />, label: 'Configurações', path: '/settings' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleNavClick = () => {
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 1024) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                {/* Header with close button for mobile */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2.5rem',
                    paddingLeft: '0.5rem'
                }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Everyday</h2>
                    <button
                        className="sidebar-close-btn"
                        onClick={onClose}
                        aria-label="Fechar menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleNavClick}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                color: location.pathname === item.path ? 'white' : 'var(--text-secondary)',
                                background: location.pathname === item.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                transition: 'var(--transition)'
                            }}
                        >
                            {item.icon}
                            <span style={{ fontWeight: 500 }}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <Link
                        to="/profile"
                        onClick={handleNavClick}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            background: location.pathname === '/profile' ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                            textDecoration: 'none'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(139, 92, 246, 0.2))',
                            border: '2px solid var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)'
                        }}>
                            <User size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Meu Perfil</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ver conquistas</p>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--error)',
                            transition: 'var(--transition)',
                            background: 'transparent',
                            width: '100%',
                            cursor: 'pointer',
                            border: 'none'
                        }}
                    >
                        <LogOut size={20} />
                        <span style={{ fontWeight: 500 }}>Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
