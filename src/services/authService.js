import { api } from './api';
import { requestForToken } from './firebaseConfig';

export const authService = {
    async loginOrRegister({ phone, restaurantId, name, email }) {
        try {
            // Get FCM Token
            console.log('Attempting to retrieve FCM Token...');
            const fcmToken = await requestForToken();
            console.log('FCM Token retrieved:', fcmToken);

            const payload = {
                phone,
                restaurantId,
                fcmToken: fcmToken || null, // Ensure explicitly null if undefined
            };

            if (name) payload.name = name;
            if (email) payload.email = email;

            const response = await api.post('/customers/auth', payload);

            if (response.data) {
                const { token, sessionId, customer } = response.data;
                // Store in localStorage
                if (token) localStorage.setItem('menux_token', token);
                if (sessionId) localStorage.setItem('menux_session_id', sessionId);
                if (customer?.id) localStorage.setItem('menux_customer_id', customer.id);

                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Auth Error:', error);
            throw error;
        }
    },

    getToken() {
        return localStorage.getItem('menux_token');
    },

    getSessionId() {
        return localStorage.getItem('menux_session_id');
    },

    logout() {
        localStorage.removeItem('menux_token');
        localStorage.removeItem('menux_session_id');
        localStorage.removeItem('menux_customer_id');
    }
};
