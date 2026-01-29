import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { CONFIG } from '../config';
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
    const [recommendations, setRecommendations] = useState([]);

    const getRecommendations = () => {
        if (!products || products.length === 0) return [];

        let filtered = [...products];

        // 1. Dietary Restrictions
        if (dietaryRestriction && dietaryRestriction !== 'Nenhuma') {
            const restrictionLower = dietaryRestriction.toLowerCase();
            filtered = filtered.filter(p => {
                const desc = (p.desc || p.description || "").toLowerCase();
                const name = p.name.toLowerCase();
                // Simple keyword matching for prototype
                if (restrictionLower.includes('glúten')) return desc.includes('sem glúten') || name.includes('sem glúten') || p.categoryId === 'bebidas';
                if (restrictionLower.includes('vegetariano')) return desc.includes('vegetariano') || name.includes('vegetariano') || p.categoryId === 'sobremesas';
                if (restrictionLower.includes('lactose')) return desc.includes('zero lactose') || name.includes('zero lactose');
                return true;
            });
            // Fallback if too strict
            if (filtered.length === 0) filtered = [...products];
        }

        // 2. Order Style
        if (orderStyle) {
            filtered = filtered.sort((a, b) => {
                const getScore = (item) => {
                    let score = 0;
                    const cat = item.categoryId;
                    const desc = (item.desc || "").toLowerCase();

                    if (orderStyle === 'Leve') {
                        if (cat === 'entradas' && item.subcategoryId === 'frias') score += 5;
                        if (cat === 'principais' && item.subcategoryId === 'peixes') score += 4;
                        if (desc.includes('salada')) score += 3;
                    } else if (orderStyle === 'Para compartilhar') {
                        if (cat === 'entradas' && item.subcategoryId === 'compartilhar') score += 5;
                        if (cat === 'pizzas') score += 4;
                        if (desc.includes('serve 2')) score += 3;
                    } else if (orderStyle === 'Muita fome') {
                        if (cat === 'principais' && item.subcategoryId === 'carnes') score += 5;
                        if (cat === 'lanches' && item.subcategoryId === 'hamburgueres') score += 4;
                        if (cat === 'principais' && item.subcategoryId === 'massas') score += 3;
                    } else if (orderStyle === 'Rápido') {
                        if (cat === 'lanches') score += 5;
                        if (cat === 'entradas') score += 3;
                    }
                    return score;
                };
                return getScore(b) - getScore(a);
            });
        }

        // 3. People Count (Boost 'Share' items if > 1)
        if (peopleCount > 1) {
            filtered = filtered.sort((a, b) => {
                const isShareable = (item) => {
                    const cat = item.categoryId;
                    const desc = (item.desc || "").toLowerCase();
                    if (cat === 'pizzas' || cat === 'vinhos' || (cat === 'entradas' && item.subcategoryId === 'compartilhar')) return 1;
                    if (desc.includes('serve 2') || desc.includes('compartilhar')) return 1;
                    return 0;
                };
                return isShareable(b) - isShareable(a);
            });
        }

        return filtered.slice(0, 3); // Return top 3
    };

    const handleNextStep = () => {
        if (step === 3) {
            setStep(4);
            // Simulate processing time
            const processingTime = setTimeout(() => {
                const results = getRecommendations();
                setRecommendations(results);
                setStep(5);
            }, 1500);
            return () => clearTimeout(processingTime);
        } else {
            setStep(step + 1);
        }
    };

    // ... (keep handlePrevStep, handleRefineSearch, handleSendMessage)

    // ... (keep renderWelcome, renderChat)

    const renderWizardSteps = () => (
        <div className="wizard-step-content">
            {/* ... (keep header logic) */}
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
                            {recommendations.length > 0 ? (
                                recommendations.map((item, index) => {
                                    const isInCart = cart.some(c => c.id === item.id);
                                    return (
                                        <div key={item.id} className="wizard-result-wrapper">
                                            <div className="wizard-result-item">
                                                <div className="wizard-result-info">
                                                    <span className="wizard-result-name">{item.name}</span>
                                                    <p className="wizard-result-desc">{item.desc || item.description}</p>
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
                                            {index < recommendations.length - 1 && <div className="wizard-result-divider" />}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="wizard-no-results">
                                    <p>Nenhum prato encontrado com essas preferências exatas. Tente mudar o estilo!</p>
                                    <button className="btn-wizard-restart" onClick={handleRefineSearch}>Refazer busca</button>
                                </div>
                            )}
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

