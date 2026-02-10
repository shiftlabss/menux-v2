/**
 * Serviço centralizado de localStorage para o Menux.
 * Todas as chaves e operações de leitura/escrita passam por aqui.
 */

export const KEYS = {
    // User identity
    PHONE: 'menux_phone',
    USER: 'menux_user',
    AVATAR: 'menux_avatar',
    IS_RETURNING: 'menux_is_returning',

    // Cart & Orders
    CART: 'menux_cart',
    ACTIVE_ORDER: 'menux_active_order',
    ACTIVE_ITEMS: 'menux_active_items',
    ORDER_HISTORY: 'menux_order_history',

    // Maestro (AI chat)
    MAESTRO_MESSAGES: 'maestro_messages',
    MAESTRO_VIEW: 'maestro_current_view',
    MAESTRO_ACTIVITY: 'maestro_last_activity',
    USER_ID: 'menux_user_id',
    REGISTERED_AT: 'menux_registered_at',

    // Studio (admin)
    STUDIO_BRANDING: 'menux_studio_branding',
    STUDIO_CATEGORIES: 'menux_studio_categories',
    STUDIO_PRODUCTS: 'menux_studio_products',
    V4_MIGRATION: 'menux_v4_pizza_update',
} as const;

export type StorageKey = typeof KEYS[keyof typeof KEYS];

function get(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function getJSON<T = unknown>(key: string, fallback: T | null = null): T | null {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function set(key: string, value: unknown): boolean {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        return true;
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.warn(`[Storage] Quota exceeded for key "${key}". Consider using smaller images.`);
        }
        return false;
    }
}

function remove(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {
        // ignore
    }
}

/** Remove all menux_ and maestro_ keys from localStorage */
function clearAll(): void {
    try {
        Object.keys(localStorage)
            .filter(key => key.startsWith('menux_') || key.startsWith('maestro_'))
            .forEach(key => localStorage.removeItem(key));
    } catch {
        // ignore
    }
}

/** Remove user identity + session data (keeps Studio config) */
function clearSession(): void {
    [
        KEYS.PHONE,
        KEYS.USER,
        KEYS.AVATAR,
        KEYS.IS_RETURNING,
        KEYS.CART,
        KEYS.ACTIVE_ORDER,
        KEYS.ACTIVE_ITEMS,
        KEYS.ORDER_HISTORY,
        KEYS.MAESTRO_MESSAGES,
        KEYS.MAESTRO_VIEW,
        KEYS.MAESTRO_ACTIVITY,
        KEYS.USER_ID,
    ].forEach(remove);
}

const storage = { KEYS, get, getJSON, set, remove, clearAll, clearSession };
export default storage;
