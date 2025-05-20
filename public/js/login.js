// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM interaction after page load
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginButton");

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[name="username"]').value; // Use email as username
    const password = document.querySelector('input[name="pass"]').value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user info in localStorage (non-sensitive)
      localStorage.setItem("loggedInUser", user.email);

      alert(`Welcome, ${user.email}`);
      window.location.href = "index.html"; // Redirect after login
    } catch (error) {
      // Show error to user
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  });
});
