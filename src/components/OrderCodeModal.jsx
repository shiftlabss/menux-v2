import { motion } from 'framer-motion';

export default function OrderCodeModal({ code, onViewOrders }) {
    // Split code into array of characters, handle number or string
    const codeChars = String(code).split('');

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
                    <div className="order-code-digits">
                        {codeChars.map((char, i) => (
                            <div key={i} className="order-code-digit-box">{char}</div>
                        ))}
                    </div>

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
