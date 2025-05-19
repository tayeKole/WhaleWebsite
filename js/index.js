import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdcMrmOKTZB68HI9fKT-z0WAEvSM0x-h8",
  authDomain: "clay-to-life.firebaseapp.com",
  databaseURL: "https://clay-to-life-default-rtdb.firebaseio.com",
  projectId: "clay-to-life",
  storageBucket: "clay-to-life.firebasestorage.app",
  messagingSenderId: "88013123074",
  appId: "1:88013123074:web:c5c57cac389c14a620011b",
  measurementId: "G-EDNMGKZKY2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); // Realtime Database

document.addEventListener("DOMContentLoaded", () => {
  // Admin visibility check
  onAuthStateChanged(auth, (user) => {
    if (user && user.email === "rcolesky@gmail.com") {
      document.getElementById("postBlogLink").style.display = "inline-block";
      document.getElementById("postlistinglink").style.display = "inline-block";
      document.getElementById("loginLink").style.display = "none";
    } else {
      document.getElementById("postBlogLink").style.display = "none";
      document.getElementById("postlistinglink").style.display = "none";
      document.getElementById("loginLink").style.display = "inline-block";
    }
  });

  // Newsletter subscription
  const subBtn = document.getElementById("SubButton");

  subBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("subscriberEmail").value;

    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // 1. Send email via Firestore Email Trigger
      await addDoc(collection(db, "mail"), {
        to: [email],
        message: {
          subject: "Thanks for Subscribing!",
          text: "You're now subscribed to Clay To Life updates.",
          html: "<p><strong>You're now subscribed</strong> to Clay To Life updates. Stay tuned!</p>"
        }
      });

      // 2. Save email to Realtime Database under "Subscribers/"
      const subscriberRef = push(ref(rtdb, "Subscribers"));
      await set(subscriberRef, {
        email: email,
        subscribedAt: new Date().toISOString()
      });

      alert("Thank you for subscribing!");
      document.getElementById("subscriberEmail").value = "";
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Something went wrong. Please try again later.");
    }
  });
});
