import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import otpService from '../services/otpService';
import { useToast } from '../context/ToastContext';

const imgLogo = "/logo-menux.svg";

export default function Register({ onBack, onNext, phone }) {
    const [name, setName] = useState('');
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleNextStep = async () => {
        setIsLoading(true);

        try {
            // Remove formatting
            const phoneStr = phone || '';
            const rawPhone = phoneStr.replace(/[^\d]/g, '');

            if (!rawPhone) {
                console.error("Phone number missing in Register");
                showToast("Erro: Número de telefone não encontrado.");
                return;
            }

            const result = await otpService.solicitarCodigo(rawPhone, name, '+55');
            if (result.success) {
                onNext(name);
            } else {
                showToast(result.error || "Erro ao solicitar código. Tente novamente.");
            }
        } catch (error) {
            console.error(error);
            showToast("Erro inesperado. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="onboarding-container"
        >
            <header className="header-nav">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={24} />
                </button>
                <img src={imgLogo} alt="Menux" className="header-logo" />
            </header>

            <div className="content-wrapper">
                <h1 className="title-large">Como podemos{"\n"}te chamar?</h1>
                <p className="description-text">
                    É só o primeiro nome. Assim a experiência fica mais próxima.
                </p>

                <div className="phone-input-group">
                    <input
                        type="text"
                        placeholder="Seu nome"
                        className="phone-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <div className="action-buttons">
                <motion.button
                    whileTap={name.trim().length >= 2 ? { scale: 0.96 } : {}}
                    className="btn-primary"
                    onClick={handleNextStep}
                    disabled={name.trim().length < 2 || isLoading}
                >
                    {isLoading ? "Enviando..." : "Continuar"}
                </motion.button>
            </div>
        </motion.div>
    );
}
