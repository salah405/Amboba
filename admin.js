loadAll();

function loadAll(){
  loadPrices();
  loadDrivers();
  loadOrders();
}

// PRICES
function savePrices(){
  db.collection("settings").doc("prices").set({
    gas:+gasPrice.value,
    delivery:+deliveryPrice.value
  });
}

function loadPrices(){
  db.collection("settings").doc("prices").onSnapshot(doc=>{
    if(doc.exists){
      let d=doc.data();
      gasPrice.value=d.gas;
      deliveryPrice.value=d.delivery;
    }
  });
}

// DRIVERS
function addDriver(){
  db.collection("drivers").add({
    name:dName.value,
    phone:dPhone.value,
    area:dArea.value,
    active:true
  });
}

function loadDrivers(){
  db.collection("drivers").onSnapshot(snap=>{
    let html="";
    snap.forEach(doc=>{
      let d=doc.data();
      html+=`
        <div class="card">
          ${d.name} (${d.area})
          <button onclick="toggle('${doc.id}',${d.active})">${d.active?'إيقاف':'تفعيل'}</button>
          <button onclick="del('${doc.id}')">حذف</button>
        </div>`;
    });
    drivers.innerHTML=html;
  });
}

function toggle(id,active){
  db.collection("drivers").doc(id).update({active:!active});
}

function del(id){
  db.collection("drivers").doc(id).delete();
}

// ORDERS
function loadOrders(){
  db.collection("orders").onSnapshot(async snap=>{
    let html="";
    let driversSnap = await db.collection("drivers").get();

    let options="";
    driversSnap.forEach(d=>{
      if(d.data().active){
        options+=`<option value="${d.id}">${d.data().name}</option>`;
      }
    });

    snap.forEach(doc=>{
      let o=doc.data();
      html+=`
        <div class="card">
          ${o.name}
          <div>${o.address}</div>

          <select onchange="assign('${doc.id}',this.value)">
            <option>اختار مندوب</option>
            ${options}
          </select>

          <div class="status ${o.status}">${o.status}</div>
        </div>`;
    });

    orders.innerHTML=html;
  });
}

function assign(id,driverId){
  db.collection("orders").doc(id).update({
    driverId,
    status:"assigned"
  });
}

// EXPORT
function exportData(){
  db.collection("orders").get().then(snap=>{
    let csv="";
    snap.forEach(doc=>{
      let o=doc.data();
      csv += `${o.name},${o.phone},${o.status}\n`;
    });

    let blob=new Blob([csv]);
    let a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="orders.csv";
    a.click();
  });
}
