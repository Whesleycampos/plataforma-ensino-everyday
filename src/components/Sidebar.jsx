import React from 'react';
import { Home, BookOpen, MessageCircle, Settings, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { icon: <Home size={20} />, label: 'Início', path: '/dashboard' },
        { icon: <BookOpen size={20} />, label: 'Meus Cursos', path: '/dashboard/courses' },
        { icon: <MessageCircle size={20} />, label: 'Comunidade', path: '/community' },
        { icon: <Settings size={20} />, label: 'Configurações', path: '/settings' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Everyday</h2>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '0.5rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--bg-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)'
                    }}>
                        <User size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Estudante</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Membro</p>
                    </div>
                </div>

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
    );
};

export default Sidebar;

