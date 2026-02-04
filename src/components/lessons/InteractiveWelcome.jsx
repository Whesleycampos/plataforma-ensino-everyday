import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft, Star, Heart, Zap, BookOpen, MessageCircle, Check, Play, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const InteractiveWelcome = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

    // --- SLIDE DATA ENGINE ---
    const slides = [
        // SECTION 1: WELCOME & PROMISE
        {
            type: 'cover',
            title: 'Welcome to Everyday',
            subtitle: 'Sua jornada para a fluência começa agora.',
            icon: <Star size={60} color="#fbbf24" />,
            bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
        },
        {
            type: 'text',
            title: 'Bora falar inglês?',
            content: 'Você não está aqui apenas para "estudar" um idioma. Você está aqui para vivê-lo. O método Everyday foi desenhado para inserir o inglês na sua rotina, como sua série favorita.',
            highlight: 'Esqueça a decoreba.',
            icon: <Heart size={40} color="#f43f5e" />
        },
        {
            type: 'text',
            title: 'O Segredo: Input',
            content: 'Crianças aprendem ouvindo, não lendo regras gramaticais. Aqui, seu foco será receber muito "Input" (áudio e leitura) antes de se preocupar com o "Output" (falar).',
            highlight: 'Primeiro encha o copo, depois transborde.',
            icon: <Volume2 size={40} color="#3b82f6" />
        },

        // SECTION 2: TOOLS
        {
            type: 'info-card',
            title: 'Ferramenta 1: PDF + Áudio',
            content: 'Todo módulo tem um texto com áudio nativo. Sua missão: ouvir enquanto lê, repetidas vezes, até entender naturalmente.',
            visual: '📄 + 🎧 = 🧠',
            icon: <BookOpen size={40} color="#10b981" />
        },
        {
            type: 'info-card',
            title: 'Ferramenta 2: ANKI',
            content: 'Usamos o ANKI para Repetição Espaçada. Ele garante que você revise as palavras no momento exato em que seu cérebro está prestes a esquecer.',
            visual: '📉 ➡️ 📈',
            icon: <Zap size={40} color="#f59e0b" />
        },
        {
            type: 'info-card',
            title: 'Ferramenta 3: Comunidade',
            content: 'Nosso grupo no WhatsApp é seu safe place. Tire dúvidas, mande áudios e interaja com outros alunos sem medo de julgamentos.',
            visual: '👥💬',
            icon: <MessageCircle size={40} color="#25D366" />
        },

        // SECTION 3: QUIZ - METHODOLOGY
        {
            type: 'quiz',
            question: 'Qual é o foco principal no início do aprendizado?',
            options: [
                { text: 'Decorar regras de gramática', correct: false },
                { text: 'Falar perfeito desde o dia 1', correct: false },
                { text: 'Muito Input (Ouvir e Ler)', correct: true }
            ]
        },

        // SECTION 4: ENGLISH INTRO (VERB TO BE TEASER)
        {
            type: 'section-break',
            title: 'Vamos para a prática!',
            subtitle: 'Uma prévia do que você vai ver na Semana 1.',
            color: '#8b5cf6'
        },
        {
            type: 'concept',
            title: 'O Verbo TO BE',
            content: 'Ele significa SER ou ESTAR. Sim, em inglês é a mesma palavra! "I am" pode ser "Eu sou" ou "Eu estou".',
            example: 'I am happy. (Eu estou feliz)',
            icon: <Zap size={40} color="#fcd34d" />
        },
        {
            type: 'conjugation',
            pairs: [
                { sub: 'I', verb: 'am', ex: 'Eu sou/estou' },
                { sub: 'You', verb: 'are', ex: 'Você é/está' },
            ]
        },
        {
            type: 'conjugation',
            pairs: [
                { sub: 'He', verb: 'is', ex: 'Ele é/está' },
                { sub: 'She', verb: 'is', ex: 'Ela é/está' },
                { sub: 'It', verb: 'is', ex: 'Isto é/está' },
            ]
        },
        {
            type: 'conjugation',
            pairs: [
                { sub: 'We', verb: 'are', ex: 'Nós somos/estamos' },
                { sub: 'They', verb: 'are', ex: 'Eles são/estão' },
            ]
        },

        // SECTION 5: QUIZ - ENGLISH
        {
            type: 'quiz',
            question: 'Complete: She _____ my friend.',
            options: [
                { text: 'are', correct: false },
                { text: 'am', correct: false },
                { text: 'is', correct: true }
            ]
        },
        {
            type: 'quiz',
            question: 'Traduza: "We are happy"',
            options: [
                { text: 'Eles são felizes', correct: false },
                { text: 'Nós somos felizes', correct: true },
                { text: 'Você é feliz', correct: false }
            ]
        },

        // SECTION 6: MINDSET
        {
            type: 'text',
            title: 'Mentalidade de Ouro',
            content: 'Consistência > Intensidade. É melhor estudar 15 minutos TODOS os dias do que 5 horas só no sábado.',
            highlight: 'Keep going!',
            icon: <Star size={40} color="#fbbf24" />
        },
        {
            type: 'text',
            title: 'Não tenha medo do erro',
            content: 'O erro é a prova de que você está tentando. Se você não errar, não aprende. Abrace o erro!',
            highlight: 'Fail fast, learn faster.',
            icon: <Check size={40} color="#10b981" />
        },

        // SECTION 7: COMMITMENT
        {
            type: 'commitment',
            title: 'Seu Compromisso',
            content: 'Eu me comprometo a fazer do inglês parte da minha vida diária.'
        },

        // FINAL
        {
            type: 'completion',
            title: 'Parabéns!',
            subtitle: 'Você concluiu o onboarding. Agora a diversão começa de verdade na Semana 1.',
        }
    ];

    // --- LOGIC ---
    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setFeedback(null);
            setCurrentSlide(curr => curr + 1);
        } else {
            onComplete && onComplete();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setFeedback(null);
            setCurrentSlide(curr => curr - 1);
        }
    };

    const handleAnswer = (isCorrect) => {
        if (feedback) return;
        if (isCorrect) {
            setFeedback('correct');
            setScore(s => s + 1);
            setTimeout(handleNext, 1200);
        } else {
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const slide = slides[currentSlide];
    const progress = ((currentSlide + 1) / slides.length) * 100;

    // --- RENDERERS ---
    return (
        <div className="interactive-container" style={{
            width: '100%',
            height: '100%',
            minHeight: '600px',
            background: '#0f172a',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* PROGRESS BAR */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                    transition: 'width 0.5s ease'
                }} />
            </div>

            {/* CONTENT AREA */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
                animation: 'fadeIn 0.5s ease'
            }}>
                <style>{`
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    .slide-icon { margin-bottom: 1.5rem; filter: drop-shadow(0 0 15px rgba(255,255,255,0.3)); }
                `}</style>

                {/* --- COVER & SECTION TYPES --- */}
                {(slide.type === 'cover' || slide.type === 'section-break' || slide.type === 'completion') && (
                    <div style={{ maxWidth: '600px' }}>
                        <div className="slide-icon">{slide.icon || <Star size={60} color="#fbbf24" />}</div>
                        <h1 style={{
                            fontSize: '3rem',
                            lineHeight: 1.1,
                            marginBottom: '1rem',
                            background: 'linear-gradient(to right, #fff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 800
                        }}>
                            {slide.title}
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: '#cbd5e1', lineHeight: 1.6 }}>{slide.subtitle || slide.content}</p>

                        {slide.type === 'completion' && (
                            <Button size="lg" onClick={() => onComplete && onComplete()} style={{ marginTop: '2rem', background: '#22c55e' }}>
                                Concluir Aula
                            </Button>
                        )}
                        {slide.type !== 'completion' && (
                            <Button size="lg" onClick={handleNext} style={{ marginTop: '3rem' }}>
                                Começar <ArrowRight style={{ marginLeft: '8px' }} />
                            </Button>
                        )}
                    </div>
                )}

                {/* --- TEXT CONTENT --- */}
                {(slide.type === 'text' || slide.type === 'concept' || slide.type === 'info-card') && (
                    <Card style={{
                        maxWidth: '500px',
                        padding: '2.5rem',
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div className="slide-icon">{slide.icon}</div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>{slide.title}</h2>
                        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            {slide.content}
                        </p>
                        {slide.visual && <div style={{ fontSize: '3rem', margin: '1rem 0' }}>{slide.visual}</div>}
                        {slide.example && (
                            <div style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: '1rem',
                                borderRadius: '8px',
                                borderLeft: '4px solid #fcd34d',
                                textAlign: 'left',
                                color: '#fcd34d'
                            }}>
                                📌 {slide.example}
                            </div>
                        )}
                        {slide.highlight && <p style={{ color: '#60a5fa', fontWeight: 600, fontSize: '1.1rem' }}>✨ {slide.highlight}</p>}
                    </Card>
                )}

                {/* --- CONJUGATION CARDS (User Request) --- */}
                {slide.type === 'conjugation' && (
                    <div style={{ width: '100%', maxWidth: '800px' }}>
                        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Combine & Aprenda</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                            {slide.pairs.map((pair, idx) => (
                                <div key={idx} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    textAlign: 'left',
                                    transition: 'transform 0.2s',
                                    cursor: 'default'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
                                        <span style={{ color: '#8b5cf6' }}>{pair.sub}</span>
                                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>+</span>
                                        <span style={{ color: '#f43f5e' }}>{pair.verb}</span>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>"{pair.ex}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- QUIZ --- */}
                {slide.type === 'quiz' && (
                    <div style={{ maxWidth: '500px', width: '100%' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', fontWeight: 600 }}>Quiz Time!</h2>
                        <Card style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.6)' }}>
                            <p style={{ fontSize: '1.3rem', marginBottom: '2rem' }}>{slide.question}</p>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {slide.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(opt.correct)}
                                        disabled={feedback !== null}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            border: feedback && opt.correct ? '2px solid #22c55e' : (feedback === 'wrong' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.2)'),
                                            background: feedback && opt.correct ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        {opt.text}
                                        {feedback && opt.correct && <Check size={20} color="#22c55e" />}
                                    </button>
                                ))}
                            </div>
                            {feedback === 'wrong' && <p style={{ color: '#ef4444', marginTop: '1rem' }}>Tente novamente!</p>}
                        </Card>
                    </div>
                )}

                {/* --- COMMITMENT --- */}
                {slide.type === 'commitment' && (
                    <Card style={{
                        maxWidth: '400px',
                        padding: '2rem',
                        transform: 'rotate(-1deg)',
                        background: '#fff',
                        color: '#0f172a'
                    }}>
                        <h3 style={{ fontFamily: 'monospace', fontSize: '1.5rem', marginBottom: '1rem' }}>OFFICIAL PLEDGE</h3>
                        <p style={{ fontFamily: 'monospace', lineHeight: 1.6, marginBottom: '2rem' }}>
                            "{slide.content}"
                        </p>
                        <div style={{ borderBottom: '2px solid #0f172a', width: '80%', height: '30px', margin: '0 auto' }} />
                        <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.6 }}>YOUR SIGNATURE</p>
                        <Button onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }}>I Accept</Button>
                    </Card>
                )}

            </div>

            {/* NAVIGATION FOOTER */}
            {(slide.type !== 'cover' && slide.type !== 'completion') && (
                <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <ChevronLeft /> Voltar
                    </button>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
                        Slide {currentSlide + 1} de {slides.length}
                    </span>
                    {slide.type !== 'quiz' && (
                        <button
                            onClick={handleNext}
                            style={{
                                background: 'white',
                                color: 'black',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            Próximo <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default InteractiveWelcome;
