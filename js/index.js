import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user && user.email === "rcolesky@gmail.com") {
      // Show admin links
      document.getElementById("postBlogLink").style.display = "inline-block";
      document.getElementById("postlistinglink").style.display = "inline-block";
      document.getElementById("loginLink").style.display = "none";
    } else {
      // Hide admin links, show login link
      document.getElementById("postBlogLink").style.display = "none";
      document.getElementById("postlistinglink").style.display = "none";
      document.getElementById("loginLink").style.display = "inline-block";
    }
  });

  
});

