import React from 'react';
import { BookOpen, Search, Video, Award, FolderOpen } from 'lucide-react';
import { Button } from './Button';
import './EmptyState.css';

/**
 * EmptyState component for displaying when there's no content
 * @param {string} variant - 'courses' | 'search' | 'lessons' | 'achievements' | 'default'
 * @param {string} title - Custom title (optional)
 * @param {string} description - Custom description (optional)
 * @param {object} action - { label: string, onClick: () => void } (optional)
 * @param {ReactNode} icon - Custom icon (optional)
 */
export const EmptyState = ({
    variant = 'default',
    title,
    description,
    action,
    icon,
    className = ''
}) => {
    const variants = {
        courses: {
            icon: <BookOpen size={48} />,
            title: 'Nenhum curso encontrado',
            description: 'Parece que ainda não há cursos disponíveis. Volte em breve para conferir novidades!'
        },
        search: {
            icon: <Search size={48} />,
            title: 'Nenhum resultado encontrado',
            description: 'Tente buscar por outros termos ou explore nossas categorias.'
        },
        lessons: {
            icon: <Video size={48} />,
            title: 'Nenhuma aula disponível',
            description: 'Este módulo ainda não possui aulas. Novas aulas serão adicionadas em breve!'
        },
        achievements: {
            icon: <Award size={48} />,
            title: 'Nenhuma conquista ainda',
            description: 'Continue estudando para desbloquear suas primeiras conquistas!'
        },
        default: {
            icon: <FolderOpen size={48} />,
            title: 'Nada por aqui',
            description: 'Não há conteúdo para exibir no momento.'
        }
    };

    const config = variants[variant] || variants.default;

    return (
        <div className={`empty-state ${className}`} role="status" aria-live="polite">
            <div className="empty-state__icon">
                {icon || config.icon}
            </div>
            <h3 className="empty-state__title">
                {title || config.title}
            </h3>
            <p className="empty-state__description">
                {description || config.description}
            </p>
            {action && (
                <Button
                    variant="outline"
                    onClick={action.onClick}
                    className="empty-state__action"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
