import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import otpService from '../services/otpService';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { useUser } from '../context/UserContext';

const imgLogo = "/logo-menux.svg";

export default function Login({ onBack, onNext, checkUser, savedName }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [rawDigits, setRawDigits] = useState(''); // Store raw digits separately
    const { restaurantId } = useUser();

    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        // Remove all non-digits
        const phone = value.replace(/[^\d]/g, '');
        const phoneLength = phone.length;

        // Format based on length
        if (phoneLength < 3) return phone;
        if (phoneLength < 7) {
            return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
        }
        return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
    };

    const handlePhoneChange = (e) => {
        // Extract only digits from paste or input
        const digitsOnly = e.target.value.replace(/[^\d]/g, '');
        setRawDigits(digitsOnly);
        setPhoneNumber(formatPhoneNumber(digitsOnly));
    };

    const handleKeyDown = (e) => {
        // Handle backspace specially to avoid getting stuck on formatting characters
        if (e.key === 'Backspace') {
            const selection = e.target.selectionStart;
            const value = e.target.value;

            // Only handle if cursor is at the end (most common case)
            if (selection === value.length && rawDigits.length > 0) {
                e.preventDefault();
                const newDigits = rawDigits.slice(0, -1);
                setRawDigits(newDigits);
                setPhoneNumber(formatPhoneNumber(newDigits));
            }
        }
    };

    const handleNextStep = async () => {
        setIsLoading(true);
        // Remove formatting to send raw numbers
        const rawPhone = phoneNumber.replace(/[^\d]/g, '');

        try {
            // Check if user exists (logic passed from parent)
            const userExists = checkUser ? checkUser(phoneNumber) : false;

            if (userExists) {
                // Existing user: Send OTP (no name needed)
                const result = await otpService.solicitarCodigo(rawPhone, '', '+55');
                if (result.success) {
                    onNext(phoneNumber);
                } else {
                    showToast(result.error || "Erro ao enviar código. Tente novamente.", 'error');
                }
            } else {
                // New user
                if (savedName && savedName.trim() !== '') {
                    // If we have a saved name (e.g. from previous attempt), send OTP now!
                    const result = await otpService.solicitarCodigo(rawPhone, savedName, '+55');
                    if (result.success) {
                        onNext(phoneNumber);
                    } else {
                        showToast(result.error || "Erro ao enviar código.", 'error');
                    }
                } else {
                    // No name saved, go to Register screen (skip OTP here)
                    onNext(phoneNumber);
                }
            }
        } catch (error) {
            showToast("Erro inesperado. Tente novamente.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
            const fullPhone = `55${cleanPhone}`;



            // const { restaurantId } = useUser(); // Moved to top level

            if (!restaurantId) {
                alert("ID do restaurante não encontrado. Tente recarregar a página.");
                return;
            }

            const response = await authService.loginOrRegister({
                phone: fullPhone,
                restaurantId
            });

            if (response && response.token) {
                const { customer } = response;
                onNext(fullPhone, customer);
            } else {
                alert("Falha na autenticação. Tente novamente.");
            }

        } catch (error) {
            console.error("Login call failed", error);
            alert("Erro ao conectar ao servidor.");
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
                        onKeyDown={handleKeyDown}
                        maxLength={15}
                        autoFocus
                        disabled={isLoading}
                    />
                </div>
                <span className="helper-text">Só para verificação. Sem spam.</span>
            </div>

            <div className="action-buttons">
                <motion.button
                    whileTap={rawDigits.length === 11 ? { scale: 0.96 } : {}}
                    className="btn-primary"
                    onClick={handleLogin}
                    disabled={phoneNumber.length !== 15 || isLoading}
                >
                    {isLoading ? "Verificando..." : "Finalizar cadastro"}
                </motion.button>
            </div>
        </motion.div>
    );
}
