// Firebase Initialization
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ SW registered'))
      .catch(err => console.log('❌ SW failed:', err));
  });
}

// Global Utility Functions
function showMessage(text, type = 'info') {
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

function generateOrderId() {
  return 'DF' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Export for other scripts
window.db = db;
window.showMessage = showMessage;
window.generateOrderId = generateOrderId;
