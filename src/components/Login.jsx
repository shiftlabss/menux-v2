import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const imgLogo = "/logo-menux.svg";

export default function Login({ onBack, onNext }) {
    const [phoneNumber, setPhoneNumber] = useState('');

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 3) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
        }
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    const handlePhoneChange = (e) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        setPhoneNumber(formattedValue);
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
                    onClick={() => onNext(phoneNumber)}
                    disabled={phoneNumber.length !== 15}
                >
                    Finalizar cadastro
                </motion.button>
            </div>
        </motion.div>
    );
}
