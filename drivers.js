const DRIVER_ID = "PUT_DRIVER_ID_HERE";

db.collection("orders")
.where("driverId","==",DRIVER_ID)
.onSnapshot(snap=>{
  let html="";
  snap.forEach(doc=>{
    let o=doc.data();

    html+=`
      <div class="card">
        ${o.name}
        <div>${o.address}</div>

        <div class="status ${o.status}">${o.status}</div>

        ${o.location?`<a target="_blank" href="https://maps.google.com?q=${o.location.lat},${o.location.lng}">📍 موقع</a>`:''}

        <button onclick="update('${doc.id}','delivering')">بدء</button>
        <button onclick="update('${doc.id}','done')">تم</button>
      </div>`;
  });

  orders.innerHTML=html;
});

function update(id,status){
  db.collection("orders").doc(id).update({
    status,
    updates: firebase.firestore.FieldValue.arrayUnion({
      status,
      time:Date.now()
    })
  });
}
