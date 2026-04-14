// ✅ استيراد الدوال من firebase.js
import { getOrders, assignDriver } from "./firebase.js";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

// ==========================
// 🚀 تحميل كل البيانات
// ==========================
loadAll();

function loadAll() {
  loadPrices();
  loadDrivers();
  loadOrders();
}

// ==========================
// 💰 PRICES
// ==========================
window.savePrices = async function () {
  await updateDoc(doc(db, "settings", "prices"), {
    gas: +gasPrice.value,
    delivery: +deliveryPrice.value
  });
};

function loadPrices() {
  onSnapshot(doc(db, "settings", "prices"), (docSnap) => {
    if (docSnap.exists()) {
      let d = docSnap.data();
      gasPrice.value = d.gas;
      deliveryPrice.value = d.delivery;
    }
  });
}

// ==========================
// 🛵 DRIVERS
// ==========================
window.addDriver = async function () {
  await addDoc(collection(db, "drivers"), {
    name: dName.value,
    phone: dPhone.value,
    area: dArea.value,
    active: true
  });
};

function loadDrivers() {
  onSnapshot(collection(db, "drivers"), (snap) => {
    let html = "";

    snap.forEach((docSnap) => {
      let d = docSnap.data();

      html += `
        <div class="card">
          ${d.name} (${d.area})
          <button onclick="toggleDriver('${docSnap.id}', ${d.active})">
            ${d.active ? 'إيقاف' : 'تفعيل'}
          </button>
          <button onclick="deleteDriver('${docSnap.id}')">حذف</button>
        </div>
      `;
    });

    drivers.innerHTML = html;
  });
}

window.toggleDriver = async function (id, active) {
  await updateDoc(doc(db, "drivers", id), {
    active: !active
  });
};

window.deleteDriver = async function (id) {
  await deleteDoc(doc(db, "drivers", id));
};

// ==========================
// 📦 ORDERS
// ==========================
async function loadOrders() {

  // تحميل المندوبين مرة واحدة
  const driversSnap = await getDocs(collection(db, "drivers"));

  let options = "";
  driversSnap.forEach((d) => {
    if (d.data().active) {
      options += `<option value="${d.id}">${d.data().name}</option>`;
    }
  });

  // متابعة الطلبات Live
  onSnapshot(collection(db, "orders"), (snap) => {
    let html = "";

    snap.forEach((docSnap) => {
      let o = docSnap.data();

      html += `
        <div class="card">
          <strong>${o.name}</strong>
          <div>${o.location || ''}</div>

          <select onchange="assignOrder('${docSnap.id}', this.value)">
            <option value="">اختار مندوب</option>
            ${options}
          </select>

          <div class="status ${o.status}">
            ${o.status}
          </div>
        </div>
      `;
    });

    orders.innerHTML = html;
  });
}

window.assignOrder = async function (id, driverId) {
  if (!driverId) return;

  await assignDriver(id, driverId);
};

// ==========================
// 📤 EXPORT
// ==========================
window.exportData = async function () {
  const snap = await getDocs(collection(db, "orders"));

  let csv = "";

  snap.forEach((docSnap) => {
    let o = docSnap.data();
    csv += `${o.name},${o.phone},${o.status}\n`;
  });

  let blob = new Blob([csv]);
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "orders.csv";
  a.click();
};
