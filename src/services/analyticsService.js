import { api } from './api';

const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 segundos
const MAX_RETRIES = 3;

class AnalyticsService {
    constructor() {
        this.buffer = [];
        this.timer = null;
        this.sessionId = this.getOrCreateSessionId();
    }

    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('menux_analytics_session');
        if (!sessionId) {
            sessionId = this.generateUUID();
            localStorage.setItem('menux_analytics_session', sessionId);
        }
        return sessionId;
    }

    generateUUID() {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    track(eventType, meta = {}) {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            ...meta
        };

        this.buffer.push(event);

        if (this.buffer.length >= BATCH_SIZE) {
            this.flush();
        } else if (!this.timer) {
            this.startTimer();
        }
    }

    startTimer() {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.flush(), FLUSH_INTERVAL);
    }

    async flush() {
        if (this.buffer.length === 0) return;

        const eventsToSend = [...this.buffer];
        this.buffer = []; // Limpa o buffer imediatamente para evitar duplicatas em caso de novas tracks
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        this.sendWithRetry(eventsToSend);
    }

    async sendWithRetry(events, attempt = 1) {
        try {
            await api.post('/analytics/events', { events });
            // Sucesso (Status 200-299 handled by axios or standard flow)
            // Não fazemos nada, apenas "esquece"
        } catch (error) {
            if (attempt < MAX_RETRIES) {
                // Backoff exponencial simples: 1s, 2s, 4s...
                const delay = 1000 * Math.pow(2, attempt - 1);
                setTimeout(() => this.sendWithRetry(events, attempt + 1), delay);
            } else {
                console.warn("Analytics: Falha ao enviar eventos após 3 tentativas. Descartando.", events.length);
            }
        }
    }
}

export const analytics = new AnalyticsService();
