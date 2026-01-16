import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useState, useEffect, useRef } from 'react';
import { getUpsellRules } from '../services/api';
import { analytics } from '../services/analyticsService';


const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

const MinusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
    </svg>
);

export default function OrderModal({ cartItems = [], onUpdateQty, onAddToCart, onOpenChat, onClose, onFinish }) {
    const { showToast } = useToast();
    const isEmpty = cartItems.length === 0;
    const [recommendations, setRecommendations] = useState([]);
    const startTimeRef = useRef(Date.now());



    const fetchRecommendations = async () => {
        // Avoid fetching if using Mock Auth (unless user wants it, but standard practice in this project seems to be checking it)
        // However, the request didn't specify mock auth check for this specific feature, but earlier code does. 
        // To be safe, I'll assume we want this to work with real API primarily.
        if (import.meta.env.VITE_USE_MOCK_AUTH === 'false') {
            try {
                // Fetch rules for all items in cart
                const promises = cartItems.map(item =>
                    getUpsellRules(item.id, 'cross-sell').catch(err => {
                        console.error(`Error fetching upsell for ${item.id}:`, err);
                        return [];
                    })
                );

                const results = await Promise.all(promises);

                // Results is array of arrays of rules
                // We need to extract upgradeProduct from each rule
                const allRules = results.flat();

                const suggestions = allRules
                    .filter(rule => rule && rule.isActive && rule.upgradeProduct)
                    .map(rule => rule.upgradeProduct);

                // Deduplicate by ID
                const uniqueSuggestions = Array.from(new Map(suggestions.map(item => [item.id, item])).values());

                // Filter out items already in cart or the item itself (though cart check covers it usually)
                // The prompt says "show recommended items... where trigger is the inserted item".
                // It doesn't explicitly say "hide if already in cart", but UI logic usually does or just shows quantity. 
                // The existing UI logic handles "inCart" quantity display, so we can keep them even if in cart.

                // Transform to match UI expectation if needed (fields: id, name, price, desc, image/imageUrl)
                const formattedSuggestions = uniqueSuggestions.map(p => ({
                    id: p.id,
                    name: p.name,
                    desc: p.description,
                    price: `R$ ${Number(p.price).toFixed(2).replace('.', ',')}`,
                    image: p.imageUrl
                }));

                setRecommendations(formattedSuggestions);

            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        } else {
            // Fallback to empty or keep static if needed? User asked to show "items suggested in rules".
            // If mocking or no rules, maybe show nothing or keep the static list as "default"?
            // The prompt implies we MUST show rule-based items. I'll default to empty if not real auth/api.
            setRecommendations([]);
        }
    };

    fetchRecommendations();
    // }, [cartItems]);

    // Calculate cart total — parse BRL format "R$ 1.234,56" -> 1234.56
    const parseBRL = (str) => {
        const cleaned = (str || '').replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
    };

    const cartTotal = cartItems.reduce((sum, item) => {
        return sum + (parseBRL(item.price) * item.qty);
    }, 0);

    const formattedTotal = cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    // Analytics: Tracker de Impressões (Upsell)
    useEffect(() => {
        if (!recommendations || recommendations.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.dataset.upsellId) {
                    const upsellId = entry.target.dataset.upsellId;
                    analytics.track('impression', {
                        itemId: upsellId,
                        context: 'upsell-carousel'
                    });
                }
            });
        }, { threshold: 0.6 });

        // Pequeno delay para garantir render
        setTimeout(() => {
            const cards = document.querySelectorAll('.upsell-card');
            cards.forEach(card => observer.observe(card));
        }, 1000);

        return () => observer.disconnect();
    }, [recommendations]);

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
                <button className="btn-modal-back" onClick={onClose} aria-label="Voltar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
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
                                <div className="order-item-image" style={{ backgroundImage: item.image ? `url(${item.image})` : undefined }}></div>
                                <div className="order-item-details">
                                    <span className="order-item-name">{item.name}</span>
                                    <span className="order-item-desc">{item.desc}</span>
                                    <span className="order-item-price">{item.price}</span>

                                    {item.obs && (
                                        <div className="order-item-obs" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {item.obs.split('\n').map((line, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                    <div style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#F2F2F2',
                                                        color: '#000',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        fontFamily: 'Geist, sans-serif'
                                                    }}>1</div>
                                                    <span style={{
                                                        fontFamily: 'Geist, sans-serif',
                                                        fontSize: '14px',
                                                        color: '#8A8A8A',
                                                        lineHeight: '1.4'
                                                    }}>
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
                                    <button className="qty-btn" aria-label={item.qty === 1 ? "Remover item" : "Diminuir quantidade"} onClick={() => {
                                        if (item.qty === 1) showToast("Item removido do pedido.");
                                        onUpdateQty(item.id, item.obs, -1);
                                    }}>
                                        {item.qty === 1 ? <TrashIcon /> : <MinusIcon />}
                                    </button>
                                    <span className="qty-val">{item.qty}</span>
                                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.obs, 1)} aria-label="Aumentar quantidade">
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
                        <img src="/logo-menux.svg" alt="Menux" className="maestro-link-logo maestro-link-logo-purple" />
                    </a>

                    {recommendations.length > 0 && (
                        <>
                            <h3 className="rec-title">Peça também</h3>
                            <div className="rec-scroll-container">
                                {recommendations.map(rec => {
                                    const inCart = cartItems.find(item => item.id === rec.id);
                                    const qty = inCart ? inCart.qty : 0;

                                    return (
                                        <div key={rec.id} className="rec-card upsell-card" data-upsell-id={rec.id}>
                                            <div key={rec.id} className="rec-card">
                                                <div className="rec-img" style={{ backgroundImage: rec.image ? `url(${rec.image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#eee' }}>
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
                                                            <button className="rec-add-btn" onClick={() => {
                                                                const decisionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
                                                                onAddToCart(rec, '', 1, decisionTime, { isSuggestion: true, suggestionType: 'upsell' });
                                                                analytics.track('click', {
                                                                    itemId: rec.id,
                                                                    context: 'upsell-carousel'
                                                                });
                                                                showToast("Item adicionado ao pedido!");
                                                            }}></button>
                                                            // <button className="rec-add-btn" onClick={() => { onAddToCart(rec, ''); showToast("Item adicionado ao pedido!"); }}>
                                                            //     <PlusIcon />
                                                            // </button>

                                                        )}

                                                    </div>
                                                </div>

                                                <div className="rec-info">
                                                    <div className="rec-price">{rec.price}</div>
                                                    <div className="rec-name">{rec.name}</div>
                                                </div>

                                            </div>

                                        </div>

                                    )

                                })}

                            </div>
                        </>
                    )}


                </div>

            </div>
            <div className="order-footer-actions">
                {!isEmpty && (
                    <div className="order-total-text">
                        Total: {formattedTotal}
                    </div>
                )}
                <button
                    className="btn-finish-order"
                    onClick={onFinish}
                    disabled={isEmpty}
                >
                    Concluir e Chamar Garçom
                </button>
            </div>
        </motion.div>
    );
}
