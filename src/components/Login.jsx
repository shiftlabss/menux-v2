import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import otpService from '../services/otpService';
import { useToast } from '../context/ToastContext';

const imgLogo = "/logo-menux.svg";

export default function Login({ onBack, onNext, checkUser }) {
    const [phoneNumber, setPhoneNumber] = useState('');

    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phone = value.replace(/[^\d]/g, '');
        const phoneLength = phone.length;
        if (phoneLength < 3) return phone;
        if (phoneLength < 7) {
            return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
        }
        return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
    };

    const handlePhoneChange = (e) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        setPhoneNumber(formattedValue);
    };

    const handleNextStep = async () => {
        setIsLoading(true);
        // Remove formatting to send raw numbers
        const rawPhone = phoneNumber.replace(/[^\d]/g, '');

        try {
            // Check if user exists (logic passed from parent)
            // If checkUser is not provided, assume new user or safe default? 
            // Actually, let's assume parent provides it.
            // If exists -> Send OTP. 
            // If new -> Skip OTP (will send after name).

            // Note: We need to know if we should send OTP.
            // Using the checkUser prop which we will add.
            const userExists = checkUser ? checkUser(phoneNumber) : false;

            if (userExists) {
                const result = await otpService.solicitarCodigo(rawPhone);
                if (result.success) {
                    onNext(phoneNumber);
                } else {
                    showToast(result.error || "Erro ao enviar código. Tente novamente.");
                }
            } else {
                // New user - skip OTP, go to register
                onNext(phoneNumber);
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
                <h1 className="title-large">Qual é o seu{"\n"}telefone?</h1>
                <p className="description-text">
                    Usamos apenas para confirmar que é{"\n"}você. Não enviamos mensagens.
                </p>

                <div className="phone-input-group">
                    <div className="country-code">+55</div>
                    <input
                        type="tel"
                        placeholder="(00) 00000-0000"
                        className="phone-input"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        maxLength={15}
                        autoFocus
                    />
                </div>
                <span className="helper-text">Só para verificação. Sem spam.</span>
            </div>

            <div className="action-buttons">
                <motion.button
                    whileTap={phoneNumber.length === 15 ? { scale: 0.96 } : {}}
                    className="btn-primary"
                    onClick={handleNextStep}
                    disabled={phoneNumber.length !== 15 || isLoading}
                >
                    {isLoading ? "Enviando..." : "Continua"}
                </motion.button>
            </div>
        </motion.div>
    );
}
