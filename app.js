// ✅ استيراد الدوال من firebase-config.js
import { addOrder } from "./firebase.js";

// ==========================
// 🚀 Service Worker (PWA)
// ==========================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('✅ SW registered'))
      .catch(err => console.log('❌ SW failed:', err));
  });
}

// ==========================
// 💬 رسائل للمستخدم
// ==========================
export function showMessage(text, type = 'info') {
  let msg = document.getElementById('message');

  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'message';
    document.body.appendChild(msg);
  }

  msg.textContent = text;
  msg.className = `message ${type}`;
  msg.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => msg.style.display = 'none', 4000);
  }
}

// ==========================
// 🔢 توليد رقم أوردر
// ==========================
function generateOrderId() {
  return 'DF' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ==========================
// 📦 إرسال طلب (هنربطه بالـ HTML)
// ==========================
window.submitOrder = async function () {
  const name = document.getElementById("name")?.value;
  const phone = document.getElementById("phone")?.value;
  const location = document.getElementById("location")?.value;

  if (!name || !phone || !location) {
    showMessage("من فضلك املى كل البيانات", "error");
    return;
  }

  const orderData = {
    orderId: generateOrderId(),
    name,
    phone,
    location
  };

  try {
    await addOrder(orderData);

    showMessage("✅ تم إرسال الطلب بنجاح", "success");

    // تفريغ الفورم
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("location").value = "";

  } catch (error) {
    console.error(error);
    showMessage("❌ حصل خطأ، حاول تاني", "error");
  }
};
