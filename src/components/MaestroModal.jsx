import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
const imgLogo = "/logo-menux.svg";

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MaestroFaceIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <img src="/icon-menux.svg" alt="Menux" className="header-avatar-img" />
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


const ClocheIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 19H2C2 19 3 13 4 10C5 7 8 4 12 4C16 4 19 7 20 10C21 13 22 19 22 19Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4V2" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19H2Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MaestroLogo = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14C4 14 4.5 16 6.5 16C8.5 16 9 14 9 14" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 14C11 14 11.5 16 13.5 16C15.5 16 16 14 16 14" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.5" />
    </svg>
);

const mockResults = [
    {
        id: 1,
        name: "Filé Mignon ao Molho Madeira",
        desc: "Filé mignon bovino macio, servido com molho madeira e champignons frescos.",
        price: "R$ 74,90",
        image: "/imgs/pratos-principais/pratop-file-mignon.jpg"
    },
    {
        id: 2,
        name: "Spaghetti à Bolonhesa",
        desc: "Massa spaghetti ao molho bolonhesa tradicional, preparada com carne bovina.",
        price: "R$ 39,90",
        image: "/imgs/pratos-principais/pratop-spaghetti.jpg"
    },
    {
        id: 3,
        name: "Petit Gateau",
        desc: "Bolo quente de chocolate com interior cremoso, servido com bola de sorvete de baunilha.",
        price: "R$ 28,00",
        image: "/imgs/sobremesas/sobremesa-petit-gateau.jpg"
    }
];

