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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Helper to get query parameter from URL
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function loadBlogPost() {
  const title = getQueryParam("title");
  if (!title) {
    document.body.innerHTML = "<p>No blog title provided.</p>";
    return;
  }

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "BlogPosts"));
    if (!snapshot.exists()) {
      document.body.innerHTML = "<p>No blog posts found.</p>";
      return;
    }

    const posts = snapshot.val();
    const post = Object.values(posts).find(p => p.Title === title);

    if (!post) {
      document.body.innerHTML = "<p>Blog post not found.</p>";
      return;
    }

    // Fetch text content from Firebase Storage URL
    const textResponse = await fetch(post.TextFileUrl);
    const textContent = await textResponse.text();

    // Fill in the content in the page
    const blogTitleEl = document.getElementById("blog-title");
    const blogAuthorEl = document.getElementById("blog-author");
    const blogDateEl = document.getElementById("blog-date");
    const blogImageEl = document.getElementById("blog-image");
    const blogContentEl = document.getElementById("blog-content");

    if (blogTitleEl) blogTitleEl.textContent = post.Title;
    if (blogAuthorEl) blogAuthorEl.textContent = post.Author;
    if (blogDateEl) blogDateEl.textContent = new Date(post.postDate).toLocaleDateString();
    if (blogImageEl) blogImageEl.src = post.ImageUrl;
    if (blogContentEl) blogContentEl.textContent = textContent;

  } catch (error) {
    console.error("Error loading blog post:", error);
    document.body.innerHTML = "<p>Error loading blog post.</p>";
  }
}

// Run loadBlogPost on DOM ready
document.addEventListener("DOMContentLoaded", loadBlogPost);

// Toggle link visibility based on logged-in user (safe null checks)
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");

  const postBlogLink = document.getElementById("postBlogLink");
  const postlistinglink = document.getElementById("postlistinglink");
  const loginLink = document.getElementById("loginLink");

  if (username === "RobColesky") {
    if (postBlogLink) postBlogLink.style.display = "inline-block";
    if (postlistinglink) postlistinglink.style.display = "inline-block";
    if (loginLink) loginLink.style.display = "none";
  } else {
    if (postBlogLink) postBlogLink.style.display = "none";
    if (postlistinglink) postlistinglink.style.display = "none";
    if (loginLink) loginLink.style.display = "inline-block";
  }
});
