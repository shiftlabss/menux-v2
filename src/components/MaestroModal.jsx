import { motion } from 'framer-motion';
import { useState } from 'react';

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MaestroFaceIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15.5" fill="white" stroke="#E5E5E5" />
        <path d="M10 14C10 14 10.5 16 12.5 16C14.5 16 15 14 15 14" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 14C17 14 17.5 16 19.5 16C21.5 16 22 14 22 14" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 21C11 21 13 24 16 24C19 24 21 21 21 21" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17V19" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.5V6.5M12 6.5L7.5 11M12 6.5L16.5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const ModalHeader = ({ title, status, icon }) => (
    <header className="modal-header">
        <div className="modal-header-info">
            <div className="modal-header-avatar">
                {icon}
            </div>
            <div className="modal-header-text">
                <span className="modal-header-title">{title}</span>
                {status && (
                    <div className="modal-header-status">
                        <span className="status-dot"></span>
                        <span className="status-text">{status}</span>
                    </div>
                )}
            </div>
        </div>
    </header>
);


export default function MaestroModal({ onClose }) {
    const [view, setView] = useState('welcome'); // welcome, wizard, chat
    const [step, setStep] = useState(1);
    const [peopleCount, setPeopleCount] = useState(1);
    const [orderStyle, setOrderStyle] = useState(null);
    const [dietaryRestriction, setDietaryRestriction] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);

    const handleStartWizard = () => {
        setView('wizard');
        setStep(1);
    };

    const handleNextStep = () => {
        if (step === 3) {
            setStep(4);
            // No longer transitioning to step 5
        } else {
            setStep(step + 1);
        }
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        if (view === 'welcome') setView('chat');
        const newMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInputValue('');
    };

    const renderWelcome = () => (
        <>
            <div className="maestro-welcome-content">
                <div className="maestro-welcome-icon-circle">
                    <MaestroFaceIcon size={32} />
                </div>
                <h2 className="maestro-welcome-title">Sua experiência começa aqui!</h2>
                <p className="maestro-welcome-desc">O Menux mostra o cardápio, explica os pratos e ajuda você a decidir de forma rápida.</p>
                <button className="maestro-welcome-btn" onClick={handleStartWizard}>Descubra o prato ideal para hoje!</button>
            </div>
            <div className="maestro-footer-input">
                <div className="maestro-input-wrapper">
                    <input
                        type="text"
                        className="maestro-input-field"
                        placeholder="Pergunte o melhor..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                </div>
                <button className="maestro-send-btn" onClick={handleSendMessage}>
                    <SendIcon />
                </button>
            </div>
        </>
    );

    const renderChat = () => (
        <div className="chat-view-container">
            <ModalHeader
                title="Assistente Menux"
                status="Sempre online"
                icon={<MaestroFaceIcon size={24} />}
            />
            <div className="chat-messages-area">
                {messages.map(msg => (
                    <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
                        <div className={`chat-bubble ${msg.sender}`}>{msg.text}</div>
                    </div>
                ))}
            </div>
            <div className="maestro-footer-input">
                <div className="maestro-input-wrapper">
                    <input
                        type="text"
                        className="maestro-input-field"
                        placeholder="Pergunte o melhor..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                </div>
                <button className="maestro-send-btn" onClick={handleSendMessage}>
                    <SendIcon />
                </button>
            </div>
        </div>
    );

    const renderWizardSteps = () => (
        <div className="wizard-step-content">
            {step <= 3 && (
                <ModalHeader
                    title="Assistente Menux"
                    status="Sempre online"
                    icon={<MaestroFaceIcon size={24} />}
                />
            )}

            <div className="wizard-main-content">
                {step === 1 && (
                    <>
                        <h2 className="wizard-question">Quantas pessoas<br />vão comer?</h2>
                        <div className="wizard-counter">
                            <button className="wizard-counter-btn" onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}>−</button>
                            <span className="wizard-counter-value">{peopleCount}</span>
                            <button className="wizard-counter-btn" onClick={() => setPeopleCount(peopleCount + 1)}>+</button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="wizard-question">Qual o estilo do<br />pedido?</h2>
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

                {step === 3 && (
                    <>
                        <h2 className="wizard-question">Alguma restrição<br />alimentar?</h2>
                        <div className="wizard-options-grid">
                            {['Sem Glúten', 'Vegetariano', 'Sem Lactose', 'Nenhuma'].map(opt => (
                                <button
                                    key={opt}
                                    className={`wizard-option-card ${dietaryRestriction === opt ? 'active' : ''}`}
                                    onClick={() => setDietaryRestriction(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {step === 4 && (
                    <div className="wizard-loading">
                        <div className="loading-icon-wrapper">
                            <MaestroFaceIcon size={32} />
                        </div>
                        <p className="wizard-loading-text">Encontrando os melhores pratos para você...</p>
                    </div>
                )}

                {step === 5 && (
                    <div className="wizard-results-container">
                        <div className="wizard-results-header">
                            <h2 className="wizard-results-title">Com base no que<br />você disse...</h2>
                            <p className="wizard-results-subtitle">Esses são os melhores pratos para você.</p>
                        </div>
                        <div className="wizard-results-list">
                            {mockResults.map((item, index) => (
                                <div key={item.id} className="wizard-result-wrapper">
                                    <div className="wizard-result-item">
                                        <div className="wizard-result-info">
                                            <span className="wizard-result-name">{item.name}</span>
                                            <p className="wizard-result-desc">{item.desc}</p>
                                            <span className="wizard-result-price">{item.price}</span>
                                        </div>
                                        <div className="wizard-result-image"></div>
                                    </div>
                                    {index < mockResults.length - 1 && <div className="wizard-result-divider" />}
                                </div>
                            ))}
                        </div>

                        <div className="wizard-results-footer">
                            <button className="btn-chat-with-maestro" onClick={() => setView('chat')}>
                                Falar com o <MaestroLogo size={20} /> <strong>menux</strong>
                            </button>
                            <button className="btn-order-cloche">
                                <ClocheIcon />
                                <span className="cloche-badge">2</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {step <= 3 && (
                <div className="wizard-footer">
                    <button
                        className="btn-wizard-action"
                        onClick={handleNextStep}
                        disabled={(step === 2 && !orderStyle) || (step === 3 && !dietaryRestriction)}
                        style={{ opacity: ((step === 2 && !orderStyle) || (step === 3 && !dietaryRestriction)) ? 0.5 : 1 }}
                    >
                        Continuar
                    </button>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'welcome': return renderWelcome();
            case 'wizard': return renderWizardSteps();
            case 'chat': return renderChat();
            default: return renderWelcome();
        }
    };

    return (
        <motion.div className="maestro-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div
                className="maestro-modal-container"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="maestro-close-btn" onClick={onClose}>
                    <CloseIcon />
                </button>
                {renderContent()}
            </motion.div>
        </motion.div>
    );
}
