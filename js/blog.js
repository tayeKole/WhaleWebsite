// Blog posts data
const blogPosts = [
    {
        title: "example",
        excerpt: "example.",
        image: "Images/Polo.png",
        category: "example",
        author: {
            name: "Author Name",
            image: "Images/Polo.png"
        },
        date: "Date"
    },
    {
        title: "example",
        excerpt: "example",
        image: "Images/Polo.png",
        category: "example",
        author: {
            name: "Author Name",
            image: "Images/Polo.png"
        },
        date: "Date"
    },
    {
        title: "example",
        excerpt: "example",
        image: "Images/Polo.png",
        category: "example",
        author: {
            name: "Author Name",
            image: "Images/Polo.png",
        },
        date: "Date"
    }
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
                <img src="${post.author.image}" alt="${post.author.name}" class="author-img">
                <span>${post.author.name}</span>
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