import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const productId = localStorage.getItem("selectedProductId");

  if (!productId) {
    alert("No product selected.");
    window.location.href = "index.html";
    return;
  }

  // Get DOM elements
  const productNameEl = document.getElementById("productName");
  const productCategoryEl = document.getElementById("productCategory");
  const productPriceEl = document.getElementById("productPrice");
  const productAuthorEl = document.getElementById("productAuthor");
  const productPhoneEl = document.getElementById("productPhone");
  const productEmailEl = document.getElementById("productEmail");
  const productWeightEl = document.getElementById("productWeight");
  const productDimensionsEl = document.getElementById("productDimensions");
  const productDescriptionEl = document.getElementById("productDescription");
  const carouselImagesContainer = document.getElementById("carouselImages");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Ensure all required DOM elements exist
  if (
    !productNameEl || !productCategoryEl || !productPriceEl || !productAuthorEl ||
    !productPhoneEl || !productEmailEl || !productWeightEl || !productDimensionsEl ||
    !productDescriptionEl || !carouselImagesContainer || !prevBtn || !nextBtn
  ) {
    console.error("❌ One or more required DOM elements are missing from the page.");
    alert("Page is missing required elements. Please contact support.");
    return;
  }

  let currentImageIndex = 0;
  let images = [];

  function showImage(index) {
    const imgs = carouselImagesContainer.querySelectorAll("img");
    if (imgs.length === 0) return;
    imgs.forEach((img, i) => {
      img.style.display = i === index ? "block" : "none";
    });
  }

  prevBtn.addEventListener("click", () => {
    if (images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex);
  });

  nextBtn.addEventListener("click", () => {
    if (images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
  });

  const dbRef = ref(db);

  get(child(dbRef, `Products/${productId}`))
    .then(snapshot => {
      if (!snapshot.exists()) {
        alert("Product not found.");
        window.location.href = "index.html";
        return;
      }

      const data = snapshot.val();

      // Fill product info
      productNameEl.textContent = data.Name || "Unnamed";
      productCategoryEl.textContent = `Category: ${data.Category || "N/A"}`;
      productPriceEl.textContent = `Price: R${parseFloat(data.Price || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
      productAuthorEl.textContent = `Author: ${data.Author || "N/A"}`;
      productPhoneEl.textContent = `Phone: ${data.PhoneNumber || "N/A"}`;
      productEmailEl.textContent = `Email: ${data.Email || "N/A"}`;
      productWeightEl.textContent = `Weight: ${data.Weight || "N/A"}`;
      productDimensionsEl.textContent = `Dimensions (LxWxH): ${data.LxWxH || "N/A"}`;

      // Load description
      if (data.TextFileUrl) {
        fetch(data.TextFileUrl)
          .then(res => res.text())
          .then(text => {
            productDescriptionEl.innerHTML = text.replace(/\n/g, "<br>");
          })
          .catch(err => {
            productDescriptionEl.textContent = "Description could not be loaded.";
            console.error("Error loading description:", err);
          });
      } else {
        productDescriptionEl.textContent = "No description available.";
      }

      // Load images
      images = Array.isArray(data.ImageUrls) && data.ImageUrls.length > 0
        ? data.ImageUrls
        : ["Images/default.png"];

      carouselImagesContainer.innerHTML = "";

      images.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = data.Name || "Product Image";
        img.style.display = "none";
        img.style.maxWidth = "100%";
        img.style.maxHeight = "400px";

        // Fallback image
        img.onerror = () => {
          img.src = "Images/default.png";
        };

        carouselImagesContainer.appendChild(img);
      });

      currentImageIndex = 0;
      showImage(currentImageIndex);

      // Hide nav if only 1 image
      if (images.length <= 1) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
      }
    })
    .catch(error => {
      console.error("Firebase Database Error:", error.message, error);
      alert("Error loading product: " + error.message);
      window.location.href = "index.html";
    });
});
