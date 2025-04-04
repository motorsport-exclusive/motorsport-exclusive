// Popup functionality (unchanged)
document.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("popupShown")) {
    document.getElementById("popup").style.display = "block";
    sessionStorage.setItem("popupShown", "true");
  }
});

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

document.getElementById("homeButton").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent the default action of the link
  // Add logic to navigate to the home section if needed
});

// Dropdown menu functionality
function toggleMenu() {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const content = document.querySelector(".content");

  // Toggle the 'show' class for dropdown
  menu.classList.toggle("show");

  // Update aria-expanded attribute
  const isExpanded = menu.classList.contains("show");
  menuToggle.setAttribute("aria-expanded", isExpanded);

  // Handle content positioning
  if (isExpanded) {
    // Calculate actual menu height after it's shown
    const menuHeight = menu.offsetHeight;
    content.style.transition = "transform 0.3s ease-in-out";

    // For mobile devices (≤ 768px)
    if (window.innerWidth <= 768) {
      content.style.transform = `translateY(${menuHeight}px)`;
      document.body.classList.add("menu-open");
    } else {
      // Desktop behavior
      content.style.transform = `translateY(${menuHeight}px)`;
      document.body.style.overflow = "hidden";
    }
  } else {
    closeMenu();
  }
}

// Close menu function
function closeMenu() {
  const menu = document.getElementById("menu");
  const content = document.querySelector(".content");
  const menuToggle = document.querySelector(".menu-toggle");

  menu.classList.remove("show");
  content.style.transform = "translateY(0)";
  document.body.classList.remove("menu-open");
  document.body.style.overflow = "";
  menuToggle.setAttribute("aria-expanded", "false");
}

// Close menu when clicking/tapping outside
document.addEventListener("click", function (event) {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");

  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

// Fix for touchscreen devices - Close menu when tapping outside
document.addEventListener("touchstart", function (event) {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");

  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

// Close menu when tapping on a menu item
document.getElementById("menu").addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    closeMenu();
  }
});

// Detect touch devices and adjust behavior
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (!isTouchDevice) {
  // Only use onmouseleave for non-touch devices (desktop)
  document.getElementById("menu").addEventListener("mouseleave", closeMenu);
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");

  menu.classList.toggle("show");
  document.body.classList.toggle("menu-open");

  // Update aria-expanded attribute
  menuToggle.setAttribute("aria-expanded", menu.classList.contains("show"));
}
function toggleMenu() {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");

  // Toggle menu visibility
  menu.classList.toggle("show");

  // Change button icon based on menu state
  if (menu.classList.contains("show")) {
    menuToggle.innerHTML = "&times;"; // Close icon (✖)
  } else {
    menuToggle.innerHTML = "&#9776;"; // Hamburger icon (☰)
  }
}

// Close menu function
function closeMenu() {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");

  menu.classList.remove("show");
  menuToggle.innerHTML = "&#9776;"; // Reset to hamburger icon
}

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const menu = document.getElementById("menu");
  const menuToggle = document.querySelector(".menu-toggle");

  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});
//dropdown latest
function toggleFrame() {
  var frameContainer = document.getElementById("frameContainer");
  if (
    frameContainer.style.display === "none" ||
    frameContainer.style.display === ""
  ) {
    frameContainer.style.display = "block";
  } else {
    frameContainer.style.display = "none";
  }
}
//dropdown latest ended
