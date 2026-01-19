import { motion } from 'framer-motion';
import '../styles/MyOrdersModal.css';
import { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
// import './MyOrdersModal.css';

const ChevronLeft = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function MyOrdersModal({ onClose, userName, activeOrderCode, activeOrderItems = [], orderHistory = [], onReorder }) {
    // Current date formatted
    const todayDate = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Map backend status to UI status
    const getStatusInfo = (status) => {
        const map = {
            'WAITING': { type: 'waiting', label: 'Aguardando' },
            'PREPARING': { type: 'annotated', label: 'Preparando' },
            'READY': { type: 'annotated', label: 'Pronto' },
            'DELIVERED': { type: 'completed', label: 'Entregue' },
            'FINISHED': { type: 'completed', label: 'Concluído' },
            'CANCELED': { type: 'completed', label: 'Cancelado' }
        };
        return map[status] || { type: 'waiting', label: status };
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const customerId = localStorage.getItem('menux_customer_id');
            // If no customerId, we might not be able to fetch history unless we use another method.
            // For now, if no customerId, we can't fetch.
            if (!customerId) return;

            setLoading(true);
            try {
                const restaurantId = import.meta.env.VITE_RESTAURANT_ID;
                let data;

                if (userName) {
                    data = await orderService.getCustomerOrders(customerId, restaurantId);
                } else {
                    data = await orderService.getTemporaryCustomerOrders(customerId, restaurantId);
                }

                // Sort by date desc
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sorted);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userName]);

    const renderedOrders = orders.length > 0 ? orders : []; // Use MOCK_TODAY if needed, but per instruction we fetch.

    return (
        <motion.div
            className="my-orders-modal"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
            <div className="my-orders-header">
                <button className="header-back-btn" onClick={onClose} aria-label="Voltar">
                    <ChevronLeft />
                </button>
                <span className="header-title-text">Meus pedidos</span>
            </div>

            <div className="my-orders-content">
                <h3 className="date-section-title">Histórico</h3>

                {loading && <p style={{ textAlign: 'center', padding: 20 }}>Carregando...</p>}

                <div className="order-divider"></div>

                <div className="order-summary-list">
                    {activeOrderItems.length > 0 ? activeOrderItems.map((item, i) => (
                        <div key={item.id || `active-${i}`} className="summary-item">
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


            {/* History List */}
            {orderHistory.map((order, idx) => {
                // Skip the currently active order if it is displayed above individually
                if (activeOrderCode && order.id === activeOrderCode) return null;

                return (
                    <div key={order.id || `history-${idx}`} className="order-card-container">
                        <div className="order-card-header">
                            <div className="order-info-group">
                                <span className="order-number">{order.id}</span>
                                <span className="order-time">{order.time}</span>
                            </div>
                            <div className={`status-badge ${order.status}`}>
                                {order.status === 'annotated' || order.status === 'completed' ? (
                                    <span className="status-icon">
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                ) : null}
                                {order.statusLabel}
                            </div>
                        </div>

                        <div className="order-divider"></div>

                        <div className="order-summary-list">
                            {order.items.map((item, i) => (
                                <div key={item.id || `order-item-${i}`} className="summary-item">
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

            {!activeOrderCode && orderHistory.length === 0 && (
                <div className="orders-empty-state">
                    <img src="/icon-menux.svg" alt="Menux" className="orders-empty-icon" />
                    <p className="orders-empty-text">Você ainda não fez nenhum pedido.</p>
                </div>
            )}

        </motion.div >
    );
}
