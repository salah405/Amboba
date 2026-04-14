import { auth } from "./firebase.js";
import { 
  signInAnonymously, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔐 تسجيل دخول بسيط (مؤقت)
export async function login() {
  await signInAnonymously(auth);
}

// 👤 متابعة حالة المستخدم
export function listenToAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
