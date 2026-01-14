import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

export const getMenuByRestaurantId = async (restaurantId: string) => {
    const response = await api.get(`/restaurants/${restaurantId}/menu`);
    return response.data;
};
