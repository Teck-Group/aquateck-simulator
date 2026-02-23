console.log("dashboard.js geladen");

import { auth, db } from "/aquateck-simulator/includes/firebase/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/aquateck-simulator/login.html";
    return;
  }
  
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    alert("No usersdata found.");
    return;
  }
  
  const userData = userSnap.data();
  
  const simulators = userData.simulators || [];
  const role = userData.role || [];

  if (simulators.includes("base")) {
    document.getElementById("sim-base").style.display = "block";
    console.log("Base simulator allowed");
  }
  else {
    console.log("Base simulator not allowed");
  }
  
  if (simulators.includes("pro")) {
    document.getElementById("sim-pro").style.display = "block";
    console.log("Pro simulator allowed");
  }
  else {
    console.log("Pro simulator not allowed");
  }
  
  if (simulators.includes("fleetlink")) {
    document.getElementById("sim-fleetlink").style.display = "block";
    console.log("Fleetlink simulator allowed");
  }
  else {
    console.log("Fleetlink simulator not allowed");
  }
  
  if (simulators.includes("portguard")) {
    document.getElementById("sim-portguard").style.display = "block";
    console.log("Port Guard simulator allowed");
  }
  else {
    console.log("Port Guard simulator not allowed");
  }
  
  if (simulators.includes("fleetcommand")) {
    document.getElementById("sim-fleetcommand").style.display = "block";
    console.log("Fleet Command simulator allowed");
  }
  else {
    console.log("Fleet Command simulator not allowed");
  }

  if (role.includes("admin")){
    document.getElementById("admin-addUser").style.display = "block";
    console.log("Add user allowed");
  }
  else {
    console.log("Add user not allowed");
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = ("/aquateck-simulator/login.html");
});

window.openSim = function(page) {
  window.location.href = page;
};
