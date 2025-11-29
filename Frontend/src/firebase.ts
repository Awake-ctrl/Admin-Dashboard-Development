// firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "BN3-3LlIsx3dTC-hGXJISCIoaKDbr1bRulu9ZWkbHmwI_UyXTt8q9XH6Ti2YjLJnx3hJCrtSXhVpWnJ-atuzQhg",
  authDomain: "admin-dashboard-developm-52d55.firebaseapp.com",
  projectId: "admin-dashboard-developm-52d55",
  storageBucket: "admin-dashboard-developm-52d55.appspot.com",
  messagingSenderId: "391896785450",
  appId: "1:391896785450:web:xxxxxxxxxx"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export async function requestAndGetToken(vapidKey: string) {
  try {
    const currentToken = await getToken(messaging, { vapidKey });
    return currentToken; // string or null
  } catch (err) {
    console.error("Failed to get token", err);
    return null;
  }
}

// in-app message handler
export function listenForMessages(callback: (payload: any) => void) {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
}
