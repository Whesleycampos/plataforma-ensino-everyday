import React, { useEffect, useRef } from 'react';
import Player from '@vimeo/player';

/**
 * VimeoPlayer - Componente otimizado usando SDK oficial do Vimeo
 * Muito mais leve e performático que iframe, especialmente em mobile
 */
const VimeoPlayer = ({ videoId, title }) => {
    const containerRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if (!videoId || !containerRef.current) return;

        // Detectar se é mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         window.innerWidth <= 768;

        // Configurações otimizadas para mobile
        const options = {
            id: videoId,
            width: '100%',
            responsive: true,
            controls: true,
            autoplay: false,
            muted: false,
            // Mobile: força qualidade mais baixa para melhor performance
            quality: isMobile ? '540p' : 'auto',
            // Preload metadata apenas, não o vídeo completo
            autopause: true,
            background: false,
        };

        // Inicializar player
        playerRef.current = new Player(containerRef.current, options);

        // Otimização: carregar apenas quando visível
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Player está visível, pode carregar
                        playerRef.current?.ready().then(() => {
                            console.log('✅ Vimeo Player pronto');
                        });
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(containerRef.current);

        // Cleanup
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
            observer.disconnect();
        };
    }, [videoId]);

    if (!videoId) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                background: '#000',
                color: '#fff'
            }}>
                <p>Vídeo não disponível</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                background: '#000',
                position: 'relative'
            }}
            aria-label={title || 'Vídeo da aula'}
        />
    );
};

export default VimeoPlayer;
