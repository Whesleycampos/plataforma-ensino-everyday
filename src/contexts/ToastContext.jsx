import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, options = {}) => {
        const id = ++toastId;
        const {
            type = 'info', // 'success' | 'error' | 'warning' | 'info'
            duration = 4000,
            action = null // { label: string, onClick: () => void }
        } = options;

        const newToast = { id, message, type, action };
        setToasts(prev => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Convenience methods
    const toast = {
        success: (message, options) => addToast(message, { ...options, type: 'success' }),
        error: (message, options) => addToast(message, { ...options, type: 'error' }),
        warning: (message, options) => addToast(message, { ...options, type: 'warning' }),
        info: (message, options) => addToast(message, { ...options, type: 'info' }),
    };

    return (
        <ToastContext.Provider value={{ toast, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const ToastIcon = ({ type }) => {
    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />,
    };
    return icons[type] || icons.info;
};

const ToastContainer = ({ toasts, onRemove }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" role="region" aria-label="Notificações">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast toast--${toast.type}`}
                    role="alert"
                    aria-live="polite"
                >
                    <div className="toast__icon">
                        <ToastIcon type={toast.type} />
                    </div>
                    <div className="toast__content">
                        <p className="toast__message">{toast.message}</p>
                        {toast.action && (
                            <button
                                className="toast__action"
                                onClick={() => {
                                    toast.action.onClick();
                                    onRemove(toast.id);
                                }}
                            >
                                {toast.action.label}
                            </button>
                        )}
                    </div>
                    <button
                        className="toast__close"
                        onClick={() => onRemove(toast.id)}
                        aria-label="Fechar notificação"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastProvider;
