import { motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const MenuxLogo = ({ height = 24 }) => (
    <img src="/logo-menux.svg" alt="Menux" style={{ height }} />
);

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
    const [observation, setObservation] = useState('');
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
                    <button className="pd-back-circle" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                </div>

                <div className="pd-image-container" style={{
                    backgroundImage: product.image ? `url(${product.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                </div>

                <div className="pd-content">
                    <h2 className="pd-title">{product.name}</h2>

                    <div className="pd-chips-row">
                        <span className="pd-chip">Serve 2 pessoas</span>
                        <span className="pd-chip">Sem glúten</span>
                    </div>

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
                    <button className="btn-add-order" onClick={() => { onAddToCart(product, observation); showToast("Item adicionado ao pedido!"); }}>
                        Adicionar ao pedido • {product.price}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
