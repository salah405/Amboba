// ✅ استيراد الأدوات
import { db } from "./firebase.js";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⚠️ مؤقت (لحد ما نعمل Login)
const DRIVER_ID = "PUT_DRIVER_ID_HERE";

// ==========================
// 📦 تحميل الطلبات
// ==========================
function loadDriverOrders() {

  const q = query(
    collection(db, "orders"),
    where("driverId", "==", DRIVER_ID)
  );

  onSnapshot(q, (snap) => {
    let html = "";

    snap.forEach((docSnap) => {
      let o = docSnap.data();

      html += `
        <div class="card">
          <strong>${o.name}</strong>
          <div>${o.location || ''}</div>

          <div class="status ${o.status}">
            ${o.status}
          </div>

          ${
            o.location && o.location.lat
              ? `<a target="_blank" href="https://maps.google.com?q=${o.location.lat},${o.location.lng}">📍 موقع</a>`
              : ""
          }

          <button onclick="updateStatus('${docSnap.id}', 'delivering')">بدء</button>
          <button onclick="updateStatus('${docSnap.id}', 'done')">تم</button>
        </div>
      `;
    });

    orders.innerHTML = html;
  });
}

// ==========================
// 🔄 تحديث الحالة
// ==========================
window.updateStatus = async function (id, status) {

  const orderRef = doc(db, "orders", id);

  await updateDoc(orderRef, {
    status: status,
    updates: arrayUnion({
      status: status,
      time: Date.now()
    })
  });
};

// تشغيل أول مرة
loadDriverOrders();
