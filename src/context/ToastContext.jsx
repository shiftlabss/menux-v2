import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ICONS = {
    success: (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    error: (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    warning: (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.33V8M8 10.67H8.007" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    info: (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 10.67V8M8 5.33H8.007" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const timerRef = useRef(null);
    const toastVariant = toast?.variant || 'success';

    const showToast = useCallback((message, variant = 'success', duration) => {
        // retrocompat: se variant for número, é duration (chamada antiga)
        if (typeof variant === 'number') {
            duration = variant;
            variant = 'success';
        }
        // Erros e warnings ficam mais tempo visíveis
        if (!duration) {
            duration = (variant === 'error' || variant === 'warning') ? 5000 : 3000;
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        setToast({ message, variant });
        timerRef.current = setTimeout(() => setToast(null), duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <AnimatePresence>
                {toast && (
                    <div className="toast-overlay">
                        <motion.div
                            className={`toast-container toast-${toastVariant}`}
                            initial={{ opacity: 0, y: -50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="toast-icon">
                                {ICONS[toastVariant] || ICONS.success}
                            </div>
                            <span className="toast-text">{toast.message}</span>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    );
};
