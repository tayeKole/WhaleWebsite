// Import and initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";


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
const db = getDatabase(app);

// Write user data to the Realtime Database
function loginUser(username, passwordInput) {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${username}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === passwordInput) {
          console.log("Login successful!");
          alert("Welcome, " + username + "!");
          localStorage.setItem("loggedInUser", username);
          window.location.href = "index.html";
        } else {
          console.log("Incorrect password");
          alert("Incorrect password");
        }
      } else {
        console.log("User does not exist");
        alert("User not found");
      }
    })
    .catch((error) => {
      console.error("Error reading data:", error);
      alert("Login error");
    });
}

// DOM interaction after page load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginButton").addEventListener("click", (e) => {
    e.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="pass"]').value;

    loginUser(username, password);
  });
});