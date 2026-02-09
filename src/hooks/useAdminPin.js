import { useRef } from 'react';
import { CONFIG } from '../config';

export default function useAdminPin({ onSuccess, showToast }) {
    const pressTimer = useRef(null);
    const pinAttemptsRef = useRef(0);
    const pinLockedUntilRef = useRef(0);

    const onLongPressStart = () => {
        pressTimer.current = setTimeout(() => {
            const now = Date.now();

            // Check lockout
            if (pinLockedUntilRef.current > now) {
                const secondsLeft = Math.ceil((pinLockedUntilRef.current - now) / 1000);
                showToast(`Acesso bloqueado. Tente novamente em ${secondsLeft}s.`, 'error');
                return;
            }

            const pin = window.prompt("Digite o PIN de acesso:");
            if (pin === null) return; // User cancelled

            if (pin === CONFIG.STUDIO_PIN) {
                pinAttemptsRef.current = 0;
                onSuccess();
            } else {
                pinAttemptsRef.current += 1;
                const remaining = 3 - pinAttemptsRef.current;

                if (remaining <= 0) {
                    pinLockedUntilRef.current = Date.now() + 60000;
                    pinAttemptsRef.current = 0;
                    showToast("PIN incorreto 3 vezes. Bloqueado por 60 segundos.", 'error');
                } else {
                    showToast(`PIN incorreto. ${remaining} tentativa${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`, 'warning');
                }
            }
        }, 800);
    };

    const onLongPressEnd = () => clearTimeout(pressTimer.current);

    return { onLongPressStart, onLongPressEnd };
}
