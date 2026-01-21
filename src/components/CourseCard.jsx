import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PlayCircle } from 'lucide-react';

const CourseCard = ({ title, description, progress, image, onClick, label }) => {
    return (
        <Card
            className="group relative overflow-hidden rounded-xl border-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
            onClick={onClick}
            style={{
                height: '400px',
                background: '#1e293b',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)'
            }}
        >
            {/* Background Image */}
            <div className="absolute inset-0 h-full w-full">
                <img
                    src={image || "https://placehold.co/600x800/1e293b/FFF?text=Course"}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.8)'
                    }}
                    className="transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)'
                }} />
            </div>

            {/* Content Content - Positioned at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center">
                {/* Optional Top Label (e.g. "Semana 1") */}
                {label && (
                    <div style={{
                        position: 'absolute',
                        top: '-300px', /* Push it to top of card */
                        left: '0',
                        right: '0',
                        padding: '1rem',
                        textAlign: 'center'
                    }}>
                        <h2 style={{
                            fontFamily: 'serif',
                            fontSize: '2rem',
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                        }}>
                            {label}
                        </h2>
                    </div>
                )}

                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '0.5rem',
                    fontFamily: 'serif'
                }}>
                    {title}
                </h3>

                <p style={{
                    color: '#cbd5e1',
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem',
                    lineHeight: '1.4',
                    maxWidth: '90%'
                }}>
                    {description}
                </p>

                {/* Week/Module Sticker Badge */}
                <div style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    marginBottom: '-10px' // Slightly overflow bottom if needed, or just sit there
                }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>MOD</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
                        {progress > 0 ? '1' : '0'}
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default CourseCard;
