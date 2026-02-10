import { motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const MenuxLogo = ({ height = 24 }) => (
    <img src="/logo-menux.svg" alt="Menux" height={height} />
);

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
    const [observation, setObservation] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { showToast } = useToast();

    if (!product) return null;

    return (
        <motion.div
            className="product-modal-overlay"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ ease: "easeOut", duration: 0.3 }}
        >
            <div className="product-detail-container">
                <div className="pd-header-nav">
                    <button className="pd-back-circle" onClick={onClose} aria-label="Voltar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                </div>

                <div className="pd-image-container" style={{
                    backgroundImage: product.image ? `url(${product.image})` : 'none'
                }}>
                </div>

                <div className="pd-content">
                    <h2 className="pd-title">{product.name}</h2>

                    {(product.servings || product.tags) && (
                        <div className="pd-chips-row">
                            {product.servings && <span className="pd-chip">{product.servings}</span>}
                            {product.tags && product.tags.map((tag, i) => (
                                <span key={i} className="pd-chip">{tag}</span>
                            ))}
                        </div>
                    )}

                    <p className="pd-description">{product.desc}</p>
                    <div className="pd-price">{product.price}</div>
                </div>

                <div className="pd-observations-section">
                    <label className="pd-obs-label">Alguma observação?</label>
                    <textarea
                        className="pd-obs-input"
                        placeholder="Ex: tirar a cebola, maionese à parte..."
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                    ></textarea>
                </div>

                <div className="pd-footer-action">
                    <div className="pd-footer-row">
                        <div className="pd-quantity-selector">
                            <div className="pd-qty-slot">
                                {quantity > 1 && (
                                    <button className="pd-qty-btn" onClick={() => setQuantity(quantity - 1)} aria-label="Diminuir quantidade">
                                        <svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M1 1H11" stroke="black" strokeWidth="2" strokeLinecap="round" /></svg>
                                    </button>
                                )}
                            </div>
                            <span className="pd-qty-value">{quantity}</span>
                            <div className="pd-qty-slot">
                                <button className="pd-qty-btn" onClick={() => setQuantity(quantity + 1)} aria-label="Aumentar quantidade">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V11M1 6H11" stroke="black" strokeWidth="2" strokeLinecap="round" /></svg>
                                </button>
                            </div>
                        </div>
                        <button className="btn-add-order" onClick={() => { onAddToCart(product, observation, quantity); }}>
                            Adicionar ao pedido
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
