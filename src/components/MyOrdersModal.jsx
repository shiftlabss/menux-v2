import { motion } from 'framer-motion';
import './MyOrdersModal.css';

const ChevronLeft = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function MyOrdersModal({ onClose, userName, activeOrderCode, activeOrderItems = [], orderHistory = [], onReorder }) {
    // Current date formatted
    const todayDate = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

    // Logic: If user is logged in (userName exists), show history. exact implementation of keeping today's orders separate.
    const showHistory = !!userName;

    return (
        <motion.div
            className="my-orders-modal"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
            <div className="my-orders-header">
                <button className="header-back-btn" onClick={onClose}>
                    <ChevronLeft />
                </button>
                <span className="header-title-text">Meus pedidos</span>
            </div>

            <div className="my-orders-content">
                <h3 className="date-section-title">Hoje, {todayDate}</h3>

                {/* Always show Today's orders */}
                {/* Active Order Item */}
                {activeOrderCode && (
                    <div className="order-card-container">
                        <div className="order-card-header">
                            <div className="order-info-group">
                                <span className="order-number">{activeOrderCode}</span>
                                <span className="order-time">Pedido agora mesmo</span>
                            </div>
                            <div className="status-badge waiting">
                                Aguardando Garçom
                            </div>
                        </div>

                        <div className="order-divider"></div>

                        <div className="order-summary-list">
                            {activeOrderItems.length > 0 ? activeOrderItems.map((item, i) => (
                                <div key={i} className="summary-item">
                                    <div className="qty-circle">{item.qty || 1}</div>
                                    <span className="item-name-summary">{item.name}</span>
                                </div>
                            )) : (
                                <div className="summary-item">
                                    <div className="qty-circle">1</div>
                                    <span className="item-name-summary">Itens do Pedido</span>
                                </div>
                            )}
                        </div>

                        <div className="order-divider"></div>

                        <button
                            className="btn-reorder"
                            onClick={() => onReorder && onReorder(activeOrderItems)}
                        >
                            Pedir novamente
                        </button>
                    </div>
                )}

                {/* History List */}
                {orderHistory.map((order, idx) => {
                    // Skip the currently active order if it is displayed above individually
                    if (activeOrderCode && order.id === activeOrderCode) return null;

                    return (
                        <div key={idx} className="order-card-container">
                            <div className="order-card-header">
                                <div className="order-info-group">
                                    <span className="order-number">{order.id}</span>
                                    <span className="order-time">{order.time}</span>
                                </div>
                                <div className={`status-badge ${order.status}`}>
                                    {order.status === 'annotated' || order.status === 'completed' ? (
                                        <span style={{ marginRight: 4, display: 'flex' }}>
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 4L3.5 6.5L9 1" stroke={order.status === 'completed' ? 'white' : '#2E7D32'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    ) : null}
                                    {order.statusLabel}
                                </div>
                            </div>

                            <div className="order-divider"></div>

                            <div className="order-summary-list">
                                {order.items.map((item, i) => (
                                    <div key={i} className="summary-item">
                                        <div className="qty-circle">{item.qty}</div>
                                        <span className="item-name-summary">{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-divider"></div>

                            <button
                                className="btn-reorder"
                                onClick={() => onReorder && onReorder(order.items)}
                            >
                                Pedir novamente
                            </button>
                        </div>
                    );
                })}

                {/* Removed usage of MOCK_HISTORY as real history is now used above */}
            </div>
        </motion.div >
    );
}
