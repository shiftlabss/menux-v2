import { motion } from 'framer-motion';

export default function OrderCodeModal({ code, onReset }) {
    return (
        <motion.div
            className="order-code-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
        >
            <div className="order-code-container">
                <img src="/logo-menux.svg" alt="Menux" className="order-code-logo" />
                <div className="order-code-display">{code}</div>
                <p className="order-code-desc">Este é o número do seu pedido. Acompanhe pelo painel.</p>
            </div>

            <div className="order-code-btn-container">
                <button className="btn-back-menu" onClick={onReset}>
                    Voltar ao menu
                </button>
            </div>
        </motion.div>
    );
}
