import { moveAlongRoute, route } from "./route.js";

// ===== INSTELLINGEN =====
const settings = {
  season: "zomer",
  weather: "calm"
};

// ===== KAART =====
const defaultLatLng = [51.231412, 2.923875];

const map = L.map("map").setView(defaultLatLng, 13);

// Basiskaart
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

// Maritieme overlay
L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenSeaMap"
}).addTo(map);

// 🔥 ROUTE tekenen (NU OP JUISTE PLAATS)
L.polyline(route, { color: "cyan", weight: 3 }).addTo(map);

// ===== BOOT =====
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

  // seizoen
  if (settings.season === "winter") targetSpeed -= 1;
  if (settings.season === "zomer") targetSpeed += 1;

  // weer
  if (settings.weather === "storm") targetSpeed -= 4;
  if (settings.weather === "wind") targetSpeed -= 2;

  // random
  targetSpeed += (Math.random() * 2 - 1);

  // inertia
  currentSpeed += (targetSpeed - currentSpeed) * 0.1;

  // 🔥 beweging met snelheid
  const newPos = moveAlongRoute(currentLat, currentLng, currentSpeed);

  currentLat = newPos.lat;
  currentLng = newPos.lng;

  // VHF
  const kanaal = 16;

  return {
    locatie: "Op route",
    snelheid: currentSpeed.toFixed(1),
    lat: currentLat,
    lng: currentLng,
    kanaal,
    heading: newPos.heading
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

  // 🔥 ROTATIE (HEEL BELANGRIJK)
 const el = marker.getElement();
if (el) {
  el.style.transform = `translate(-50%, -50%) rotate(${data.heading}deg)`;
}

}, 1000);

// ===== UI EVENTS =====
document.getElementById("season").addEventListener("change", e => {
  settings.season = e.target.value;
});

document.getElementById("weather").addEventListener("change", e => {
  settings.weather = e.target.value;
});
