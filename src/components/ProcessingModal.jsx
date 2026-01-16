import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const steps = [
    {
        title: "Estamos validando o seu Pedido.",
        subtitle: "Pense na sobremesa enquanto estamos validando o seu pedido."
    },
    {
        title: "Vamos te enviar um código para você mostrar ao garçom.",
        subtitle: "Você vai precisar chamar ele, o garçom vai anotar o código e seu pedido irá para produção."
    },
    {
        title: "Pedido validado!",
        subtitle: "Pronto, agora você já pode chamar o garçom!"
    }
];

export default function ProcessingModal() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Sync with the 6000ms timeout in MenuHub
        const t1 = setTimeout(() => setCurrentStep(1), 2000);
        const t2 = setTimeout(() => setCurrentStep(2), 4000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <motion.div
            className="processing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <img src="/icon-menux.svg" alt="Menux" className="processing-logo-img" />
            <div className="processing-content-wrapper">
                <div className="processing-logo-container">
                    {/* Logo removed from here as per user change */}
                </div>
                <div className="processing-text-area">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="processing-step-title">{steps[currentStep].title}</h2>
                            <p className="processing-step-subtitle">{steps[currentStep].subtitle}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="processing-progress-track">
                    <motion.div
                        className="processing-progress-fill"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
