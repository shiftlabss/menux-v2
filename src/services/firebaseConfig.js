import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyApZn3w6X0UNPJ4j_1PwEmPpR8Ri6IHpY8",
    authDomain: "fitzy-e12a2.firebaseapp.com", // Inferido do projectId
    projectId: "fitzy-e12a2",
    storageBucket: "fitzy-e12a2.appspot.com", // Inferido
    messagingSenderId: "132088066105",
    appId: "1:132088066105:web:7b9aadef750a0bdc82dde8"
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
        const currentToken = await getToken(msg, {
            vapidKey: 'BFDhaBjfZEtMAdlKymSYUljNNK7ObyDmWZCCiwabJturz77YuW9qA185uu4fZFmyP4mERwW78c0ehu0QT2XmoBk'
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

