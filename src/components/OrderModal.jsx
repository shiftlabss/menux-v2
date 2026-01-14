import { motion } from 'framer-motion';

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

const MinusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
    </svg>
);

export default function OrderModal({ cartItems = [], onUpdateQty, onOpenChat, onClose, onFinish }) {
    const isEmpty = cartItems.length === 0;

    const handleMaestroClick = (e) => {
        e.preventDefault();
        onOpenChat();
    };

    return (
        <motion.div
            className="product-modal-overlay order-modal-container"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
            <div className="modal-header-back">
                <button className="btn-modal-back" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <span className="order-title">Seu pedido</span>
            </div>

            <div className="order-items-list">
                {isEmpty ? (
                    <div className="empty-cart-message" style={{ textAlign: 'center', padding: '40px 20px', color: '#8A8A8A', fontFamily: 'Geist, sans-serif' }}>
                        Seu carrinho está vazio. Adicione algum item do cardápio!
                    </div>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={item.id || index} className="order-item-card">
                            <div className="order-item-image" style={{ backgroundImage: item.image ? `url(${item.image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <div className="order-item-details">
                                <span className="order-item-name">{item.name}</span>
                                <span className="order-item-desc">{item.desc}</span>
                                <span className="order-item-price">{item.price}</span>

                                {item.extras && item.extras.length > 0 && (
                                    <div className="order-item-extras">
                                        {item.extras.map(extra => (
                                            <div key={extra.id} className="extra-row">
                                                <div className="extra-qty-badge">{extra.qty}</div>
                                                <span className="extra-name">{extra.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="order-item-qty-control">
                                <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.obs, -1)}>
                                    {item.qty === 1 ? <TrashIcon /> : <MinusIcon />}
                                </button>
                                <span className="qty-val">{item.qty}</span>
                                <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.obs, 1)}>
                                    <PlusIcon />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="recommendations-wrapper">
                <a href="#" className="maestro-suggestion-link" onClick={handleMaestroClick}>
                    <span className="maestro-link-text">Quer mais algo? Fale com o </span>
                    <img src="/logo-menux.svg" alt="Menux" className="maestro-link-logo" style={{ filter: 'invert(29%) sepia(34%) saturate(7460%) hue-rotate(245deg) brightness(101%) contrast(101%)' }} />
                </a>

                <h3 className="rec-title">Peça também</h3>
                <div className="rec-scroll-container">
                    {[
                        { id: 'r1', price: "R$ 6,00", desc: "Água com Gás", image: "/imgs/bebidas-e-drinks/drinks-agua-gas.jpg" },
                        { id: 'r2', price: "R$ 18,00", desc: "Pudim de Leite", image: "/imgs/sobremesas/sobremesa-pudim.jpg" },
                        { id: 'r3', price: "R$ 24,00", desc: "Caipirinha", image: "/imgs/bebidas-e-drinks/drink-caipirinha.jpg" }
                    ].map(rec => (
                        <div key={rec.id} className="rec-card">
                            <div className="rec-img" style={{ backgroundImage: `url(${rec.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <div className="rec-price">{rec.price}</div>
                            <div className="rec-desc">{rec.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-footer-actions">
                <button className="btn-finish-order" onClick={onFinish}>
                    Concluir e Chamar Garçom
                </button>
                <button className="btn-secondary-order" onClick={onClose}>
                    Voltar ao Cardápio
                </button>
            </div>
        </motion.div>
    );
}
