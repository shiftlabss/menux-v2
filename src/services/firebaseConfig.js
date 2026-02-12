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
const messaging = getMessaging(app);

export const requestForToken = async () => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: 'BFDhaBjfZEtMAdlKymSYUljNNK7ObyDmWZCCiwabJturz77YuW9qA185uu4fZFmyP4mERwW78c0ehu0QT2XmoBk',
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
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

export { messaging };
