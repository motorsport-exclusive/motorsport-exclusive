(function() {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  let isOpen = false;

  function toggleMenu() {
      isOpen = !isOpen;
      sidebar.style.left = isOpen ? '0' : '-250px';
      menuToggle.setAttribute('aria-expanded', isOpen);
  }

  function closeMenu() {
      if (isOpen) {
          isOpen = false;
          sidebar.style.left = '-250px';
          menuToggle.setAttribute('aria-expanded', 'false');
      }
  }

  menuToggle.addEventListener('click', toggleMenu);

  document.addEventListener('click', function(e) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
          closeMenu();
      }
  });

  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
          closeMenu();
      }
  });

  window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && isOpen) {
          closeMenu();
      }
  });
})();
window.location.reload(true);
