/**
 * Utilitários para detecção de dispositivo e otimizações mobile
 */

export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
};

export const isLowEndDevice = () => {
    // Detecta dispositivos com menos poder de processamento
    const ram = navigator.deviceMemory; // GB de RAM (se disponível)
    const cores = navigator.hardwareConcurrency || 2;

    return (ram && ram < 4) || cores < 4 || isMobileDevice();
};

export const getOptimalVideoQuality = () => {
    if (isLowEndDevice()) {
        return 'auto'; // Deixa Vimeo escolher, mas tende para qualidade mais baixa
    }
    return 'auto';
};

export const shouldReduceMotion = () => {
    // Respeita preferência do usuário + força em dispositivos fracos
    const userPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return userPreference || isLowEndDevice();
};
