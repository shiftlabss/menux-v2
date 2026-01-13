import { motion } from 'framer-motion';

export default function OrderModal({ cartItems, onClose, onFinish }) {
    return (
        <motion.div
            className="product-modal-overlay"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ ease: "easeOut", duration: 0.3 }}
        >
            <div className="order-modal-header">
                <button className="order-back-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="order-title">Seu pedido</div>
                <div style={{ width: 24 }}></div> {/* Spacer for alignment */}
            </div>

            <div className="order-items-list">
                {cartItems && cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <div key={index} className="order-item-card">
                            <div className="order-item-image"></div>
                            <div className="order-item-details">
                                <span className="order-item-name">{item.name}</span>
                                <span className="order-item-desc">Observação: {item.obs || 'Nenhuma'}</span>
                                <span className="order-item-price">{item.price}</span>
                            </div>
                            <div className="order-item-qty-control">
                                <button className="qty-btn">-</button>
                                <span className="qty-val">1</span>
                                <button className="qty-btn">+</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#7E7E7E', marginTop: 40 }}>
                        Seu carrinho está vazio.
                    </div>
                )}
            </div>

            <div className="recommendations-wrapper">
                <a href="#" className="maestro-suggestion-link">
                    <img src="/icon-menux.svg" alt="Maestro" className="maestro-link-logo" />
                    <span className="maestro-link-text">Sugestão do Maestro para acompanhar</span>
                </a>

                <h3 className="rec-title">Combina muito bem com</h3>
                <div className="rec-scroll-container">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rec-card">
                            <div className="rec-img"></div>
                            <div className="rec-price">R$ 12,00</div>
                            <div className="rec-desc">Refrigerante lata 350ml</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-footer-actions">
                <button className="btn-finish-order" onClick={onFinish}>
                    Confirmar pedido
                </button>
            </div>
        </motion.div>
    );
}
