import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import otpService from '../services/otpService';
import { useToast } from '../context/ToastContext';

const imgLogo = "/logo-menux.svg";

export default function Verification({ phone, userName, onBack, onChangePhone, onFinish, isReturningUser }) {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Mover para o próximo campo
        if (value !== '' && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Voltar para o campo anterior se apagar
        if (e.key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleVerifyParams = async () => {
        setIsLoading(true);
        const codeString = code.join('');
        // Remove formatting to send raw numbers
        const rawPhone = phone.replace(/[^\d]/g, '');

        try {
            // Updated to pass phone number and default DDI
            const result = await otpService.verificarCodigo(codeString, rawPhone, '+55');

            if (result.success) {
                showToast("Código verificado com sucesso!");
                onFinish();
            } else {
                showToast(result.message || "Código incorreto.", 'error');
                // Limpar código para retentar? Opcional
                setCode(['', '', '', '']);
                inputRefs[0].current.focus();
            }
        } catch (error) {
            showToast("Erro na verificação.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        // Remove phone formatting
        const rawPhone = phone.replace(/[^\d]/g, '');
        setIsLoading(true);

        try {
            const result = await otpService.reenviarCodigo(rawPhone, userName || '', '+55');
            if (result.success) {
                showToast("Código reenviado!");
                setTimer(30);
            } else {
                showToast("Erro ao reenviar código.", 'error');
            }
        } catch (error) {
            showToast("Erro ao processar solicitação.", 'error');
        } finally {
            setIsLoading(false);
        }
    }

    const maskPhone = (phoneStr) => {
        if (!phoneStr) return '(00) 00000-0000';
        if (!isReturningUser) return phoneStr;

        // Máscara para usuário antigo: (XX) X****-XXXX
        // Mantém os 2 dígitos do DDD e os 4 últimos
        const numbers = phoneStr.replace(/[^\d]/g, '');
        if (numbers.length < 10) return phoneStr;

        const ddd = numbers.slice(0, 2);
        const lastFour = numbers.slice(-4);
        const firstDigit = numbers.length === 11 ? numbers.slice(2, 3) : '';

        return `(${ddd}) ${firstDigit}****-${lastFour}`;
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
                <h1 className="title-large">Digite o código{"\n"}de verificação</h1>
                <p className="description-text">
                    Enviamos um código de 4 dígitos{"\n"}para confirmar que é você.
                </p>

                <div className="otp-group">
                    {code.map((digit, i) => (
                        <input
                            key={i}
                            ref={inputRefs[i]}
                            type="tel"
                            maxLength={1}
                            className="otp-input"
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            autoFocus={i === 0}
                        />
                    ))}
                </div>

                <p className="small-helper">Enviamos para {maskPhone(phone)}</p>

                <div className="resend-section">
                    <button
                        className={timer > 0 ? "btn-disabled" : "btn-resend-active"}
                        disabled={timer > 0 || isLoading}
                        onClick={handleResend}
                    >
                        {timer > 0 ? `Reenviar código em ${timer}s` : "Reenviar código"}
                    </button>
                    {!isReturningUser && (
                        <button className="btn-outline" onClick={onChangePhone}>Mudar o número</button>
                    )}
                </div>
            </div>

            <div className="action-buttons">
                <motion.button
                    whileTap={code.every(digit => digit !== '') ? { scale: 0.96 } : {}}
                    className="btn-primary"
                    onClick={handleVerifyParams}
                    disabled={!code.every(digit => digit !== '') || isLoading}
                >
                    {isReturningUser ? 'Entrar na minha conta' : 'Finalizar cadastro'}
                </motion.button>
            </div>
        </motion.div>
    );
}
