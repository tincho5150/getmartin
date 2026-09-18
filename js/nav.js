/* Mobile navigation.
   The links are hidden below 768px by each page's own stylesheet, which left
   the site unnavigable on a phone. This adds the toggle that reveals them.
   The .js hook means that if this file never runs, the links stay visible in
   the bar rather than being hidden behind a button that does nothing. */
(function () {
  document.documentElement.classList.add('js');

  var nav = document.querySelector('.site-nav');
  var btn = nav && nav.querySelector('.nav-toggle');
  var menu = nav && nav.querySelector('.nav-menu');
  if (!nav || !btn || !menu) return;

  function setOpen(open) {
    nav.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('nav-open'));
  });

  // a link tap closes it, so the panel never covers the page you just chose
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
      setOpen(false);
      btn.focus();
    }
  });

  // tapping outside the panel closes it
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target)) setOpen(false);
  });

  // if the viewport grows past the breakpoint, drop the open state
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) setOpen(false);
  }, { passive: true });
})();
