import { motion } from 'framer-motion';
import { useState } from 'react';

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MaestroFaceIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 14C10 14 11 12 13 12C15 12 16 14 16 14" stroke="black" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 14C16 14 17 12 19 12C21 12 22 14 22 14" stroke="black" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 20C11 20 13 24 16 24C19 24 21 20 21 20" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function MaestroModal({ onClose }) {
    const [view, setView] = useState('welcome'); // welcome, wizard
    const [step, setStep] = useState(1);
    const [peopleCount, setPeopleCount] = useState(1);
    const [orderStyle, setOrderStyle] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const handleStartWizard = () => {
        setView('wizard');
        setStep(1);
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const renderWelcome = () => (
        <>
            <button className="maestro-close-btn" onClick={onClose}>
                <CloseIcon />
            </button>
            <div className="maestro-welcome-content">
                <div className="maestro-welcome-icon-circle">
                    <MaestroFaceIcon />
                </div>

                <h2 className="maestro-welcome-title">
                    Sua experiência começa aqui!
                </h2>

                <p className="maestro-welcome-desc">
                    O Menux mostra o cardápio, explica os pratos e ajuda você a decidir de forma rápida.
                </p>

                <button className="maestro-welcome-btn" onClick={handleStartWizard}>
                    Descubra o prato ideal para hoje!
                </button>
            </div>

            <div className="maestro-footer-input">
                <div className="maestro-input-wrapper">
                    <input
                        type="text"
                        className="maestro-input-field"
                        placeholder="Pergunte o melhor..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <button className="maestro-send-btn">
                    <SendIcon />
                </button>
            </div>
        </>
    );

    const renderWizardSteps = () => (
        <div className="wizard-step-content">
            <header className="wizard-header">
                <div className="wizard-assistant-info">
                    <div className="wizard-avatar-mini">
                        <MaestroFaceIcon size={24} />
                    </div>
                    <div className="wizard-status-group">
                        <span className="wizard-assistant-name">Assistente Menux</span>
                        <span className="wizard-status-online">Sempre online</span>
                    </div>
                </div>
                <button className="wizard-close-inline" onClick={onClose}>
                    <CloseIcon />
                </button>
            </header>

            <div className="wizard-main-content">
                {step === 1 && (
                    <>
                        <h2 className="wizard-question">Quantas pessoas vão comer?</h2>
                        <div className="wizard-counter">
                            <button className="wizard-counter-btn" onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}>−</button>
                            <span className="wizard-counter-value">{peopleCount}</span>
                            <button className="wizard-counter-btn" onClick={() => setPeopleCount(peopleCount + 1)}>+</button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="wizard-question">Qual o estilo do pedido?</h2>
                        <div className="wizard-options-grid">
                            {['Leve', 'Para compartilhar', 'Muita fome', 'Rápido'].map(opt => (
                                <button
                                    key={opt}
                                    className={`wizard-option-card ${orderStyle === opt ? 'active' : ''}`}
                                    onClick={() => setOrderStyle(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="wizard-footer">
                <button
                    className="btn-wizard-action"
                    onClick={handleNextStep}
                    disabled={step === 2 && !orderStyle}
                    style={{ opacity: (step === 2 && !orderStyle) ? 0.5 : 1 }}
                >
                    Continuar
                </button>
                <button
                    style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        marginTop: '16px',
                        color: '#A3A3A3',
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                    onClick={() => setView('welcome')}
                >
                    Voltar ao início
                </button>
            </div>
        </div>
    );

    return (
        <motion.div
            className="maestro-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="maestro-modal-container"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
            >
                {view === 'welcome' ? renderWelcome() : renderWizardSteps()}
            </motion.div>
        </motion.div>
    );
}

