// Pogoda Kg - Single Post logic
import { BLOG_POSTS } from './blog.js';
import { initTheme } from './theme.js';
import { initLangSwitcher } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLangSwitcher();
  loadPost();
});

function loadPost() {
  const container = document.getElementById('singlePostContainer');
  if (!container) return;

  // Extract ID from URL (e.g., post.html?id=post-1)
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) {
    showError(container, "Article ID not provided.");
    return;
  }

  const post = BLOG_POSTS.find(p => p.id === postId);

  if (!post) {
    showError(container, "Article not found.");
    return;
  }

  // Update Page Title
  document.title = `${post.title} | Pogoda Kg`;

  // Render Content
  container.innerHTML = `
    <a href="blog.html" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to News</a>
    <img src="${post.image}" alt="${post.title}" class="post-hero-img">
    <span class="news-tag" style="font-size:14px; padding:6px 12px;">${post.category}</span>
    <h1 class="post-title">${post.title}</h1>
    <div class="post-meta">
      <span><i class="fa-solid fa-user"></i> ${post.author}</span>
      <span><i class="fa-solid fa-calendar"></i> ${post.date}</span>
    </div>
    <div class="post-content">
      ${post.content}
    </div>
  `;
}

function showError(container, message) {
  container.innerHTML = `
    <div style="text-align: center; padding: 60px 20px;">
      <i class="fa-solid fa-circle-exclamation" style="font-size:48px; color:var(--text-sub); margin-bottom:20px;"></i>
      <h2 style="margin-bottom:10px;">Oops!</h2>
      <p style="color:var(--text-sub); margin-bottom: 24px;">${message}</p>
      <a href="blog.html" class="form-btn" style="text-decoration:none; display:inline-block;">Go Back to News</a>
    </div>
  `;
}
