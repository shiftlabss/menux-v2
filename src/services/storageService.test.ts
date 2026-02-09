import { describe, it, expect, beforeEach } from 'vitest';
import storage, { KEYS } from './storageService';

beforeEach(() => {
    localStorage.clear();
});

describe('storageService', () => {
    it('get/set strings', () => {
        storage.set(KEYS.PHONE, '11999999999');
        expect(storage.get(KEYS.PHONE)).toBe('11999999999');
    });

    it('set/getJSON objects', () => {
        const data = { name: 'Test', color: '#000' };
        storage.set(KEYS.STUDIO_BRANDING, data);
        expect(storage.getJSON(KEYS.STUDIO_BRANDING)).toEqual(data);
    });

    it('getJSON returns fallback on missing key', () => {
        expect(storage.getJSON('nonexistent', [])).toEqual([]);
    });

    it('getJSON returns null by default on missing key', () => {
        expect(storage.getJSON('nonexistent')).toBeNull();
    });

    it('remove deletes key', () => {
        storage.set(KEYS.USER, 'João');
        storage.remove(KEYS.USER);
        expect(storage.get(KEYS.USER)).toBeNull();
    });

    it('clearSession removes user keys but keeps studio', () => {
        storage.set(KEYS.USER, 'João');
        storage.set(KEYS.PHONE, '11999999999');
        storage.set(KEYS.STUDIO_BRANDING, { name: 'Test' });

        storage.clearSession();

        expect(storage.get(KEYS.USER)).toBeNull();
        expect(storage.get(KEYS.PHONE)).toBeNull();
        expect(storage.getJSON(KEYS.STUDIO_BRANDING)).toEqual({ name: 'Test' });
    });

    it('clearAll removes all menux_ and maestro_ keys', () => {
        storage.set(KEYS.USER, 'João');
        storage.set(KEYS.STUDIO_BRANDING, { name: 'Test' });
        storage.set(KEYS.MAESTRO_MESSAGES, []);

        storage.clearAll();

        expect(storage.get(KEYS.USER)).toBeNull();
        expect(storage.getJSON(KEYS.STUDIO_BRANDING)).toBeNull();
        expect(storage.getJSON(KEYS.MAESTRO_MESSAGES)).toBeNull();
    });

    it('KEYS has all expected keys', () => {
        expect(KEYS.PHONE).toBe('menux_phone');
        expect(KEYS.MAESTRO_MESSAGES).toBe('maestro_messages');
        expect(KEYS.STUDIO_PRODUCTS).toBe('menux_studio_products');
    });
});
