// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "BN3-3LlIsx3dTC-hGXJISCIoaKDbr1bRulu9ZWkbHmwI_UyXTt8q9XH6Ti2YjLJnx3hJCrtSXhVpWnJ-atuzQhg",
    authDomain: "admin-dashboard-developm-52d55.firebaseapp.com",
    projectId: "admin-dashboard-developm-52d55",
    // storageBucket: "admin-dashboard-developm-52d55.appspot.com",
    messagingSenderId: "391896785450",
    appId: "1:391896785450:web:xxxxxxxxxx"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    const { title, body, icon } = payload.notification || {};
    const options = {
        body: body,
        icon: icon || "/favicon.ico",
        data: payload.data
    };
    self.registration.showNotification(title, options);
});



//json