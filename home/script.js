class MotorsportApp {
  constructor() {
    this.newsContainer = document.getElementById("newsContent");
    this.loadingSpinner = document.getElementById("loadingSpinner");
    this.categoryFilter = document.getElementById("categoryFilter");
    this.menu = document.getElementById("menu");
    this.page = 1;
    this.isLoading = false;
    this.currentCategory = "all";
    this.displayedArticles = new Set(); // Track displayed article IDs
    this.articles = {
      formula: [
        {
          id: "n1",
          title: "Mercedes' George Russell Leads Team's Steady Start to 2025 Season",
          date: "2025-04-04",
          url: "https://motorsportexclusive.com/news/formula/f1/article-1",
        },
        {
          id: "n2",
          title: "Yuki Tsunoda Impresses in Red Bull Debut at Japanese Grand Prix",
          date: "2025-04-04",
          url: "https://motorsportexclusive.com/news/formula/f1/article-2",
        },
        {
          id: "n3",
          title: "Jack Doohan Unharmed After High-Speed Crash During Japanese GP Practice",
          date: "2025-04-05",
          url: "https://motorsportexclusive.com/news/formula/f1/article-3",
        },
        {
          id: "n4",
          title: "Trackside Fires and Multiple Red Flags Disrupt Japanese GP Practice Sessions",
          date: "2025-04-05",
          url: "https://motorsportexclusive.com/news/formula/f1/article-4",
        },
        {
          id: "n5",
          title: "Lando Norris Tops Japanese Grand Prix Qualifying Sessions",
          date: "2025-04-05",
          url: "https://motorsportexclusive.com/news/formula/f1/article-5",
        },
        {
          id: "n6",
          title: "Norris Tops Bahrain FP1 with Blistering Lap",
          date: "2025-04-11",
          url: "https://motorsportexclusive.com/news/formula/f1/article-6",
        },
        {
          id: "n7",
          title: "Gasly Stuns with P2 in Bahrain FP1",
          date: "2025-04-11",
          url: "https://motorsportexclusive.com/news/formula/f1/article-7",
        },
        {
          id: "n8",
          title: "Hamilton Takes P3 in Bahrain FP1",
          date: "2025-04-11",
          url: "https://motorsportexclusive.com/news/formula/f1/article-8",
        },
        {
          id: "n9",
          title: "Rookies Shine in Bahrain FP1",
          date: "2025-04-11",
          url: "https://motorsportexclusive.com/news/formula/f1/article-9",
        },
        {
          id: "n10",
          title: "Antonelli Hits Trouble in Bahrain FP1",
          date: "2025-04-11",
          url: "https://motorsportexclusive.com/news/formula/f1/article-10",
        },
        {
          id: "n11",
          title: "Williams Fined €7,500 in Bahrain FP1",
          date: "2025-04-11",
          url: "https://motorsportexclusive.com/news/formula/f1/article-11",
        },
      ],
      
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.fetchNews();
    this.setupInfiniteScroll();
    this.setupAnimations();
    setInterval(() => this.refreshNews(), 300000); // 5 minutes
    // Update footer year
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  setupEventListeners() {
    this.categoryFilter.addEventListener("change", (e) => {
      this.currentCategory = e.target.value;
      this.page = 1;
      this.displayedArticles.clear();
      this.newsContainer.innerHTML = "";
      this.updateActiveCategory();
      this.fetchNews();
    });

    const menuLinks = document.querySelectorAll(".category-links a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const category = e.target.dataset.category;
        if (category) {
          this.currentCategory = category;
          this.categoryFilter.value = category;
          this.page = 1;
          this.displayedArticles.clear();
          this.newsContainer.innerHTML = "";
          this.updateActiveCategory();
          this.fetchNews();
          this.toggleMenu();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (
        !this.menu.contains(e.target) &&
        !e.target.classList.contains("menu-toggle") &&
        this.menu.classList.contains("show")
      ) {
        this.toggleMenu();
      }
    });
  }

  toggleMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    this.menu.classList.toggle("show");
    menuToggle.innerHTML = this.menu.classList.contains("show") ? "×" : "☰";
    document.body.style.overflow = this.menu.classList.contains("show") ? "hidden" : "auto";
  }

  async fetchNews() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.loadingSpinner.style.display = "block";

    try {
      const response = await this.getArticles();
      this.renderNews(response);
    } catch (error) {
      console.error("Error fetching news:", error);
      this.newsContainer.innerHTML += "<p>Error loading news. Please try again later.</p>";
    } finally {
      this.isLoading = false;
      this.loadingSpinner.style.display = "none";
    }
  }

  getArticles() {
    return new Promise((resolve) => {
      setTimeout(() => {
        let news = [];
        if (this.currentCategory === "all") {
          news = Object.values(this.articles)
            .flat()
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
          news = [...(this.articles[this.currentCategory] || [])].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        }

        const start = (this.page - 1) * 10;
        const end = start + 10;
        const paginatedNews = news.slice(start, end);
        resolve(paginatedNews);
      }, 1000); // Simulated API delay
    });
  }

  renderNews(news) {
    if (news.length === 0 && this.page === 1) {
      this.newsContainer.innerHTML = "<p>More RACES will be covered soon.</p>";
      return;
    }

    const newArticles = news.filter((item) => !this.displayedArticles.has(item.id));

    newArticles.forEach((item) => {
      const newsItem = document.createElement("div");
      newsItem.className = "news-item";
      newsItem.innerHTML = `
        <a href="${item.url}" target="_blank">
          <h3>${item.title}</h3>
          <p>Date: ${item.date}</p>
        </a>
      `;
      this.newsContainer.appendChild(newsItem);
      this.displayedArticles.add(item.id);
      setTimeout(() => newsItem.classList.add("show"), 100);
    });

    if (newArticles.length > 0) {
      this.page++;
    }
  }

  updateActiveCategory() {
    const menuLinks = document.querySelectorAll(".category-links a");
    menuLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.category === this.currentCategory) {
        link.classList.add("active");
      }
    });
  }

  setupInfiniteScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.isLoading) {
          this.fetchNews();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(this.loadingSpinner);
  }

  setupAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".company-info, .news-item").forEach((el) => observer.observe(el));
  }

  refreshNews() {
    this.fetchNews();
  }

  updateArticle(category, newArticle) {
    if (this.articles[category]) {
      const index = this.articles[category].findIndex(
        (article) => article.id === newArticle.id
      );
      if (index !== -1) {
        this.articles[category][index] = newArticle;
      } else {
        this.articles[category].push(newArticle);
      }
      if (this.currentCategory === category || this.currentCategory === "all") {
        this.fetchNews();
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new MotorsportApp();
  window.toggleMenu = app.toggleMenu.bind(app);
});