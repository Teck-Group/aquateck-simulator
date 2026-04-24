// ===== ROUTE CONFIG =====
export const route = [
  [51.231412, 2.923875],
  [51.233579, 2.922947],
  [51.234164, 2.925225],
  [51.244428, 2.914994],
  [51.257341, 2.946103],
  [51.262311, 2.941735],
  [51.233303, 2.846884],
  [51.227211, 2.853966],
  [51.244428, 2.914994],
  [51.234164, 2.925225],
  [51.233579, 2.922947],
  [51.231412, 2.923875],
];

// ===== STATE =====
let routeIndex = 0;
let currentHeading = 0;

// ===== HELPERS =====

// bereken richting (in graden)
function getHeading(dx, dy) {
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

// smooth draaien (belangrijk!)
function smoothRotate(current, target, factor = 0.1) {
  let diff = target - current;

  // kortste draai kiezen (-180 tot 180)
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return current + diff * factor;
}

// ===== MAIN =====
export function moveAlongRoute(currentLat, currentLng, speed = 10) {

  const target = route[routeIndex];

  const dx = target[0] - currentLat;
  const dy = target[1] - currentLng;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // 👉 richting berekenen
  const targetHeading = getHeading(dx, dy);
  currentHeading = smoothRotate(currentHeading, targetHeading);

  // 👉 volgende punt
  if (distance < 0.0005) {
    routeIndex++;
    if (routeIndex >= route.length) routeIndex = 0;
  }

  // 👉 snelheid omzetten naar beweging
  const speedFactor = speed / 5000;

  const newLat = currentLat + Math.cos(currentHeading * Math.PI / 180) * speedFactor;
  const newLng = currentLng + Math.sin(currentHeading * Math.PI / 180) * speedFactor;

  return {
    lat: newLat,
    lng: newLng,
    heading: currentHeading
  };
}
