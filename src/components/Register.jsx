import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const imgLogo = "/logo-menux.svg";

export default function Register({ onBack, onNext }) {
    const [name, setName] = useState('');

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
                    onClick={() => onNext(name)}
                    disabled={name.trim().length < 2}
                >
                    Continuar
                </motion.button>
            </div>
        </motion.div>
    );
}
