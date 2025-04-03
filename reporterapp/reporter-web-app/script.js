function toggleMenu() {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");

  menu.classList.toggle("show");
  menuToggle.innerHTML = menu.classList.contains("show") ? "×" : "☰";
}

function closeMenu() {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");

  menu.classList.remove("show");
  menuToggle.innerHTML = "☰";
}

document.addEventListener("click", (event) => {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");

  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

document.getElementById("menu").addEventListener("click", (event) => {
  if (event.target.closest(".nav-item")) {
    closeMenu();
  }
});

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (!isTouchDevice) {
  document.getElementById("menu").addEventListener("mouseleave", closeMenu);
}
