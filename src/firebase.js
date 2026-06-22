import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANYtP5XWi9Wit5Qf_E9GBQrI2tafqHLLI",
  authDomain: "mech-corner.firebaseapp.com",
  projectId: "mech-corner",
  storageBucket: "mech-corner.firebasestorage.app",
  messagingSenderId: "755202984974",
  appId: "1:755202984974:web:009283fa090da79b62c05f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
