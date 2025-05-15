import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
const db = getDatabase(app);

function writeUserData(Title, Title, Excerpt, Category, Author, Date, Text, imageUrl) {
  const reference = ref(db, 'BlogPosts/' + Title);
  set(reference, {
    Title: Title,
    Excerpt: Excerpt,
    Category: Category,
    Author: Author,
    Date: Date,
    Text: Text,
    profile_picture: imageUrl
  })
  .then(() => console.log("Data saved successfully!"))
  .catch((error) => console.error("Error saving data:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("PostButton").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Login button clicked");

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="pass"]').value;

    const email = username + "@example.com";
    const imageUrl = "https://via.placeholder.com/150";

    console.log("Saving data for:", username);
    writeUserData(username, username, email, imageUrl);
  });
});






//____________________________________
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// function writeUserData(userID, name, email, imageUrl) {
//   const reference = ref(db, 'users/' + userID);
//   set(reference, {
//     username: name,
//     email: email,
//     profile_picture: imageUrl
//   })
//   .then(() => console.log("Data saved successfully!"))
//   .catch((error) => console.error("Error saving data:", error));
// }

// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("loginButton").addEventListener("click", (e) => {
//     e.preventDefault();
//     console.log("Login button clicked");

//     const username = document.querySelector('input[name="username"]').value;
//     const password = document.querySelector('input[name="pass"]').value;

//     const email = username + "@example.com";
//     const imageUrl = "https://via.placeholder.com/150";

//     console.log("Saving data for:", username);
//     writeUserData(username, username, email, imageUrl);
//   });