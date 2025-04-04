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
          id: "f1",
          title: "Formula 1 Monaco Grand Prix Highlights",
          date: "2025-03-20",
          url: "https://motorsport.com/formula1/monaco",
        },
        {
          id: "f2",
          title: "Formula 1 Bahrain Season Opener",
          date: "2025-03-01",
          url: "https://motorsport.com/formula1/bahrain",
        },
      ],
      nascar: [
        {
          id: "n1",
          title: "Daytona 500 Shocker",
          date: "2025-02-15",
          url: "https://nascar.com/daytona-500",
        },
        {
          id: "n2",
          title: "Kyle Busch Takes Texas Victory",
          date: "2025-03-21",
          url: "https://nascar.com/texas-race",
        },
      ],
      indy: [
        {
          id: "i1",
          title: "Indy 500 Qualifying Results",
          date: "2025-03-18",
          url: "https://indycar.com/indy-500-qualifying",
        },
      ],
      lemans: [
        {
          id: "l1",
          title: "24 Hours of Le Mans Preview",
          date: "2025-03-23",
          url: "https://lemans.org/preview-2025",
        },
      ],
      superformula: [
        {
          id: "s1",
          title: "Super Formula Season Opener",
          date: "2025-03-10",
          url: "https://superformula.net/opener",
        },
      ],
      rally: [
        {
          id: "r1",
          title: "WRC Rally Sweden Recap",
          date: "2025-02-28",
          url: "https://wrc.com/sweden-2025",
        },
      ],
      motogp: [
        {
          id: "m1",
          title: "MotoGP Qatar Grand Prix",
          date: "2025-03-15",
          url: "https://motogp.com/qatar-2025",
        },
      ],
      imsa: [
        {
          id: "im1",
          title: "IMSA Sebring 12 Hours",
          date: "2025-03-17",
          url: "https://imsa.com/sebring-2025",
        },
      ],
      gt: [
        {
          id: "g1",
          title: "GT World Challenge Kickoff",
          date: "2025-03-19",
          url: "https://gtworldchallenge.com/kickoff",
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
      this.newsContainer.innerHTML = "<p>No articles available for this category.</p>";
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