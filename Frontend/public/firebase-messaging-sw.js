// firebase-messaging-sw.js
importScripts(
    "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyAXhaW-QWiS0BFCA98D2GFRGVYeN-49oi0",
    authDomain: "admin-dashboard-developm-52d55.firebaseapp.com",
    projectId: "admin-dashboard-developm-52d55",
    storageBucket: "admin-dashboard-developm-52d55.firebasestorage.app",
    messagingSenderId: "391896785450",
    appId: "1:391896785450:web:2ca3967c718dd216b91953",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification || {};
    self.registration.showNotification(title, {
        body,
        icon: icon || "/favicon.ico",
        data: payload.data,
    });
});