// Products data
const products = [
    {
        id: 1,
        name: "Minimal Ceramic Whale",
        price: 45.00,
        category: "Whales",
        image: "Images/Polo.png"
    },
    {
        id: 2,
        name: "Whale hand made",
        price: 65.00,
        category: "Other",
        image: "Images/Polo.png"
    },
    {
        id: 3,
        name: "baba Whale",
        price: 28.00,
        category: "Other",
        image: "Images/Polo.png"
    },
    {
        id: 4,
        name: "Concrete Whale",
        price: 35.00,
        category: "Other",
        image: "Images/Polo.png"
    }
];

// Function to create product card HTML
function createProductHTML(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <div class="product-actions">
                        <button class="product-action-btn">Quick View</button>
                        <button class="product-action-btn">Add to Cart</button>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        </div>
    `;
}

// Filter and sort products
function filterAndSortProducts(category = 'all', sortBy = 'featured') {
    let filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    switch(sortBy) {
        case 'price-low-high':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high-low':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filtered.reverse();
            break;
        default:
            // Featured - keep original order
            break;
    }

    return filtered;
}

// Initialize shop page
document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.querySelector('.products');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sortSelect = document.getElementById('sort-select');

    function updateProducts() {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        const sortBy = sortSelect.value;
        const filtered = filterAndSortProducts(activeCategory, sortBy);
        productsContainer.innerHTML = filtered.map(product => createProductHTML(product)).join('');
    }

    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateProducts();
        });
    });

    // Sort handler
    sortSelect.addEventListener('change', updateProducts);

    // Initial load
    updateProducts();
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