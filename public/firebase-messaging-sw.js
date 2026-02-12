importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyApZn3w6X0UNPJ4j_1PwEmPpR8Ri6IHpY8",
    authDomain: "fitzy-e12a2.firebaseapp.com",
    projectId: "fitzy-e12a2",
    storageBucket: "fitzy-e12a2.appspot.com",
    messagingSenderId: "132088066105",
    appId: "1:132088066105:web:7b9aadef750a0bdc82dde8"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo-menux.svg'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
