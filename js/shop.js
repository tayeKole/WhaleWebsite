import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
const auth = getAuth(app);

let products = [];

// Create HTML for each product
function createProductHTML(product, id) {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.ImageUrls?.[0] || 'Images/placeholder.png'}" alt="${product.Name}">
        <div class="product-overlay">
          <div class="product-actions">
            <button class="product-action-btn" data-id="${id}">Quick View</button>
          </div>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.Name}</h3>
        <p class="product-category">${product.Category}</p>
        <p class="product-price">R${parseFloat(product.Price).toFixed(2)}</p>
      </div>
    </div>
  `;
}

function filterAndSortProducts(category = 'all', sortBy = 'featured') {
  let filtered = category === 'all'
    ? products
    : products.filter(p => p.data.Category === category);

  switch (sortBy) {
    case 'price-low-high':
      filtered.sort((a, b) => parseFloat(a.data.Price) - parseFloat(b.data.Price));
      break;
    case 'price-high-low':
      filtered.sort((a, b) => parseFloat(b.data.Price) - parseFloat(a.data.Price));
      break;
    case 'newest':
      filtered.reverse(); // Could improve by sorting by date if you add it to your data
      break;
    default:
      break;
  }

  return filtered;
}

function updateProducts() {
  const productsContainer = document.querySelector('.products');
  const activeCategoryBtn = document.querySelector('.category-btn.active');
  const category = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'all';
  const sortBy = document.getElementById('sort-select')?.value || 'featured';

  const filtered = filterAndSortProducts(category, sortBy);

  productsContainer.innerHTML = filtered
    .map(p => createProductHTML(p.data, p.id))
    .join('');

  // Attach quick view listeners
  document.querySelectorAll('.product-action-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      localStorage.setItem("selectedProductId", productId);
      window.location.href = "productListing.html";
    });
  });
}

async function fetchProducts() {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, 'Products'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      products = Object.entries(data).map(([id, product]) => ({
        id,
        data: product
      }));
      updateProducts();
    } else {
      console.error("No products found.");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Use Firebase Auth state to control visibility of admin links
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

  const categoryButtons = document.querySelectorAll('.category-btn');
  const sortSelect = document.getElementById('sort-select');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      updateProducts();
    });
  });

  sortSelect?.addEventListener('change', updateProducts);

  fetchProducts();
});
