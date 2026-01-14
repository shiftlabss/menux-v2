import { useState } from 'react';
import { orderService } from '../services/orderService';
import { CreateOrderDTO, Order } from '../types/order';

interface UseOrderReturn {
    createOrder: (data: CreateOrderDTO) => Promise<Order | null>;
    isLoading: boolean;
    error: string | null;
    success: boolean;
    resetState: () => void;
}

export const useOrder = (): UseOrderReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createOrder = async (data: CreateOrderDTO) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const order = await orderService.createOrder(data);
            if (order) {
                setSuccess(true);
            }
            return order;
        } catch (err: any) {
            console.error("Failed to create order:", err);
            const errorMessage = err.response?.data?.message || 'Erro ao criar pedido. Tente novamente.';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setIsLoading(false);
    };

    return {
        createOrder,
        isLoading,
        error,
        success,
        resetState
    };
};
