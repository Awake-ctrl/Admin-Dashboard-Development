// firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAXhaW-QWiS0BFCA98D2GFRGVYeN-49oi0",
  authDomain: "admin-dashboard-developm-52d55.firebaseapp.com",
  projectId: "admin-dashboard-developm-52d55",
  storageBucket: "admin-dashboard-developm-52d55.firebasestorage.app",
  messagingSenderId: "391896785450",
  appId: "1:391896785450:web:2ca3967c718dd216b91953"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Request user permission & FCM token
export async function requestAndGetToken(vapidKey: string) {
  try {
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (err) {
    console.error("Failed to get token:", err);
    return null;
  }
}

export function listenForMessages(callback: (payload: any) => void) {
  onMessage(messaging, callback);
}
