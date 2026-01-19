import { api } from './api';
import { CreateOrderDTO, Order } from '../types/order';

export const orderService = {
    createOrder: async (data: CreateOrderDTO): Promise<Order> => {
        const response = await api.post<Order>('/orders', data);
        return response.data;
    },

    getOrder: async (id: string): Promise<Order> => {
        const response = await api.get<Order>(`/orders/${id}`);
        return response.data;
    },

    getCustomerOrders: async (customerId: string, restaurantId?: string): Promise<Order[]> => {
        const response = await api.get<Order[]>(`/orders/customer/${customerId}`, {
            params: { restaurantId }
        });
        return response.data;
    },

    getTemporaryCustomerOrders: async (temporaryCustomerId: string, restaurantId?: string): Promise<Order[]> => {
        const response = await api.get<Order[]>(`/orders/temporary-customer/${temporaryCustomerId}`, {
            params: { restaurantId }
        });
        return response.data;
    }
};
