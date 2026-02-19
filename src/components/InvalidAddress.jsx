import React from 'react';
import { motion } from 'framer-motion';
import '../styles/InvalidAddress.css';

const InvalidAddress = () => {
    return (
        <div className="invalid-address-container">
            <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src="/logo-menux.svg"
                alt="Menux Logo"
                className="invalid-logo"
            />
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="invalid-title"
            >
                O endereço que está a tentar acessar não é o de um cardápio Menux válido!
            </motion.h1>
        </div>
    );
};

export default InvalidAddress;
