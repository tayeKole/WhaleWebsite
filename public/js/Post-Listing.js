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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

// 🔐 Restrict access to admin
onAuthStateChanged(auth, (user) => {
  if (user && user.email === "rcolesky@gmail.com") {
    document.getElementById("postBlogLink").style.display = "inline-block";
    document.getElementById("postlistinglink").style.display = "inline-block";
    document.getElementById("loginLink").style.display = "none";
  } else {
    alert("Access denied. Only the admin can access this page.");
    window.location.href = "login.html";
  }
});

const validateFileLimit = (input) => {
  if (input.files.length > 5) {
    alert("You can only upload a maximum of 5 images.");
    input.value = "";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.querySelector('input[name="image"]');
  imageInput.addEventListener("change", () => validateFileLimit(imageInput));

  const writeBlogPost = (
    ProductId,
    Name,
    Price,
    Category,
    Author,
    PhoneNumber,
    Email,
    Weight,
    LxWxH,
    TextFileUrl,
    ImageUrls
  ) => {
    const dbRef = ref(db, 'Products/' + ProductId);
    return set(dbRef, {
      Name,
      Price,
      Category,
      Author,
      PhoneNumber,
      Email,
      Weight,
      LxWxH,
      TextFileUrl,
      ImageUrls
    });
  };

  const uploadImage = async (imageFile, productId) => {
    const storageReference = storageRef(storage, 'ProductsDescription/' + productId + '/' + imageFile.name);
    await uploadBytes(storageReference, imageFile);
    const url = await getDownloadURL(storageReference);
    console.log("Uploaded Image URL:", url);
    return url;
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

    const postButton = document.getElementById("PostButton");
    postButton.disabled = true;
    postButton.textContent = "Posting...";

    const Name = document.querySelector('input[name="name"]').value.trim();
    const Price = document.querySelector('input[name="price"]').value.trim();
    const Text = document.querySelector('textarea[name="textarea"]').value.trim();
    const Category = document.querySelector('input[name="category"]').value.trim();
    const PhoneNumber = document.querySelector('input[name="PhoneNumber"]').value.trim();
    const Email = document.querySelector('input[name="email"]').value.trim();
    const Weight = document.querySelector('input[name="weight"]').value.trim();
    const LxWxH = document.querySelector('input[name="LxWxH"]').value.trim();

    const Author = auth.currentUser?.email || "Anonymous";
    const imageFiles = imageInput.files;

    if (!Name || !Price || !Text || !Category || !PhoneNumber || !Email || !Weight || !LxWxH) {
      alert("Please fill out all fields.");
      postButton.disabled = false;
      postButton.textContent = "Post Product";
      return;
    }

    if (imageFiles.length === 0 || imageFiles.length > 5) {
      alert("Please upload between 1 and 5 images.");
      postButton.disabled = false;
      postButton.textContent = "Post Product";
      return;
    }

    try {
      const imageUrls = await handleImageUpload(imageFiles, Name);
      const textUrl = await uploadTextFile(Name, Text);
      await writeBlogPost(
        Name,
        Name,
        Price,
        Category,
        Author,
        PhoneNumber,
        Email,
        Weight,
        LxWxH,
        textUrl,
        imageUrls
      );
      alert("Product posted successfully!");
      window.location.href = "index.html";
    } catch (err) {
      console.error("Error:", err);
      alert("Error uploading product. Please try again.");
      postButton.disabled = false;
      postButton.textContent = "Post Product";
    }
  });
});
