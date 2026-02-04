import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../components/ui/Stars.css';
import { supabase } from '../lib/supabase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
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
                {/* Logo Section */}
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
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
                    padding: '2.75rem',
                    background: 'rgba(20, 20, 20, 0.75)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 212, 255, 0.12)',
                    transition: 'all 0.3s ease'
                }}>
                    {success ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'rgba(16, 185, 129, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem auto'
                            }}>
                                <CheckCircle size={32} color="var(--success)" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>
                                E-mail enviado!
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                                Verifique sua caixa de entrada em <strong style={{ color: 'var(--primary)' }}>{email}</strong> e clique no link para redefinir sua senha.
                            </p>
                            <Link to="/login">
                                <Button style={{ width: '100%' }}>
                                    <ArrowLeft size={18} /> Voltar para Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h1 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                                    Esqueceu sua senha?
                                </h1>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    Digite seu e-mail e enviaremos um link para redefinir sua senha.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                                    {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                                </Button>
                            </form>

                            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <ArrowLeft size={16} /> Voltar para Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
