import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.name,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Login successful, redirect to dashboard
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
            <Card style={{ maxWidth: '400px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Junte-se a nós</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Crie sua conta para acessar os cursos.</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <Input
                            name="name"
                            type="text"
                            placeholder="Nome completo"
                            style={{ paddingLeft: '3rem' }}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <Input
                            name="email"
                            type="email"
                            placeholder="Seu e-mail"
                            style={{ paddingLeft: '3rem' }}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <Input
                            name="password"
                            type="password"
                            placeholder="Crie uma senha"
                            style={{ paddingLeft: '3rem' }}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <p style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <Button type="submit" style={{ marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Criando conta...' : <>Criar Conta <ArrowRight size={18} /></>}
                    </Button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Já tem uma conta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Fazer login</Link>
                </div>
            </Card>
        </div>
    );
};

export default Register;
