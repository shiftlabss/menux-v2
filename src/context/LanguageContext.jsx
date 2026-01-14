import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('pt'); // Default fallback

    useEffect(() => {
        const detectLanguage = () => {
            // 1. Check persistence
            const savedLang = localStorage.getItem('menux_lang');
            if (savedLang && translations[savedLang]) {
                return savedLang;
            }

            // 2. Check Device Language
            const navLang = navigator.language || navigator.userLanguage;
            const langCode = navLang.split('-')[0].toLowerCase();
            if (translations[langCode]) {
                return langCode;
            }

            // 3. Fallback: Region/Timezone
            try {
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (timeZone) {
                    if (timeZone.startsWith('America/Sao_Paulo') || timeZone.startsWith('America/Recife') || timeZone.includes('Brazil')) {
                        return 'pt';
                    }
                    if (timeZone.startsWith('Europe/Madrid') || timeZone.startsWith('America/Mexico_City') || timeZone.startsWith('America/Argentina')) {
                        return 'es';
                    }
                    if (timeZone.startsWith('America/New_York') || timeZone.startsWith('Europe/London')) {
                        return 'en';
                    }
                }
            } catch (e) {
                console.warn("Timezone detection failed", e);
            }

            // 4. Fallback Default (Restaurant logic could go here, defaulting to PT for now)
            return 'pt';
        };

        const detected = detectLanguage();
        setLanguage(detected);
    }, []);

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
            localStorage.setItem('menux_lang', lang);
        }
    };

    const t = (section, key) => {
        if (!translations[language]) return key;
        if (!translations[language][section]) return key;
        return translations[language][section][key] || key;
    };

    // Helper to translate arbitrary text if it matches a dictionary key
    // This is useful for dynamic data like categories where we might have the key in our locales
    const tData = (section, key) => {
        if (!key) return key;
        const lowerKey = key.toLowerCase();
        // Try to find a match in the data section
        if (translations[language]?.data?.[section] && translations[language].data[section][lowerKey]) {
            return translations[language].data[section][lowerKey];
        }
        // Fallback for exact matches if keys are not lowercased in translation file
        if (translations[language]?.data?.[section] && translations[language].data[section][key]) {
            return translations[language].data[section][key];
        }
        return key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, tData }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
