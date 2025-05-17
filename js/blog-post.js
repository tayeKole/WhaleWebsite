import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase config
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
const auth = getAuth(app);

// 🔐 Protect Page Access — check user email instead of displayName
onAuthStateChanged(auth, (user) => {
  if (user && user.email === "rcolesky@gmail.com") {
    document.getElementById("postBlogLink").style.display = "inline-block";
    document.getElementById("postlistinglink").style.display = "inline-block";
    document.getElementById("loginLink").style.display = "none";
  } else {
    alert("Access denied. Please log in as the admin.");
    window.location.href = "login.html";
  }
});

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
  .then(() => console.log("Data saved successfully!"))
  .catch((error) => {
    console.error("Error saving data:", error);
    throw error;
  });
}

async function uploadImage(imageFile) {
  if (!imageFile) {
    alert("No file selected.");
    return null;
  }

  const storageReference = storageRef(storage, 'images/' + imageFile.name);
  try {
    await uploadBytes(storageReference, imageFile);
    const downloadURL = await getDownloadURL(storageReference);
    console.log("File available at", downloadURL);
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
    return downloadURL;
  } catch (error) {
    console.error("Text file upload failed:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("PostButton").addEventListener("click", async (e) => {
    e.preventDefault();

    const Title = document.querySelector('input[name="title"]').value.trim();
    const Excerpt = document.querySelector('input[name="excerpt"]').value.trim();
    const Text = document.querySelector('textarea[name="textarea"]').value.trim();
    const Category = document.querySelector('input[name="category"]').value.trim();
    const postDate = new Date().toISOString().slice(0, 10);
    const Author = auth.currentUser?.email || "Unknown";

    const imageInput = document.querySelector('input[name="image"]');
    const imageFile = imageInput.files[0];

    if (!Title || !Excerpt || !Text || !Category) {
      alert("Please fill in all required fields.");
      return;
    }

    const imageURL = await uploadImage(imageFile);
    const textURL = await uploadTextFile(Title, Text);

    if (!imageURL || !textURL) {
      alert("Error uploading files, please try again.");
      return;
    }

    try {
      await writeBlogPost(Title, Title, Excerpt, Category, Author, postDate, textURL, imageURL);
      alert("Blog post saved successfully!");
      window.location.href = "index.html";
    } catch (err) {
      alert("Error saving post data: " + err.message);
    }
  });
});
