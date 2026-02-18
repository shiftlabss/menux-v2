import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

let messaging = null;
let messagingResolve;
const messagingInitialized = new Promise(resolve => {
    messagingResolve = resolve;
});

const initMessaging = async () => {
    try {
        const { isSupported } = await import('firebase/messaging');
        if (typeof window !== 'undefined' && await isSupported()) {
            messaging = getMessaging(app);
        }
    } catch (error) {
        console.error('Firebase Messaging failed to initialize:', error);
    } finally {
        messagingResolve(messaging);
    }
};

initMessaging();

export const requestForToken = async () => {
    const msg = await messagingInitialized;
    if (!msg) return null;
    try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_PUBLIC_KEY;
        if (!vapidKey || vapidKey.length < 50 || vapidKey.length > 200) {
            console.error('Invalid VAPID Key in environment variables. Please check VITE_FIREBASE_VAPID_PUBLIC_KEY.');
            return null;
        }

        const currentToken = await getToken(msg, {
            vapidKey: vapidKey
        });
        if (currentToken) {
            console.log('current token for client: ', currentToken);
            return currentToken;
        } else {
            console.log('No registration token available. Request permission to generate one.');
            return null;
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise(async (resolve) => {
        const msg = await messagingInitialized;
        if (msg) {
            onMessage(msg, (payload) => {
                resolve(payload);
            });
        }
    });

export { messaging };

