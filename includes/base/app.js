let map;
let marker;

function loadDashboard() {
  // Beveiliging
  if (localStorage.getItem("authenticated") !== "true") {
    window.location.href = "/index.html";
    return;
  }

  /* ===== KAART ===== */
  const defaultLatLng = [51.2194, 4.4025]; // Antwerpen

  map = L.map("map").setView(defaultLatLng, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  marker = L.marker(defaultLatLng)
    .addTo(map)
    .bindPopup("Vaartuig")
    .openPopup();

  /* ===== FIREBASE LISTENER ===== */
  db.ref("metingen").limitToLast(1).on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    const key = Object.keys(data)[0];
    const laatste = data[key];

    console.log("Ontvangen data:", laatste);

    // Dashboard invullen
    document.getElementById("location").innerText = laatste.locatie ?? "-";
    document.getElementById("logSpeed").innerText = laatste.snelheid ?? "-";
    document.getElementById("vhf").innerText = laatste.kanaal ?? "-";

    // Optioneel als later beschikbaar
    // document.getElementById("gpsSpeed").innerText = laatste.gpsSpeed;
    // document.getElementById("battery").innerText = laatste.battery;
    // document.getElementById("charger").innerText = laatste.charger;

    // Marker updaten als lat/lng bestaat
    if (laatste.lat && laatste.lng) {
      const latlng = [parseFloat(laatste.lat), parseFloat(laatste.lng)];
      marker.setLatLng(latlng);
      map.setView(latlng);
    }
  });
}
