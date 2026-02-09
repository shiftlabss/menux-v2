/**
 * Geração centralizada de IDs únicos para o Menux.
 * Usa timestamp + contador atômico para evitar colisões.
 */
let _counter = 0;

/** ID genérico para entidades (produtos, categorias, etc.) */
export const generateId = (): string => `${Date.now()}-${++_counter}`;

/** ID curto para pedidos: #ABC12 */
export const generateOrderCode = (): string => {
    const ts = Date.now().toString(36).slice(-3).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 4).toUpperCase();
    return `#${ts}${rand}`;
};

/** ID para mensagens de chat (numérico crescente) */
export const generateMsgId = (): number => Date.now() + (++_counter);
