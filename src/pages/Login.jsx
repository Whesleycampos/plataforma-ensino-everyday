import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../components/ui/Stars.css'; // Import Space Background

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const normalizedEmail = email.trim().toLowerCase();

        // Salvar e-mail ativo e data de login
        localStorage.setItem('userEmail', normalizedEmail);
        localStorage.setItem('loginDate', new Date().toISOString());

        // Registrar histórico de alunos que já acessaram neste dispositivo
        const registryKey = 'registered_students';
        const registeredStudents = JSON.parse(localStorage.getItem(registryKey) || '[]');
        if (!registeredStudents.includes(normalizedEmail)) {
            registeredStudents.push(normalizedEmail);
            localStorage.setItem(registryKey, JSON.stringify(registeredStudents));
        }

        // Simular pequeno delay para melhor UX
        setTimeout(() => {
            navigate('/dashboard');
        }, 500);
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
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 60px rgba(0, 212, 255, 0.15)',
                        border: '2px solid rgba(0, 212, 255, 0.2)',
                        animation: 'float 4s ease-in-out infinite'
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
                    padding: '2.75rem',
                    background: 'rgba(20, 20, 20, 0.75)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 212, 255, 0.12)',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 className="text-gradient-animated" style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: 700, lineHeight: 1.2 }}>
                            Curso de inglês<br />Everyday Conversation
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Digite seu email para acessar a plataforma e salvar seu progresso</p>
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
                                    height: '52px',
                                    fontSize: '1rem',
                                    background: 'rgba(34, 34, 34, 0.8)',
                                    borderColor: 'rgba(255,255,255,0.08)',
                                    transition: 'all 0.25s ease'
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            style={{
                                height: '52px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                marginTop: '0.5rem',
                                background: 'linear-gradient(135deg, #00d4ff 0%, #0ea5e9 50%, #8b5cf6 100%)',
                                border: 'none',
                                boxShadow: '0 12px 40px rgba(0, 212, 255, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : <>Entrar na Plataforma <ArrowRight size={20} /></>}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
