import { motion } from 'framer-motion';

export default function ProcessingModal() {
    return (
        <motion.div
            className="processing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="processing-container">
                <img src="/logo-menux.svg" alt="Menux" className="processing-logo" />
                <h2 className="processing-title">Enviando seu pedido para a cozinha...</h2>
                <p className="processing-subtitle">Aguarde um instante, já vamos confirmar.</p>
            </div>
        </motion.div>
    );
}
