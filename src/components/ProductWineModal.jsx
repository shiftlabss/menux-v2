import { motion } from 'framer-motion';
import { useState } from 'react';
import './ProductWineModal.css';

const FactoryIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const GrapesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6.5" cy="8" r="2.5" />
        <circle cx="12.5" cy="8" r="2.5" />
        <circle cx="18.5" cy="8" r="2.5" />
        <circle cx="9.5" cy="13" r="2.5" />
        <circle cx="15.5" cy="13" r="2.5" />
        <circle cx="12.5" cy="18" r="2.5" />
        <path d="M12 2v3" />
    </svg>
);

const MapPinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const WineIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8" />
        <path d="M7 10h10" />
        <path d="M12 15v7" />
        <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z" />
    </svg>
);

export default function ProductWineModal({ product, onClose, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    // Default facts if not provided
    const facts = product.facts || {
        vinicola: 'Marchesi Antinori',
        uvas: 'Cabernet',
        regiao: 'Toscana',
        estilo: 'Tinto Encorpado'
    };

    return (
        <motion.div
            className="wine-modal-overlay"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ ease: "easeOut", duration: 0.3 }}
        >
            <div className="wine-detail-container">
                <div className="wine-header-nav">
                    <button className="wine-back-circle" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button className="wine-back-pill" onClick={onClose}>
                        <span className="wine-back-text">Voltar ao Cardápio</span>
                    </button>
                </div>

                <div className="wine-image-wrapper">
                    <div className="wine-image-container" style={{
                        backgroundImage: product.image ? `url(${product.image})` : 'none',
                    }}>
                    </div>
                </div>

                <div className="wine-content">
                    <div className="wine-tags-row">
                        {product.country && (
                            <div className="wine-tag">
                                <div className="wine-tag-flag">
                                    <img src={product.countryFlag || "https://flagcdn.com/w20/br.png"} alt={product.country} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                {product.country}
                            </div>
                        )}
                        {product.year && (
                            <div className="wine-tag">
                                {product.year}
                            </div>
                        )}
                    </div>

                    <h2 className="wine-title">{product.name}</h2>
                    <div className="wine-price">{product.price}</div>

                    <div className="wine-divider"></div>

                    <div className="wine-facts-section">
                        <h3 className="wine-facts-title">Fatos sobre o Vinho</h3>

                        <div className="wine-fact-row">
                            <div className="wine-fact-label-group">
                                <FactoryIcon />
                                <span className="wine-fact-label">Vinícola</span>
                            </div>
                            <span className="wine-fact-value">{facts.vinicola}</span>
                        </div>

                        <div className="wine-fact-row">
                            <div className="wine-fact-label-group">
                                <GrapesIcon />
                                <span className="wine-fact-label">Uvas</span>
                            </div>
                            <span className="wine-fact-value">{facts.uvas}</span>
                        </div>

                        <div className="wine-fact-row">
                            <div className="wine-fact-label-group">
                                <MapPinIcon />
                                <span className="wine-fact-label">Região</span>
                            </div>
                            <span className="wine-fact-value">{facts.regiao}</span>
                        </div>

                        <div className="wine-fact-row">
                            <div className="wine-fact-label-group">
                                <WineIcon />
                                <span className="wine-fact-label">Estilo</span>
                            </div>
                            <span className="wine-fact-value">{facts.estilo}</span>
                        </div>
                    </div>
                </div>

                <div className="wine-footer-action">
                    <div className="wine-footer-row">
                        <div className="wine-qty-selector">
                            <button className="wine-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M1 1H11" stroke="black" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                            <span className="wine-qty-value">{quantity}</span>
                            <button className="wine-qty-btn" onClick={() => setQuantity(quantity + 1)}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V11M1 6H11" stroke="black" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <button className="btn-wine-add" onClick={() => { onAddToCart(product, '', quantity); }}>
                            Adicionar ao pedido
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
