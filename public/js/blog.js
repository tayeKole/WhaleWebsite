import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
const auth = getAuth(app);

async function loadBlogPosts() {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, 'BlogPosts'));
    if (snapshot.exists()) {
      const postsObj = snapshot.val();
      return Object.values(postsObj);
    } else {
      console.log("No blog posts found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

function createBlogPostHTML(post) {
  const encodedTitle = encodeURIComponent(post.Title);
  return `
    <article class="blog-post">
      <div class="blog-image">
        <img src="${post.ImageUrl || 'default-image.png'}" alt="${post.Title}">
        <div class="blog-overlay">
          <div class="blog-actions">
            <a class="blog-action-btn" href="ReadBlog.html?title=${encodedTitle}">Read</a>
          </div>
        </div>
      </div>
      <div class="category">${post.Category}</div>
      <h2>${post.Title}</h2>
      <p class="excerpt">${post.Excerpt}</p>
      <div class="meta">
        <span>${post.Author}</span>
        <span>${new Date(post.postDate).toLocaleDateString()}</span>
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Load blog posts
  const postsGrid = document.querySelector('.posts-grid');
  const blogPosts = await loadBlogPosts();

  if (blogPosts.length === 0) {
    postsGrid.innerHTML = '<p>No posts available.</p>';
  } else {
    postsGrid.innerHTML = blogPosts.map(createBlogPostHTML).join('');
  }

  // Show/hide nav links based on Firebase login & admin email
  onAuthStateChanged(auth, (user) => {
    if (user && user.email === "rcolesky@gmail.com") {  // <-- Admin email here
      document.getElementById("postBlogLink").style.display = "inline-block";
      document.getElementById("postlistinglink").style.display = "inline-block";
      document.getElementById("loginLink").style.display = "none";
    } else {
      document.getElementById("postBlogLink").style.display = "none";
      document.getElementById("postlistinglink").style.display = "none";
      document.getElementById("loginLink").style.display = "inline-block";
    }
  });
});
