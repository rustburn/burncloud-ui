(() => {
  const body = document.body;
  const sidebar = document.getElementById('sidebar');
  const toggles = document.querySelectorAll('[aria-controls="sidebar"]');
  const closers = document.querySelectorAll('[data-close-sidebar]');

  if (!sidebar) return;

  const setOpen = (open) => {
    body.classList.toggle('sidebar-open', open);
    toggles.forEach((button) => button.setAttribute('aria-expanded', String(open)));
    if (open) sidebar.querySelector('a')?.focus();
  };

  toggles.forEach((button) => button.addEventListener('click', () => setOpen(true)));
  closers.forEach((button) => button.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
})();

