import { motion } from 'framer-motion';
import { useState } from 'react';

const imgChevronLeft = "/chevron-left.svg"; // Mockup path, we might need to adjust or use text in SVG
// Using an inline SVG for the chevron to ensure it renders without missing asset issues
const ChevronLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
    const [observations, setObservations] = useState('');

    if (!product) return null;

    return (
        <motion.div
            className="product-modal-overlay"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="product-detail-container">
                <div className="pd-header-nav">
                    <div className="pd-back-circle" onClick={onClose}>
                        <ChevronLeftIcon />
                    </div>
                    <div className="pd-back-pill" onClick={onClose}>
                        <span className="pd-back-text">Voltar ao Cardápio</span>
                    </div>
                </div>

                <div className="pd-image-container">
                    {/* Placeholder for product image */}
                </div>

                <div className="pd-content">
                    <h2 className="pd-title">{product.name}</h2>

                    <div className="pd-chips-row">
                        {/* Fallback tags for demonstration if product.tags is missing */}
                        {(product.tags || ['Serve 2 pessoas', 'Para compartilhar', 'Sabor intenso']).map((tag, index) => (
                            <span key={index} className="pd-chip">{tag}</span>
                        ))}
                    </div>

                    <p className="pd-description">{product.desc}</p>
                    <span className="pd-price">{product.price}</span>
                </div>

                <div className="pd-observations-section">
                    <label className="pd-obs-label">Observações do pedido</label>
                    <textarea
                        className="pd-obs-input"
                        placeholder="Digite aqui as observações"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                    />
                </div>

                <div className="pd-footer-action">
                    <button className="btn-add-order" onClick={() => onAddToCart(product, observations)}>
                        Adicionar ao pedido
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
