import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { 
  getAuth 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCIVzmvQYzSAC_i8wWLvDr5j2BsgNQIXjU",
  authDomain: "amboba-a54b1.firebaseapp.com",
  projectId: "amboba-a54b1",
  storageBucket: "amboba-a54b1.firebasestorage.app",
  messagingSenderId: "218154851411",
  appId: "1:218154851411:web:6b57d5af156dbd3556baa6",
  measurementId: "G-WPMTFNM11B"
};

// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Services
const db = getFirestore(app);
const auth = getAuth(app);

// =========================
// 📦 Orders Functions
// =========================

// ➕ إضافة طلب جديد
export async function addOrder(orderData) {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "pending",
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding order:", error);
  }
}

// 📥 جلب كل الطلبات
export async function getOrders() {
  const snapshot = await getDocs(collection(db, "orders"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// 🚚 تعيين مندوب
export async function assignDriver(orderId, driverId) {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    driverId: driverId,
    status: "assigned"
  });
}

// 🛵 طلبات المندوب
export async function getDriverOrders(driverId) {
  const q = query(
    collection(db, "orders"),
    where("driverId", "==", driverId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// =========================
// 👤 Auth (مبدئي)
// =========================
export { db };
export { auth };
export async function getInstapayInfo() {
  const docRef = doc(db, "settings", "payment");
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
      }
