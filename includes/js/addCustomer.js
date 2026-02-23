console.log("addCustomer.js geladen");

import { auth, db } from "/aquateck-simulator/includes/firebase/config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {sendSignInLinkToEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("customerForm");
  const melding = document.getElementById("melding");

  const actionCodeSettings = {
    url: "https://teck-bel.github.io/aquateck-simulator/finishSignUp.html",
    handleCodeInApp: true
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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

      melding.textContent = "Customer succesful added and reset email is send!";
      form.reset();

    } catch (error) {
      console.error("error:", error);
      melding.textContent = "❌ error adding customer.";
    }

  });

});
