// test
export interface AppConfig {
    WEBHOOK_OTP: string;
    WEBHOOK_VERIFY_OTP: string;
    WEBHOOK_MAESTRO: string;
    STUDIO_PIN: string;
}

export const CONFIG: AppConfig = {
    WEBHOOK_OTP: import.meta.env.VITE_WEBHOOK_OTP,
    WEBHOOK_VERIFY_OTP: import.meta.env.VITE_WEBHOOK_VERIFY_OTP,
    WEBHOOK_MAESTRO: import.meta.env.VITE_WEBHOOK_MAESTRO,
    STUDIO_PIN: import.meta.env.VITE_STUDIO_PIN
};
