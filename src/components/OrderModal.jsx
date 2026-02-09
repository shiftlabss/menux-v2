import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

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

export default function OrderModal({ cartItems = [], onUpdateQty, onAddToCart, onOpenChat, onClose, onFinish }) {
    const { showToast } = useToast();
    const isEmpty = cartItems.length === 0;

    // Calculate cart total — parse BRL format "R$ 1.234,56" -> 1234.56
    const parseBRL = (str) => {
        const cleaned = (str || '').replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
    };

    const cartTotal = cartItems.reduce((sum, item) => {
        return sum + (parseBRL(item.price) * item.qty);
    }, 0);

    const formattedTotal = cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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

            <div className="order-scroll-content">
                <div className="order-items-list">
                    {isEmpty ? (
                        <div className="empty-cart-message">
                            <p>Seu carrinho está vazio. Adicione algum item do cardápio!</p>
                            <button className="empty-cart-btn" onClick={onClose}>
                                Voltar ao cardápio
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={item.id || index} className="order-item-card">
                                <div className="order-item-image" style={{ backgroundImage: item.image ? `url(${item.image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                <div className="order-item-details">
                                    <span className="order-item-name">{item.name}</span>
                                    <span className="order-item-desc">{item.desc}</span>
                                    <span className="order-item-price">{item.price}</span>

                                    {item.obs && (
                                        <div className="order-item-obs-list">
                                            {item.obs.split('\n').map((line, i) => (
                                                <div key={i} className="obs-item">
                                                    <div className="obs-number">{i + 1}</div>
                                                    <span className="obs-text">
                                                        {line}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

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
                                    <button className="qty-btn" onClick={() => {
                                        if (item.qty === 1) showToast("Item removido do pedido.");
                                        onUpdateQty(item.id, item.obs, -1);
                                    }}>
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
                            { id: '39', name: "Água com Gás", price: "R$ 6,00", desc: "Água mineral com gás.", image: "/imgs/bebidas-e-drinks/drinks-agua-gas.jpg" },
                            { id: '28', name: "Pudim de Leite", price: 'R$ 24,00', desc: "Clássico pudim de leite.", image: "/imgs/sobremesas/sobremesa-pudim.jpg" },
                            { id: '40', name: "Caipirinha", price: 'R$ 22,00', desc: "Limão taiti e cachaça.", image: "/imgs/bebidas-e-drinks/drink-caipirinha.jpg" }
                        ].map(rec => {
                            const inCart = cartItems.find(item => item.id === rec.id);
                            const qty = inCart ? inCart.qty : 0;

                            return (
                                <div key={rec.id} className="rec-card">
                                    <div className="rec-img" style={{ backgroundImage: `url(${rec.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                        <div className="rec-qty-overlay" onClick={(e) => e.stopPropagation()}>
                                            {qty > 0 ? (
                                                <div className="rec-qty-controls">
                                                    <button className="rec-qty-btn" onClick={() => onUpdateQty(rec.id, '', -1)}>
                                                        {qty === 1 ? <TrashIcon /> : <MinusIcon />}
                                                    </button>
                                                    <span className="rec-qty-val">{qty}</span>
                                                    <button className="rec-qty-btn" onClick={() => onUpdateQty(rec.id, '', 1)}>
                                                        <PlusIcon />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="rec-add-btn" onClick={() => { onAddToCart(rec, ''); showToast("Item adicionado ao pedido!"); }}>
                                                    <PlusIcon />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="rec-info">
                                        <div className="rec-price">{rec.price}</div>
                                        <div className="rec-name">{rec.name}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="order-footer-actions">
                {!isEmpty && (
                    <div style={{ textAlign: 'center', marginBottom: '10px', fontFamily: 'Geist, sans-serif', fontSize: '15px', fontWeight: '600', color: '#333' }}>
                        Total: {formattedTotal}
                    </div>
                )}
                <button
                    className="btn-finish-order"
                    onClick={onFinish}
                    disabled={isEmpty}
                    style={isEmpty ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                >
                    Concluir e Chamar Garçom
                </button>
            </div>
        </motion.div>
    );
}
