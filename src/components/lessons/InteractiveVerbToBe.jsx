import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft, Star, Zap, MessageCircle, Check, BookOpen, Repeat } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const InteractiveVerbToBe = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const slides = [
        // INTRO
        {
            type: 'cover',
            title: 'Mastering Verb TO BE',
            subtitle: 'O pilar mais importante do inglês.',
            icon: <Zap size={60} color="#fcd34d" />,
        },
        {
            type: 'text',
            title: 'O que é?',
            content: 'O verbo TO BE é o camaleão do inglês. Ele significa duas coisas ao mesmo tempo: SER e ESTAR.',
            highlight: 'Contexto é tudo.',
            icon: <Star size={40} color="#fbbf24" />
        },

        // AFFIRMATIVE - I & YOU
        {
            type: 'conjugation',
            title: 'O Básico: Eu e Você',
            pairs: [
                { sub: 'I', verb: 'am', ex: 'I am happy. (Eu sou/estou feliz)' },
                { sub: 'You', verb: 'are', ex: 'You are awesome. (Você é incrível)' },
            ]
        },

        // QUIZ 1
        {
            type: 'quiz',
            question: 'Como se diz "Eu estou pronto"?',
            options: [
                { text: 'I is ready', correct: false },
                { text: 'I are ready', correct: false },
                { text: 'I am ready', correct: true }
            ]
        },

        // AFFIRMATIVE - HE / SHE / IT
        {
            type: 'conjugation',
            title: 'A Terceira Pessoa (Singular)',
            pairs: [
                { sub: 'He', verb: 'is', ex: 'He is my brother. (Ele é...)' },
                { sub: 'She', verb: 'is', ex: 'She is a doctor. (Ela é...)' },
                { sub: 'It', verb: 'is', ex: 'It is a cat. (Isto/Ele é...)' },
            ]
        },
        {
            type: 'info-card',
            title: 'O Curioso "IT"',
            content: 'Em português, dizemos "É um cachorro". Em inglês, NUNCA deixamos o verbo sozinho. Precisamos do "It".',
            example: 'It is a dog. (Não apenas "Is a dog")',
            icon: <BookOpen size={40} color="#3b82f6" />
        },

        // QUIZ 2
        {
            type: 'quiz',
            question: 'Complete: _____ is my sister.',
            options: [
                { text: 'He', correct: false },
                { text: 'She', correct: true },
                { text: 'It', correct: false }
            ]
        },

        // AFFIRMATIVE - PLURAL
        {
            type: 'conjugation',
            title: 'O Plural (Nós, Vocês, Eles)',
            pairs: [
                { sub: 'We', verb: 'are', ex: 'We are friends. (Nós somos...)' },
                { sub: 'You', verb: 'are', ex: 'You are guys. (Vocês são...)' },
                { sub: 'They', verb: 'are', ex: 'They are here. (Eles estão...)' },
            ]
        },

        // CONTRACTIONS
        {
            type: 'concept',
            title: 'Contrações (Speaking)',
            content: 'Nativos amam encurtar as palavras. No dia a dia, raramente você ouvirá "I am".',
            list: [
                'I am → I\'m',
                'You are → You\'re',
                'He is → He\'s',
                'We are → We\'re'
            ],
            icon: <MessageCircle size={40} color="#a5b4fc" />
        },

        // QUIZ 3
        {
            type: 'quiz',
            question: 'Qual a contração de "They are"?',
            options: [
                { text: 'They\'s', correct: false },
                { text: 'They\'re', correct: true },
                { text: 'Their', correct: false }
            ]
        },

        // NEGATIVE
        {
            type: 'section-break',
            title: 'Modo Negativo',
            subtitle: 'Dizendo NÃO em inglês.',
            icon: <Zap size={50} color="#f43f5e" />
        },
        {
            type: 'text',
            title: 'A Regra do NOT',
            content: 'Para negar com o To Be, é muito fácil: basta colocar o NOT depois do verbo.',
            example: 'I am NOT sad. (Eu não estou triste)',
            icon: <Check size={40} color="#f43f5e" />
        },
        {
            type: 'list-card',
            title: 'Exemplos Negativos',
            items: [
                { start: 'She is', end: 'She is NOT (She isn\'t)' },
                { start: 'You are', end: 'You are NOT (You aren\'t)' },
                { start: 'It is', end: 'It is NOT (It isn\'t)' }
            ]
        },

        // QUIZ 4
        {
            type: 'quiz',
            question: 'Transforme em negativo: "We are tired."',
            options: [
                { text: 'We no are tired', correct: false },
                { text: 'We not are tired', correct: false },
                { text: 'We aren\'t tired', correct: true }
            ]
        },

        // INTERROGATIVE
        {
            type: 'section-break',
            title: 'Fazendo Perguntas',
            subtitle: 'A inversão mágica.',
            icon: <Repeat size={50} color="#10b981" />
        },
        {
            type: 'concept',
            title: 'Troca de Lugar',
            content: 'Para perguntar, o verbo To Be pula para a frente da frase.',
            example: 'You are happy. → Are you happy?',
            icon: <Repeat size={40} color="#10b981" />
        },
        {
            type: 'list-card',
            title: 'Perguntas Comuns',
            items: [
                { start: 'Am I?', end: 'Eu sou/estou?' },
                { start: 'Is she?', end: 'Ela é/está?' },
                { start: 'Are they?', end: 'Eles são/estão?' }
            ]
        },

        // FINAL QUIZ MIX
        {
            type: 'quiz',
            question: 'Is he your father?',
            options: [
                { text: 'Yes, he are.', correct: false },
                { text: 'Yes, he is.', correct: true },
                { text: 'Yes, he am.', correct: false }
            ]
        },
        {
            type: 'quiz',
            question: 'Traduza: "Eles estão em casa?"',
            options: [
                { text: 'They are at home?', correct: false },
                { text: 'Are they at home?', correct: true },
                { text: 'Is they at home?', correct: false }
            ]
        },

        // CONCLUSION
        {
            type: 'completion',
            title: 'Missão Cumprida!',
            subtitle: 'Você dominou a base do inglês. O Verbo To Be não é mais um mistério.',
            score: true
        }
    ];

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

    return (
        <div className="interactive-container" style={{
            width: '100%',
            height: '100%',
            minHeight: '600px',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            color: 'white'
        }}>
            {/* PROGRESS */}
            <div style={{ padding: '0 2rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{currentSlide + 1}/{slides.length}</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: '#38bdf8', borderRadius: '2px', transition: 'width 0.3s' }} />
                </div>
            </div>

            {/* CONTENT */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>

                {/* HEADERS */}
                {(slide.type === 'cover' || slide.type === 'section-break' || slide.type === 'completion') && (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <div style={{ marginBottom: '1.5rem' }}>{slide.icon || <Star size={50} color="#fbbf24" />}</div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{slide.title}</h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '500px' }}>{slide.subtitle}</p>
                        {slide.score && <div style={{ fontSize: '1.5rem', marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>Score: {score}</div>}
                        {slide.type === 'completion' ? (
                            <Button onClick={() => onComplete && onComplete()} style={{ marginTop: '2.5rem', background: '#22c55e', border: 'none' }} size="lg">Concluir <Check size={20} /></Button>
                        ) : (
                            <Button onClick={handleNext} style={{ marginTop: '3rem' }} size="lg">Começar <ArrowRight size={20} /></Button>
                        )}
                    </div>
                )}

                {/* TEXT & CONCEPTS */}
                {(slide.type === 'text' || slide.type === 'concept' || slide.type === 'info-card') && (
                    <Card style={{ padding: '2.5rem', maxWidth: '600px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ marginBottom: '1rem' }}>{slide.icon}</div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{slide.title}</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.9 }}>{slide.content}</p>
                        {slide.example && <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(252, 211, 77, 0.1)', borderLeft: '4px solid #fcd34d', color: '#fcd34d', textAlign: 'left' }}>{slide.example}</div>}
                        {slide.list && (
                            <div style={{ marginTop: '1.5rem', textAlign: 'left', display: 'grid', gap: '0.8rem' }}>
                                {slide.list.map((item, i) => <div key={i} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>{item}</div>)}
                            </div>
                        )}
                    </Card>
                )}

                {/* CONJUGATION CARDS (REQUESTED DESIGN) */}
                {slide.type === 'conjugation' && (
                    <div style={{ width: '100%', maxWidth: '900px' }}>
                        <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', opacity: 0.8 }}>{slide.title}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {slide.pairs.map((pair, idx) => (
                                <div key={idx} style={{
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(56, 189, 248, 0.2)',
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    textAlign: 'left',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                    transition: 'transform 0.2s'
                                }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem', fontSize: '1.8rem', fontWeight: 700 }}>
                                        <span style={{ color: '#818cf8' }}>{pair.sub}</span>
                                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>+</span>
                                        <span style={{ color: '#f472b6' }}>{pair.verb}</span>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '1rem' }}>"{pair.ex}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* LIST CARDS */}
                {slide.type === 'list-card' && (
                    <div style={{ maxWidth: '600px', width: '100%' }}>
                        <h2 style={{ marginBottom: '2rem' }}>{slide.title}</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {slide.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{item.start}</span>
                                    <ArrowRight size={16} style={{ opacity: 0.5 }} />
                                    <span style={{ fontSize: '1.2rem', color: '#f43f5e' }}>{item.end}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* QUIZ */}
                {slide.type === 'quiz' && (
                    <div style={{ maxWidth: '500px', width: '100%' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', opacity: 0.8 }}>Quiz Rápido</h2>
                        <Card style={{ padding: '2rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ fontSize: '1.4rem', marginBottom: '2rem', fontWeight: 600 }}>{slide.question}</p>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {slide.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(opt.correct)}
                                        disabled={feedback !== null}
                                        style={{
                                            padding: '1.2rem',
                                            borderRadius: '12px',
                                            border: feedback && opt.correct ? '2px solid #22c55e' : (feedback === 'wrong' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)'),
                                            background: feedback && opt.correct ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.03)',
                                            color: 'white',
                                            fontSize: '1.1rem',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            fontWeight: 500
                                        }}
                                    >
                                        {opt.text}
                                        {feedback && opt.correct && <Check size={20} color="#22c55e" />}
                                    </button>
                                ))}
                            </div>
                            {feedback === 'wrong' && <p style={{ color: '#ef4444', marginTop: '1rem', animation: 'fadeIn 0.3s' }}>Tente de novo!</p>}
                        </Card>
                    </div>
                )}

            </div>

            {/* NAV */}
            {(slide.type !== 'cover' && slide.type !== 'completion') && (
                <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Button variant="ghost" onClick={handlePrev} disabled={currentSlide === 0} style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <ChevronLeft /> Anterior
                    </Button>
                    {slide.type !== 'quiz' && (
                        <Button onClick={handleNext}>
                            Próximo <ChevronRight />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default InteractiveVerbToBe;
