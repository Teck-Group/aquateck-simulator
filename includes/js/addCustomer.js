console.log("addCustomer.js geladen");

import { auth, db } from "/aquateck-simulator/includes/firebase/config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {sendSignInLinkToEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("customerForm");
  const melding = document.getElementById("melding");

  if (!form) return;

  const actionCodeSettings = {
    url: "https://teck-bel.github.io/aquateck-simulator/finishSignUp.html",
    handleCodeInApp: true
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    melding.textContent = "❌ error adding customer.";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const company = document.getElementById("company").value;
    const simulator = document.getElementById("simulator").value;

    try {
      //send login link
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", email);

      //Create a firestrore document
      await addDoc(collection(db, "customers"), {
        name,
        email,
        company,
        simulator,
        role: "customer",
        licenseActive: true,
        aangemaaktOp: serverTimestamp()
      });

      melding.style.color = "green";
      melding.textContent = "Customer succesful added and reset email is send!";
      form.reset();

    } catch (error) {
      console.error("Firebase error", error.code);

      melding.style.color = "red";

      switch (error.code) {
        case "auth/operation-not-allowed":
          melding.textContent = " Email Longin is not on in firebase.";
          break;

          case "auth/invalid-email":
            melding.textContent = "❌ Ongeldig e-mailadres.";
            break;
  
          case "auth/network-request-failed":
            melding.textContent ="❌ Netwerkfout. Controleer internetverbinding.";
            break;
  
          default:
            melding.textContent ="❌ Er is een onverwachte fout opgetreden.";
        }
    }

  });

});
