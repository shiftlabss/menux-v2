import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import './MyOrdersModal.css';

const ChevronLeft = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MOCK_TODAY = [
    {
        id: "#5872",
        time: "Pedido hoje ás 12h34",
        status: "waiting", // waiting, annotated, completed
        statusLabel: "Aguardando Garçom",
        items: [
            { qty: 1, name: "Filé Mignon ao Poivre" },
            { qty: 1, name: "Coca-Cola Zero" }
        ]
    },
    {
        id: "#5871",
        time: "Pedido hoje ás 12h10",
        status: "annotated",
        statusLabel: "Anotado",
        items: [
            { qty: 1, name: "Carpaccio de Carne" }
        ]
    },
    {
        id: "#5870",
        time: "Pedido hoje ás 11h55",
        status: "completed",
        statusLabel: "Concluido",
        items: [
            { qty: 2, name: "Água com Gás" }
        ]
    }
];

const MOCK_HISTORY = [
    {
        id: "#5420",
        time: "Pedido ás 19h30",
        status: "completed",
        statusLabel: "Concluido",
        items: [
            { qty: 1, name: "Pizza Marguerita" },
            { qty: 2, name: "Heineken Long Neck" }
        ]
    },
    {
        id: "#5419",
        time: "Pedido ás 18h45",
        status: "completed",
        statusLabel: "Concluido",
        items: [
            { qty: 1, name: "Dadinho de Tapioca" }
        ]
    }
];

export default function MyOrdersModal({ onClose, userName, activeOrderCode, activeOrderItems = [], onReorder }) {
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
                const data = await orderService.getCustomerOrders(customerId, restaurantId);
                // Sort by date desc
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sorted);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };

        if (userName) { // Only fetch if 'logged in' (simulated by userName check)
            fetchOrders();
        }
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
                <button className="header-back-btn" onClick={onClose}>
                    <ChevronLeft />
                </button>
                <span className="header-title-text">Meus pedidos</span>
            </div>

            <div className="my-orders-content">
                <h3 className="date-section-title">Histórico</h3>

                {loading && <p style={{ textAlign: 'center', padding: 20 }}>Carregando...</p>}

                {!loading && orders.length === 0 && (
                    <p style={{ textAlign: 'center', padding: 20, color: '#888' }}>Nenhum pedido encontrado.</p>
                )}

                {orders.map((order) => {
                    const { type, label } = getStatusInfo(order.status);
                    const dateObj = new Date(order.createdAt);
                    const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const dateStr = dateObj.toLocaleDateString('pt-BR');

                    return (
                        <div key={order.id} className="order-card-container">
                            <div className="order-card-header">
                                <div className="order-info-group">
                                    <span className="order-number">#{order.code}</span>
                                    <span className="order-time">{dateStr} às {timeStr}</span>
                                </div>
                                <div className={`status-badge ${type}`}>
                                    {(type === 'annotated' || type === 'completed') && (
                                        <span style={{ marginRight: 4, display: 'flex' }}>
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 4L3.5 6.5L9 1" stroke={type === 'completed' ? 'white' : '#2E7D32'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    )}
                                    {label}
                                </div>
                            </div>

                            <div className="order-divider"></div>

                            <div className="order-summary-list">
                                {order.items && order.items.map((item, i) => (
                                    <div key={i} className="summary-item">
                                        <div className="qty-circle">{item.quantity}</div>
                                        <span className="item-name-summary">
                                            {item.menuItem ? item.menuItem.name : 'Item'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-divider"></div>

                            <button className="btn-reorder">
                                Pedir novamente
                            </button>
                        </div>
                    );
                })}
            </div>
        </motion.div >
    );
}
