import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Helper to get query parameter
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

    // Fetch text content from Firebase Storage
    const textResponse = await fetch(post.TextFileUrl);
    const textContent = await textResponse.text();

    // Fill in the content
    document.getElementById("blog-title").textContent = post.Title;
    document.getElementById("blog-author").textContent = post.Author;
    document.getElementById("blog-date").textContent = new Date(post.postDate).toLocaleDateString();
    document.getElementById("blog-image").src = post.ImageUrl;
    document.getElementById("blog-content").textContent = textContent;

  } catch (error) {
    console.error("Error loading blog post:", error);
    document.body.innerHTML = "<p>Error loading blog post.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadBlogPost);


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