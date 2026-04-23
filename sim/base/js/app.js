// ===== INSTELLINGEN =====
const settings = {
  season: "zomer",
  weather: "calm"
};

// ===== KAART =====
const defaultLatLng = [51.2194, 4.4025]; // Antwerpen

const map = L.map("map").setView(defaultLatLng, 13);

// Basiskaart (licht)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

// 🌊 Maritieme overlay
L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenSeaMap"
}).addTo(map);

const boatIcon = L.icon({
  iconUrl: "/aquateck-simulator/assets/arrow.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const marker = L.marker(defaultLatLng, { icon: boatIcon }).addTo(map);

// ===== SIMULATIE VARIABELEN =====
let currentSpeed = 10;
let currentLat = defaultLatLng[0];
let currentLng = defaultLatLng[1];

// ===== SIMULATIE ENGINE =====
function generateData() {

  let targetSpeed = 10;

  // 🌡️ seizoen
  if (settings.season === "winter") targetSpeed -= 1;
  if (settings.season === "zomer") targetSpeed += 1;

  // 🌦️ weer
  if (settings.weather === "storm") targetSpeed -= 4;
  if (settings.weather === "wind") targetSpeed -= 2;

  // 🎲 random
  const random = (Math.random() * 2 - 1);

  targetSpeed += random;

  // ⚓ INERTIA (belangrijk!)
  currentSpeed += (targetSpeed - currentSpeed) * 0.1;

  // 📍 beweging
  currentLat += (Math.random() - 0.5) * 0.001;
  currentLng += (Math.random() - 0.5) * 0.001;

  // 📻 VHF
  const channels = [16];
  const kanaal = channels[Math.floor(Math.random() * channels.length)];

  return {
    locatie: "Simulatie actief",
    snelheid: currentSpeed.toFixed(1),
    lat: currentLat,
    lng: currentLng,
    kanaal
  };
}

// ===== LIVE UPDATE =====
setInterval(() => {

  const data = generateData();

  // UI
  document.getElementById("location").innerText = data.locatie;
  document.getElementById("speed").innerText = data.snelheid;
  document.getElementById("vhf").innerText = data.kanaal;

  // kaart
  const latlng = [data.lat, data.lng];
  marker.setLatLng(latlng);
  map.setView(latlng);

}, 1000);

// ===== UI EVENTS =====
document.getElementById("season").addEventListener("change", e => {
  settings.season = e.target.value;
});

document.getElementById("weather").addEventListener("change", e => {
  settings.weather = e.target.value;
});
