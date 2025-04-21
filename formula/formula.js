const newsContainer = document.getElementById('articlesContainer');
const modal = document.getElementById('articleModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');

// Backend URL
const backendURL = 'https://motorsport-exclusive.onrender.com';

if (newsContainer) {
  async function fetchArticles() {
    try {
      const res = await fetch(`${backendURL}/api/articles`);
      const articles = await res.json();

      articles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'news-card';
        div.innerHTML = `
          ${article.imageUrl ? `<img src="${article.imageUrl}" alt="Article Image">` : ''}
          <div class="content">
            <h3>${article.title}</h3>
            <small>Published on: ${new Date(article.createdAt).toLocaleString()}</small>
            <p>${article.content.slice(0, 100)}...</p>
          </div>
        `;
        div.addEventListener('click', () => openModal(article));
        newsContainer.appendChild(div);
      });
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  }

  fetchArticles();
}

// Popup modal functions
function openModal(article) {
  modal.style.display = "block";
  modalImage.src = article.imageUrl || '';
  modalTitle.innerText = article.title;
  modalContent.innerText = article.content;
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    modal.style.display = "none";
  }
});
