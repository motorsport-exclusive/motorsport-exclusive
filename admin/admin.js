const uploadForm = document.getElementById('uploadForm');
const articleList = document.getElementById('articleList');

// Auto backend URL
const backendURL = window.location.hostname.includes('localhost')
  ? 'http://localhost:5000'
  : 'https://your-backend-name.onrender.com'; // CHANGE here

// Upload article
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);

  try {
    const response = await fetch(`${backendURL}/api/articles`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      alert('Article uploaded successfully!');
      uploadForm.reset();
      loadArticles();
    } else {
      alert('Failed to upload article');
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert('Error uploading article.');
  }
});

// Load Articles
async function loadArticles() {
  try {
    articleList.innerHTML = '';
    const res = await fetch(`${backendURL}/api/articles`);
    const articles = await res.json();

    articles.forEach(article => {
      const div = document.createElement('div');
      div.className = 'article-item';
      div.innerHTML = `
        <h3>${article.title}</h3>
        <small>Uploaded on: ${new Date(article.createdAt).toLocaleString()}</small>
        <p>${article.content.slice(0, 100)}...</p>
        <button class="delete-btn" onclick="deleteArticle('${article._id}')">Delete</button>
      `;
      articleList.appendChild(div);
    });
  } catch (err) {
    console.error('Load error:', err);
  }
}

// Delete article
async function deleteArticle(id) {
  if (confirm('Are you sure you want to delete this article?')) {
    try {
      const res = await fetch(`${backendURL}/api/articles/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        alert('Article deleted successfully!');
        loadArticles();
      } else {
        alert('Failed to delete article');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  }
}

// On page load
loadArticles();
