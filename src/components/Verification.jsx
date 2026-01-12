import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const imgLogo = "/logo-menux.svg";

export default function Verification({ phone, onBack, onChangePhone, onFinish, isReturningUser }) {
    const [timer, setTimer] = useState(30);
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

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
                        disabled={timer > 0}
                        onClick={() => timer === 0 && setTimer(30)}
                    >
                        {timer > 0 ? `Re-enviar código em ${timer}s` : "Re-enviar código"}
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
                    onClick={onFinish}
                    disabled={!code.every(digit => digit !== '')}
                >
                    {isReturningUser ? 'Entrar na minha conta' : 'Finalizar cadastro'}
                </motion.button>
            </div>
        </motion.div>
    );
}
