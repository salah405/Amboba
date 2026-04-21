// ==========================
// 🔥 IMPORTS
// ==========================
import { addOrder } from "./firebase.js";

// ==========================
// 🚀 Service Worker
// ==========================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// ==========================
// 💬 رسائل
// ==========================
function showMessage(text, type = 'info') {
  let msg = document.getElementById('message');

  msg.textContent = text;
  msg.className = `message ${type}`;
  msg.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => msg.style.display = 'none', 3000);
  }
}

// ==========================
// 🔢 Order ID
// ==========================
function generateOrderId() {
  return 'DF' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ==========================
// 📍 LOCATION
// ==========================
window.getCurrentLocation = function () {

  const status = document.getElementById("locationStatus");

  if (!navigator.geolocation) {
    status.innerText = "❌ جهازك لا يدعم تحديد الموقع";
    return;
  }

  status.innerText = "⏳ جاري تحديد الموقع...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      document.getElementById("customerLat").value = lat;
      document.getElementById("customerLng").value = lng;

      status.innerText = "✅ تم تحديد الموقع بنجاح";
    },
    () => {
      status.innerText = "❌ فشل تحديد الموقع";
    }
  );
};

// ==========================
// 💰 تحديث السعر
// ==========================
function updateTotal() {
  const gas = parseFloat(document.getElementById("gasPrice").innerText);
  const delivery = parseFloat(document.getElementById("deliveryPrice").innerText);

  document.getElementById("totalPrice").innerText = gas + delivery;
}

updateTotal();

// ==========================
// 📦 إرسال الطلب
// ==========================
window.submitOrder = async function () {

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const area = document.getElementById("customerArea").value.trim();
  const lat = document.getElementById("customerLat").value;
  const lng = document.getElementById("customerLng").value;

  // ✅ تحقق صحيح
  if (!name || !phone || !address || !area) {
    showMessage("❌ من فضلك ادخل جميع البيانات", "error");
    return;
  }

  const orderData = {
    orderId: generateOrderId(),
    name,
    phone,
    address,
    area,
    location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null
  };

  try {
    await addOrder(orderData);

    showMessage("✅ تم إرسال الطلب بنجاح", "success");

    // 🧹 Reset
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";
    document.getElementById("customerArea").value = "";
    document.getElementById("customerLat").value = "";
    document.getElementById("customerLng").value = "";
    document.getElementById("locationStatus").innerText = "لم يتم تحديد الموقع";

  } catch (err) {
    console.error(err);
    showMessage("❌ حصل خطأ حاول مرة أخرى", "error");
  }
};
