import { describe, it, expect } from 'vitest';
import { generateId, generateOrderCode, generateMsgId } from './generateId';

describe('generateId', () => {
    it('returns a string with timestamp and counter', () => {
        const id = generateId();
        expect(typeof id).toBe('string');
        expect(id).toMatch(/^\d+-\d+$/);
    });

    it('generates unique IDs on consecutive calls', () => {
        const ids = new Set(Array.from({ length: 100 }, () => generateId()));
        expect(ids.size).toBe(100);
    });
});

describe('generateOrderCode', () => {
    it('starts with #', () => {
        const code = generateOrderCode();
        expect(code.startsWith('#')).toBe(true);
    });

    it('has 6 characters total (#XXXXX)', () => {
        const code = generateOrderCode();
        expect(code.length).toBe(6);
    });

    it('contains only uppercase alphanumeric after #', () => {
        const code = generateOrderCode();
        expect(code.slice(1)).toMatch(/^[A-Z0-9]+$/);
    });
});

describe('generateMsgId', () => {
    it('returns a number', () => {
        expect(typeof generateMsgId()).toBe('number');
    });

    it('generates unique IDs on consecutive calls', () => {
        const ids = new Set(Array.from({ length: 100 }, () => generateMsgId()));
        expect(ids.size).toBe(100);
    });
});
