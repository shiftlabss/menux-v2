import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

export const getMenuByRestaurantId = async (restaurantId: string) => {
    const response = await api.get(`/restaurants/${restaurantId}/menu`);
    return response.data;
};

export const getMenuHighlights = async (restaurantId: string) => {
    const response = await api.get(`/menu/highlightsPublic`, {
        params: { restaurantId }
    });
    return response.data;
};

export const getUpsellRules = async (triggerProductId: string, upsellType: string = 'cross-sell') => {
    const response = await api.get('/upsell-rules', {
        params: {
            triggerProductId,
            upsellType
        }
    });
    return response.data;
};

export const getRestaurantBySlug = async (slug: string) => {
    const response = await api.get(`/restaurants/${slug}`);
    return response.data;
};
