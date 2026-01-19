import { motion } from 'framer-motion';
import { useState } from 'react';

export default function OrderCodeModal({ code, onViewOrders }) {
    const [copied, setCopied] = useState(false);
    // Split code into array of characters, handle number or string
    const codeChars = String(code).padStart(4, '0').split('');

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(String(code));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback silencioso
        }
    };

    return (
        <motion.div
            className="order-code-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="order-code-content-wrapper">
                <div className="order-code-header">
                    <img src="/icon-menux.svg" alt="Menux" className="order-code-icon" />
                    <h2 className="order-code-title">Seu pedido precisa de <br />uma confirmação agora!</h2>
                </div>

                <div className="order-code-info-card">
                    <div className="order-code-digits" onClick={handleCopyCode} role="button" aria-label="Copiar código">
                        {codeChars.map((char, i) => (
                            <div key={i} className="order-code-digit-box">{char}</div>
                        ))}
                    </div>
                    <span className="order-code-copy-hint">
                        {copied ? 'Copiado!' : 'Toque para copiar'}
                    </span>

                    <div className="order-code-instructions">
                        <h3 className="order-instructions-title">O que você precisa fazer agora?</h3>
                        <p className="order-instructions-desc">
                            Ao mostrar este código ao garçom, seu pedido será anotado e o preparo começará.
                        </p>
                    </div>
                </div>
            </div>

            <div className="order-code-footer">
                <button className="btn-view-orders" onClick={onViewOrders}>
                    Ver meus Pedidos
                </button>
            </div>
        </motion.div>
    );
}
