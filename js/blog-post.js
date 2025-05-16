import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

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
const storage = getStorage(app);

function writeBlogPost(PostId, Title, Excerpt, Category, Author, postDate, TextFileUrl, ImageUrl) {
  const dbReference = ref(db, 'BlogPosts/' + PostId);
  return set(dbReference, {
    Title,
    Excerpt,
    Category,
    Author,
    postDate,
    TextFileUrl,
    ImageUrl
  })
  .then(() => {
    console.log("Data saved successfully!");
  })
  .catch((error) => {
    console.error("Error saving data:", error);
    throw error; // rethrow to propagate error
  });
}




async function uploadImage(imageUrl) {
  if (!imageUrl) {
    alert("No file selected.");
    return null;
  }

  const storageReference = storageRef(storage, 'images/' + imageUrl.name);
  try {
    await uploadBytes(storageReference, imageUrl);
    const downloadURL = await getDownloadURL(storageReference);
    console.log("File available at", downloadURL);
    let storeImage = true;
    return downloadURL;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}

async function uploadTextFile(title, textContent) {
  const blob = new Blob([textContent], { type: "text/plain" });
  const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `blogPosts/${safeTitle}.txt`;
  const fileRef = storageRef(storage, fileName);

  try {
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);
    console.log("Text file available at:", downloadURL);
    let storeText = true;
    return downloadURL;
  } catch (error) {
    console.error("Text file upload failed:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("PostButton").addEventListener("click", async (e) => {
    e.preventDefault();

    const Title = document.querySelector('input[name="title"]').value;
    const Excerpt = document.querySelector('input[name="excerpt"]').value;
    const Text = document.querySelector('textarea[name="textarea"]').value;
    const Category = document.querySelector('input[name="category"]').value;
    const postDate = new Date().toISOString().slice(0, 10);
    const Author = localStorage.getItem("loggedInUser");

    const imageInput = document.querySelector('input[name="image"]');
    const imageFile = imageInput.files[0];


    // Upload image and text
    const imageURL = await uploadImage(imageFile);
    const textURL = await uploadTextFile(Title, Text);

    try {
      await writeBlogPost(Title, Title, Excerpt, Category, Author, postDate, textURL, imageURL);
      // Only redirect if write succeeded
      if (imageURL && textURL) {
        window.location.href = "index.html";
      } else {
        alert("Error uploading files, please try again.");
      }
    } catch(err) {
      alert("Error saving post data: " + err.message);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");

  if (username === "RobColesky") {
    document.getElementById("postBlogLink").style.display = "inline-block";
    document.getElementById("postlistinglink").style.display = "inline-block";
    document.getElementById("loginLink").style.display = "none";
  } else {
    document.getElementById("postBlogLink").style.display = "none";
    document.getElementById("postlistinglink").style.display = "none";
    document.getElementById("loginLink").style.display = "inline-block";
  }
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