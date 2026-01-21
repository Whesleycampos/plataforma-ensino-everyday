import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/ui/Stars.css'; // Import Space Background

import { supabase } from '../lib/supabase';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('E-mail ou senha incorretos.');
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            {/* Stars Background */}
            <div className="stars" />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '420px',
                zIndex: 10
            }}>
                {/* Logo Section - Above Card */}
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 1rem auto',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>
                        <img
                            src="/logo-everyday-red.jpg"
                            alt="Everyday Conversation Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>

                {/* Glass Card */}
                <div className="glass-panel" style={{
                    width: '100%',
                    padding: '2.5rem',
                    background: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: 700, lineHeight: 1.2 }}>
                            Curso de inglês<br />Everyday Conversation
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Bem-vindo de volta! Faça login para continuar.</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <Input
                                type="email"
                                placeholder="Seu e-mail"
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    height: '50px',
                                    fontSize: '1rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    borderColor: 'rgba(255,255,255,0.05)'
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <Input
                                type="password"
                                placeholder="Sua senha"
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    height: '50px',
                                    fontSize: '1rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    borderColor: 'rgba(255,255,255,0.05)'
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: '#a78bfa', fontWeight: 500, opacity: 0.9, transition: 'opacity 0.2s', textDecoration: 'none' }}>
                                Esqueceu a senha?
                            </Link>
                        </div>

                        {error && <div style={{
                            padding: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#fca5a5',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            fontSize: '0.9rem'
                        }}>{error}</div>}

                        <Button
                            type="submit"
                            style={{
                                height: '50px',
                                fontSize: '1rem',
                                marginTop: '0.5rem',
                                background: 'linear-gradient(to right, #8b5cf6, #ec4899)', // Purple to Pink gradient as showed in image
                                border: 'none'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : <>Entrar na Plataforma <ArrowRight size={20} /></>}
                        </Button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Não tem uma conta? <Link to="/register" style={{ color: '#a78bfa', fontWeight: 600 }}>Crie agora</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
