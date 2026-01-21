import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import '../components/ui/Stars.css';
import { courseCurriculum } from '../lib/courseContent';

const Dashboard = () => {
    const navigate = useNavigate();
    // We use the static curriculum directly for the dashboard grid
    const modules = courseCurriculum;

    // Main Banner Component
    const EverydayBanner = () => (
        <div style={{
            width: '100%',
            height: '60vh', // Larger vertical size
            borderRadius: '0', // Full width usually implies no radius at edges
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            marginBottom: '0', // attach to next section or give spacing
            position: 'relative',
            zIndex: 1
        }}>
            <video
                src="/capa-plataforma.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover' // Ensure it fills the area
                }}
            />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            {/* Stars Background Layer */}
            <div className="stars" />

            {/* Top Navigation Bar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1.5rem 2rem',
                alignItems: 'center',
                zIndex: 10,
                position: 'relative'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-secondary)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                    }}
                >
                    <span>← Voltar para a escola</span>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Search style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} size={20} />
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)'
                    }}>
                        37%
                    </div>
                </div>
            </nav>

            {/* Hero / Brand Section - Full Width */}
            <EverydayBanner />

            <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>


                {/* Module Grid */}
                <section style={{ width: '100%' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '2rem',
                        paddingBottom: '4rem'
                    }}>
                        {modules.map((module, index) => {
                            // Use specific poster for all modules as requested
                            let coverImage = "/poster-week-1.jpg";
                            let title = module.title;
                            let subTitle = `${module.lessons.length} Aulas`;

                            // Special formatting for "Semana X" to match "Materiais da Xª Semana"
                            if (module.title.toLowerCase().includes('semana')) {
                                const weekNum = module.title.replace(/\D/g, '');
                                title = `Materiais da ${weekNum}ª Semana`;
                                subTitle = "Everyday Conversation";
                            }

                            return (
                                <CourseCard
                                    key={index}
                                    title={title}
                                    label={subTitle}
                                    description=""
                                    progress={0}
                                    image={coverImage}
                                    // Navigate to the course player, passing the module index state effectively
                                    // We link to the same course ID, but pass the specific module index
                                    onClick={() => navigate(`/course/1`, { state: { moduleIndex: index } })}
                                />
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
