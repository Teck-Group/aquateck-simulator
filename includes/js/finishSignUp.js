console.log("finishSignUp.js geladen");

import { auth } from "/aquateck-simulator/includes/firebase/config.js";
import { isSignInWithEmailLink, signInWithEmailLink } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const melding = document.getElementById("melding");

// 🔹 Check of de link van Firebase komt
if (isSignInWithEmailLink(auth, window.location.href)) {

  // 🔹 Email ophalen uit localStorage, of vraag gebruiker
  let email = localStorage.getItem("emailForSignIn");
  if (!email) {
    email = window.prompt("Bevestig je e-mailadres:");
  }

  // 🔹 Account afronden
  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {

      // 🔹 Verwijder tijdelijk opgeslagen email
      localStorage.removeItem("emailForSignIn");

      // 🔹 Succesmelding
      melding.textContent = "✅ Je account is geactiveerd! Je wordt doorgestuurd…";

      // 🔹 Redirect naar dashboard of simulator
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);

    })
    .catch((error) => {
      console.error("Fout bij activeren account:", error);
      melding.textContent = "❌ Fout bij activeren account: " + error.message;
    });

} else {
  melding.textContent = "❌ Ongeldige link. Gebruik de link uit de e-mail.";
}
