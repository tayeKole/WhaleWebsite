// Blog posts data
const blogPosts = [
    {
        title: "example",
        excerpt: "the reason we love.",
        image: "Images/Polo.png",
        category: "example",
        author: "Author Name",
        date: "Date"
    },
];

// Function to create blog post HTML
function createBlogPostHTML(post) {
    return `
        <article class="blog-post">
            <img src="${post.image}" alt="${post.title}">
            <div class="category">${post.category}</div>
            <h2>${post.title}</h2>
            <p class="excerpt">${post.excerpt}</p>
            <div class="meta">
                <span>${post.author}</span>
                <span>${post.date}</span>
            </div>
        </article>
    `;
}

// Load blog posts
document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.querySelector('.posts-grid');
    const postsHTML = blogPosts.map(post => createBlogPostHTML(post)).join('');
    postsGrid.innerHTML = postsHTML;
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