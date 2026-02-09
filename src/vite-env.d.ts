/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEBHOOK_OTP: string;
    readonly VITE_WEBHOOK_VERIFY_OTP: string;
    readonly VITE_WEBHOOK_MAESTRO: string;
    readonly VITE_STUDIO_PIN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
