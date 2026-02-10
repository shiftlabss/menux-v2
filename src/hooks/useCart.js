import { useState, useEffect } from 'react';
import storage, { KEYS } from '../services/storageService';
import { generateOrderCode } from '../utils/generateId';
import { safeParseCart, safeParseOrders } from '../schemas';

export default function useCart() {
    const [cart, setCart] = useState([]);
    const [activeOrderCode, setActiveOrderCode] = useState(null);
    const [activeOrderItems, setActiveOrderItems] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);

    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

    // Load from storage on mount (with schema validation)
    useEffect(() => {
        const savedCart = safeParseCart(storage.getJSON(KEYS.CART));
        if (savedCart) setCart(savedCart);

        const savedCode = storage.get(KEYS.ACTIVE_ORDER);
        if (savedCode) setActiveOrderCode(savedCode);

        const savedItems = safeParseCart(storage.getJSON(KEYS.ACTIVE_ITEMS));
        if (savedItems) setActiveOrderItems(savedItems);

        const savedHistory = safeParseOrders(storage.getJSON(KEYS.ORDER_HISTORY));
        if (savedHistory) setOrderHistory(savedHistory);
    }, []);

    // Persist on change
    useEffect(() => { storage.set(KEYS.CART, cart); }, [cart]);
    useEffect(() => { storage.set(KEYS.ACTIVE_ITEMS, activeOrderItems); }, [activeOrderItems]);
    useEffect(() => { if (activeOrderCode) storage.set(KEYS.ACTIVE_ORDER, activeOrderCode); }, [activeOrderCode]);
    useEffect(() => { storage.set(KEYS.ORDER_HISTORY, orderHistory); }, [orderHistory]);

    const normalizeObs = (text) => (text || '').trim().replace(/\s+/g, ' ');

    const addToCart = (product, obs, qty = 1) => {
        const cleanObs = normalizeObs(obs);
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.obs === cleanObs);
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.obs === cleanObs)
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            }
            return [...prev, { ...product, qty, obs: cleanObs }];
        });
    };

    const removeSingle = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (!existing) return prev;
            if (existing.qty > 1) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i);
            }
            return prev.filter(i => i.id !== item.id);
        });
    };

    const removeProduct = (product) => {
        setCart(prev => prev.filter(item => item.id !== product.id));
    };

    const updateQty = (itemId, obs, delta) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === itemId && item.obs === obs) {
                    const newQty = Math.max(0, item.qty + delta);
                    return { ...item, qty: newQty };
                }
                return item;
            }).filter(item => item.qty > 0);
        });
    };

    const finishOrder = () => {
        const orderId = generateOrderCode();
        const currentItems = [...cart];
        const newOrder = {
            id: orderId,
            time: `Pedido hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
            status: "waiting",
            statusLabel: "Aguardando Garçom",
            items: currentItems,
            timestamp: Date.now()
        };
        setActiveOrderCode(orderId);
        setActiveOrderItems(currentItems);
        setOrderHistory(prev => [newOrder, ...prev]);
        return orderId;
    };

    const reorder = (items) => {
        setCart(prev => [...prev, ...items]);
    };

    const clearCart = () => setCart([]);

    return {
        cart,
        cartCount,
        activeOrderCode,
        activeOrderItems,
        orderHistory,
        addToCart,
        removeSingle,
        removeProduct,
        updateQty,
        finishOrder,
        reorder,
        clearCart,
    };
}
