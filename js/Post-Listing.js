import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBdcMrmOKTZB68HI9fKT-z0WAEvSM0x-h8",
  authDomain: "clay-to-life.firebaseapp.com",
  databaseURL: "https://clay-to-life-default-rtdb.firebaseio.com",
  projectId: "clay-to-life",
  storageBucket: "clay-to-life.appspot.com",
  messagingSenderId: "88013123074",
  appId: "1:88013123074:web:c5c57cac389c14a620011b",
  measurementId: "G-EDNMGKZKY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const validateFileLimit = (input) => {
  if (input.files.length > 5) {
    alert("You can only upload a maximum of 5 images.");
    input.value = "";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.querySelector('input[name="image"]');
  imageInput.addEventListener("change", () => validateFileLimit(imageInput));

  const writeBlogPost = (ProductId, Name, Price, Category, Author, PhoneNumber, Email, TextFileUrl, ImageUrls) => {
    const dbReference = ref(db, 'Products/' + ProductId);
    return set(dbReference, {
      Name,
      Price,
      Category,
      Author,
      PhoneNumber,
      Email,
      TextFileUrl,
      ImageUrls
    });
  };

  const uploadImage = async (imageFile, productId) => {
    const storageReference = storageRef(storage, 'images/' + productId + '/' + imageFile.name);
    await uploadBytes(storageReference, imageFile);
    return getDownloadURL(storageReference);
  };

  const handleImageUpload = async (files, productId) => {
    const urls = [];
    for (const file of files) {
      const url = await uploadImage(file, productId);
      if (url) urls.push(url);
    }
    return urls;
  };

  const uploadTextFile = async (title, textContent) => {
    const blob = new Blob([textContent], { type: "text/plain" });
    const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileRef = storageRef(storage, `ProductsDescription/${safeTitle}.txt`);
    await uploadBytes(fileRef, blob);
    return getDownloadURL(fileRef);
  };

  document.getElementById("PostButton").addEventListener("click", async (e) => {
    e.preventDefault();

    const Name = document.querySelector('input[name="name"]').value.trim();
    const Price = document.querySelector('input[name="price"]').value.trim();
    const Text = document.querySelector('textarea[name="textarea"]').value.trim();
    const Category = document.querySelector('input[name="category"]').value.trim();
    const PhoneNumber = document.querySelector('input[name="PhoneNumber"]').value.trim();
    const Email = document.querySelector('input[name="email"]').value.trim();
    const Author = localStorage.getItem("loggedInUser") || "Anonymous";
    const imageInput = document.querySelector('input[name="image"]');
    const imageFiles = imageInput.files;

    if (!Name || !Price || !Text || !Category || !PhoneNumber || !Email) {
      alert("Please fill out all fields.");
      return;
    }

    if (imageFiles.length === 0 || imageFiles.length > 5) {
      alert("Please upload between 1 and 5 images.");
      return;
    }

    try {
      const imageUrls = await handleImageUpload(imageFiles, Name);
      const textUrl = await uploadTextFile(Name, Text);
      await writeBlogPost(Name, Name, Price, Category, Author, PhoneNumber, Email, textUrl, imageUrls);
      alert("Product posted successfully!");
      window.location.href = "index.html";
    } catch (err) {
      console.error("Error:", err);
      alert("Error uploading product. Please try again.");
    }
  });

  // Toggle nav links based on user
  const username = localStorage.getItem("loggedInUser");
  document.getElementById("postBlogLink").style.display = username === "RobColesky" ? "inline-block" : "none";
  document.getElementById("postlistinglink").style.display = username === "RobColesky" ? "inline-block" : "none";
  document.getElementById("loginLink").style.display = username === "RobColesky" ? "none" : "inline-block";
});