const ProductCard = ({ product, onAdd, onRemove, isInCart }) => {
    return (
        <div className="chat-product-card">
            <div className="chat-card-image" style={{ backgroundImage: product.image ? `url(${product.image})` : 'none' }}></div>
            <div className="chat-card-content">
                <div className="chat-card-tags">
                    <span className="chat-card-tag">Serve 2 pessoas</span>
                    <span className="chat-card-tag">Proteína</span>
                </div>
                <h4 className="chat-card-title">{product.name}</h4>
                <p className="chat-card-desc">{product.description || product.desc || "Fatias finas de carne bovina crua, servidas com parmesão em lâminas, rúcula fresca e azeite extravirgem."}</p>

                <div className="chat-card-footer">
                    <div className="chat-card-price-container">
                        <span className="chat-card-price">{product.price}</span>
                    </div>
                    {isInCart ? (
                        <button className="chat-card-add-btn remove" onClick={() => onRemove(product)}>Remover</button>
                    ) : (
                        <button className="chat-card-add-btn" onClick={() => onAdd(product)}>Adicionar</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function MaestroModal({ onClose, initialView = 'welcome', products = [], staticMenuData = [], cart = [], onAddToCart, onRemoveFromCart }) {
    // Carrega o estado inicial do localStorage ou usa o padrão
    // Sempre inicia no Welcome para oferecer opções, mas carrega o estado salvo
    const [view, setView] = useState(initialView);
    const [step, setStep] = useState(1);
    const [peopleCount, setPeopleCount] = useState(1);
    const [orderStyle, setOrderStyle] = useState(null);
    const [dietaryRestriction, setDietaryRestriction] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const [messages, setMessages] = useState(() => {
        const lastActivity = localStorage.getItem('maestro_last_activity');
        const now = Date.now();
        const THREE_HOURS = 3 * 60 * 60 * 1000;

        // Se passaram mais de 3 horas, limpa tudo para uma nova conversa
        if (lastActivity && (now - parseInt(lastActivity)) > THREE_HOURS) {
            localStorage.removeItem('maestro_messages');
            localStorage.removeItem('maestro_current_view');
            localStorage.removeItem('menux_user_id');
            return [];
        }

        const saved = localStorage.getItem('maestro_messages');
        return saved ? JSON.parse(saved) : [];
    });
    const { showToast } = useToast();

    // Efeito para salvar o estado e atualizar o timer de atividade
    useEffect(() => {
        localStorage.setItem('maestro_current_view', view);
        localStorage.setItem('maestro_messages', JSON.stringify(messages));
        localStorage.setItem('maestro_last_activity', Date.now().toString());
    }, [view, messages]);

    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (view === 'chat') {
            scrollToBottom();
        }
    }, [messages, isTyping, view]);

    const handleStartWizard = () => {
        setView('wizard');
        setStep(1);
    };

    const safetyTimeoutRef = useRef(null);

    const handleNextStep = () => {
        if (step === 3) {
            setStep(4);
            // Simulate AI searching with proper cleanup
            if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
            safetyTimeoutRef.current = setTimeout(() => {
                setStep(5);
            }, 3000);
        } else {
            setStep(step + 1);
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
        };
    }, []);

    const handlePrevStep = () => {
        if (step > 1) setStep(step - 1);
        else setView('welcome');
    };

    const handleRefineSearch = () => {
        setStep(2); // Go back to "Style" question
    };



    const handleSendMessage = async () => {
        if (!inputValue.trim() || isTyping) return;

        const currentInput = inputValue;
        setInputValue('');

        if (view === 'welcome') setView('chat');

        const userMsg = { id: Date.now(), text: currentInput, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);

        setIsTyping(true);

        // Get or create a persistent userId for memory context
        let userId = localStorage.getItem('menux_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('menux_user_id', userId);
        }

        try {
            const response = await fetch('https://lottoluck.app.n8n.cloud/webhook/menux', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: currentInput,
                    userId: userId
                })
            });

            const data = await response.json();
            console.log('Maestro Webhook Response:', data);

            // Extract response with more flexibility
            let aiResponse = "";
            let recommendedIds = [];

            // Helper to extract IDs
            const extractIds = (source) => {
                if (!source) return [];
                if (Array.isArray(source.ids_recomendados)) return source.ids_recomendados;
                if (Array.isArray(source.ids)) return source.ids;
                if (Array.isArray(source.product_ids)) return source.product_ids;
                if (Array.isArray(source.sugestoes_ids)) return source.sugestoes_ids;
                // If ids are strings "101, 202"
                if (typeof source.ids === 'string') return source.ids.split(',').map(s => s.trim());
                return [];
            };

            // Case 1: Array with one object (User provided format)
            if (Array.isArray(data) && data.length > 0) {
                const item = data[0];
                // Check if output exists and has the expected fields
                if (item?.output) {
                    aiResponse = item.output.resposta_chat;
                    recommendedIds = extractIds(item.output);
                } else {
                    // Fallback if structure is flat inside array
                    aiResponse = item?.resposta_chat;
                    recommendedIds = extractIds(item);
                }
            }
            // Case 2: Object containing an output object
            else if (data?.output) {
                aiResponse = data.output.resposta_chat;
                recommendedIds = extractIds(data.output);
            }
            // Case 3: Object containing the field directly
            else {
                aiResponse = data?.resposta_chat;
                recommendedIds = extractIds(data);
            }

            if (!aiResponse) {
                aiResponse = "Ops! Algo não saiu como esperado. Não foi possível processar sua solicitação no momento. Tente novamente em instantes.";
            }

            const aiMsg = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'ai',
                suggestions: recommendedIds
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Error calling webhook:', error);
            const errorMsg = { id: Date.now() + 1, text: "Ocorreu um erro de rede ao falar com o Maestro. Verifique se o webhook está aceitando requisições POST e o CORS está configurado.", sender: 'ai' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const renderWelcome = () => (
        <>
            <div className="maestro-welcome-content">
                <div className="maestro-welcome-icon-circle">
                    <img src="/icon-menux.svg" alt="Menux" style={{ width: '28px' }} />
                </div>
                <h2 className="maestro-welcome-title">Sua experiência começa aqui!</h2>
                <p className="maestro-welcome-desc">Descubra pratos que combinam com seu paladar. Em poucos passos, encontramos a escolha ideal para você.</p>
                <button className="maestro-welcome-btn" onClick={handleStartWizard}>Descubra o prato ideal para hoje!</button>
            </div>
            <div className="maestro-footer-input">
                {messages.length > 0 ? (
                    <button
                        className="maestro-welcome-btn secondary"
                        onClick={() => setView('chat')}
                        style={{
                            width: '100%',
                            margin: 0,
                            background: 'transparent',
                            color: 'black',
                            border: '1px solid black',
                            borderRadius: '16px',
                            height: '59px',
                            fontSize: '16px',
                            fontWeight: 500,
                            fontFamily: 'Bricolage Grotesque, sans-serif'
                        }}
                    >
                        Continuar conversa
                    </button>
                ) : (
                    <>
                        <div className="maestro-input-wrapper">
                            <input
                                type="text"
                                className="maestro-input-field"
                                placeholder="Qual o melhor vinho para hoje?"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button className="maestro-send-btn" onClick={handleSendMessage}>
                                <SendIcon />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );

    const renderChat = () => (
        <div className="chat-view-container">
            <ModalHeader
                title="Menux"
                status="Sempre online"
                icon={<img src="/icon-menux.svg" alt="Menux" style={{ width: '20px' }} />}
            />
            <div className="chat-messages-area">
                {messages.map((msg, index) => (
                    <div key={msg.id || index} className={`chat-bubble-wrapper ${msg.sender}`}>
                        <div className={`chat-bubble ${msg.sender}`}>
                            {msg.text}
                        </div>
                        {msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="chat-suggestions-grid">
                                {msg.suggestions.map((id, idx) => {
                                    // 1. Try Direct Lookup (Fastest)
                                    let product = products?.find(p => String(p.id) === String(id));

                                    // 2. Fallback: ID Translation via Name
                                    if (!product && staticMenuData) {
                                        // Find the "concept" in static data to get the name
                                        const staticProduct = staticMenuData
                                            .flatMap(cat => cat.subcategories.flatMap(sub => sub.items))
                                            .find(p => String(p.id) === String(id));

                                        if (staticProduct) {
                                            // Find the "real" product in current data by Name
                                            product = products?.find(p => p.name === staticProduct.name);
                                        }
                                    }

                                    if (!product) {
                                        return null;
                                    }
                                    const isInCart = cart.some(item => item.id === product.id);
                                    return (
                                        <ProductCard
                                            key={`${id}-${idx}`}
                                            product={product}
                                            isInCart={isInCart}
                                            onAdd={(p) => { onAddToCart(p); showToast("Item adicionado ao pedido!"); }}
                                            onRemove={(p) => { onRemoveFromCart(p); showToast("Item removido!"); }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="chat-bubble-wrapper ai">
                        <div className="chat-bubble ai typing">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="maestro-footer-input">
                <div className="maestro-input-wrapper">
                    <input
                        type="text"
                        placeholder="Pergunte ao Maestro..."
                        className="maestro-input-field"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="maestro-send-btn" onClick={handleSendMessage} disabled={!inputValue.trim()}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 11L12 6L17 11M12 18V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderWizardSteps = () => (
        <div className="wizard-step-content">
            {(step <= 3) && (
                <div className="modal-header-nav-wrapper">
                    <button className="wizard-back-btn" onClick={handlePrevStep}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <ModalHeader
                        title="Menux"
                        status="Sempre online"
                        icon={<img src="/icon-menux.svg" alt="Menux" style={{ width: '20px' }} />}
                    />
                </div>
            )}

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

                {step === 3 && (
                    <>
                        <h2 className="wizard-question">Possui ou tem preferência por alguma restrição alimentar?</h2>
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
                            <img src="/icon-menux.svg" alt="Menux" style={{ width: '32px' }} />
                        </div>
                        <p className="wizard-loading-text">Analisando suas preferências...</p>
                    </div>
                )}

                {step === 5 && (
                    <div className="wizard-results-container">
                        <div className="wizard-results-header">
                            <div>
                                <h2 className="wizard-results-title">Com base no que <br />você disse...</h2>
                                <p className="wizard-results-subtitle">Esses são os melhores pratos para você.</p>
                            </div>
                        </div>
                        <div className="wizard-results-list">
                            {mockResults.map((item, index) => {
                                const isInCart = cart.some(c => c.id === item.id);
                                return (
                                    <div key={item.id} className="wizard-result-wrapper">
                                        <div className="wizard-result-item">
                                            <div className="wizard-result-info">
                                                <span className="wizard-result-name">{item.name}</span>
                                                <p className="wizard-result-desc">{item.desc}</p>
                                                <div className="wizard-result-actions">
                                                    <div className="wizard-result-price-capsule">{item.price}</div>
                                                    {isInCart ? (
                                                        <button
                                                            className="btn-wizard-add remove"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (onRemoveFromCart) onRemoveFromCart(item);
                                                                showToast("Item removido do pedido");
                                                            }}
                                                        >
                                                            Remover
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn-wizard-add"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (onAddToCart) onAddToCart(item);
                                                                showToast("Item adicionado ao pedido!");
                                                            }}
                                                        >
                                                            Adicionar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="wizard-result-image" style={{ backgroundImage: item.image ? `url(${item.image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                        </div>
                                        {index < mockResults.length - 1 && <div className="wizard-result-divider" />}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="wizard-results-footer">
                            <button className="btn-back-to-menu-full" onClick={onClose}>
                                Voltar para o cardápio
                            </button>
                        </div>
                    </div>
                )}


                {step < 4 && (
                    <div className="wizard-footer">
                        <button className="btn-wizard-next" onClick={handleNextStep}>
                            Avançar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )


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

