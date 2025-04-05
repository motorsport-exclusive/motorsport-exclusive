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
          id: "f3",
          title: "Mercedes' George Russell Leads Team's Steady Start to 2025 Season",
          date: "2025-04-04",
          url: "https://www.reuters.com/sports/formula1/russell-leading-way-mercedes-keep-calm-carry-2025-04-04/",
        },
        {
          id: "f4",
          title: "Yuki Tsunoda Impresses in Red Bull Debut at Japanese Grand Prix",
          date: "2025-04-04",
          url: "https://www.reuters.com/sports/formula1/japans-tsunoda-hits-his-mark-first-outing-with-red-bull-2025-04-04/",
        },
        {
          id: "f5",
          title: "Jack Doohan Unharmed After High-Speed Crash During Japanese GP Practice",
          date: "2025-04-05",
          url: "https://www.news.com.au/sport/motorsport/formula-one/aussie-jack-doohan-suffers-huge-crash-in-f1-qualifying-in-japan/news-story/1cd05381ed365759f4ecde2df663605f",
        },
        {
          id: "f6",
          title: "Trackside Fires and Multiple Red Flags Disrupt Japanese GP Practice Sessions",
          date: "2025-04-05",
          url: "https://www.thesun.co.uk/sport/34266781/f1-japan-gp-suspended-fire/",
        },
        {
          id: "f7",
          title: "Lando Norris Tops Japanese Grand Prix Qualifying Sessions",
          date: "2025-04-05",
          url: "https://www.theguardian.com/sport/live/2025/apr/05/f1-japanese-gp-live-blog-updates-start-time-qualifying-suzuka-circuit",
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