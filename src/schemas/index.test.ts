import { describe, it, expect } from 'vitest';
import {
    safeParseBranding,
    safeParseCategories,
    safeParseProducts,
    safeParseCart,
    safeParseOrders,
} from './index';

describe('safeParseBranding', () => {
    it('accepts valid branding', () => {
        const result = safeParseBranding({
            restName: 'Test',
            restBio: 'Bio',
            restCover: '',
            restLogo: '/logo.svg',
            brandColor: '#FF0000',
        });
        expect(result).not.toBeNull();
        expect(result?.restName).toBe('Test');
    });

    it('rejects invalid brandColor', () => {
        expect(safeParseBranding({ restName: 'Test', brandColor: 'red' })).toBeNull();
    });

    it('rejects missing restName', () => {
        expect(safeParseBranding({ restBio: 'test' })).toBeNull();
    });
});

describe('safeParseCategories', () => {
    it('accepts valid categories', () => {
        const result = safeParseCategories([
            { id: 'pizzas', name: 'Pizzas', subcategories: [{ id: 'sub1', name: 'Sub' }] },
        ]);
        expect(result).toHaveLength(1);
    });

    it('returns null for corrupted data', () => {
        expect(safeParseCategories([{ invalid: true }])).toBeNull();
    });

    it('returns null for non-array', () => {
        expect(safeParseCategories('not an array')).toBeNull();
    });
});

describe('safeParseProducts', () => {
    it('accepts valid products', () => {
        const result = safeParseProducts([
            { id: '123', name: 'Produto', desc: 'Desc', price: 'R$ 10,00' },
        ]);
        expect(result).toHaveLength(1);
    });

    it('accepts numeric IDs', () => {
        const result = safeParseProducts([{ id: 999, name: 'Wine' }]);
        expect(result).toHaveLength(1);
    });

    it('rejects missing name', () => {
        expect(safeParseProducts([{ id: '1' }])).toBeNull();
    });
});

describe('safeParseCart', () => {
    it('accepts valid cart items', () => {
        const result = safeParseCart([
            { id: '1', name: 'Item', price: 'R$ 10,00', qty: 2, obs: '' },
        ]);
        expect(result).toHaveLength(1);
        expect(result?.[0].qty).toBe(2);
    });

    it('rejects items with qty 0', () => {
        expect(safeParseCart([{ id: '1', name: 'Item', qty: 0 }])).toBeNull();
    });
});

describe('safeParseOrders', () => {
    it('accepts valid orders', () => {
        const result = safeParseOrders([{
            id: '#ABC12',
            time: 'Pedido hoje às 14:30',
            status: 'waiting',
            statusLabel: 'Aguardando',
            items: [{ id: '1', name: 'Item', price: 'R$ 10,00', qty: 1, obs: '' }],
            timestamp: Date.now(),
        }]);
        expect(result).toHaveLength(1);
    });

    it('rejects invalid status', () => {
        expect(safeParseOrders([{
            id: '#ABC12',
            time: 'test',
            status: 'invalid',
            statusLabel: 'test',
            items: [],
            timestamp: 0,
        }])).toBeNull();
    });
});
