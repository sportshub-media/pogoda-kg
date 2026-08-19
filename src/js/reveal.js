// Subtle scroll-reveal for homepage/city-page sections — fades and lifts each
// .defer-render section into place the first time it nears the viewport.
// Progressive enhancement: the "hidden" class is only added here, so if this
// script never runs, sections stay visible by default rather than stuck at
// opacity:0.
export function initScrollReveal() {
  const sections = document.querySelectorAll('.defer-render');
  if (!sections.length) return;

  sections.forEach(section => section.classList.add('reveal-init'));

  if (!('IntersectionObserver' in window)) {
    sections.forEach(section => section.classList.add('is-visible'));
    return;
  }

  const reveal = (section) => {
    section.classList.add('is-visible');
    observer.unobserve(section);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  sections.forEach(section => observer.observe(section));

  // Safety net: an instant scroll jump (scrollbar drag, End key, some fast
  // flings) can skip a section without the browser ever painting a frame
  // where it intersects the viewport, so the observer above never fires for
  // it. A rAF-throttled scroll sweep catches anything already scrolled past.
  let ticking = false;
  const sweep = () => {
    ticking = false;
    document.querySelectorAll('.defer-render.reveal-init:not(.is-visible)').forEach(section => {
      // top below the viewport bottom means the section hasn't been reached
      // yet — anything else is either currently visible or already scrolled
      // past, both of which should be revealed.
      if (section.getBoundingClientRect().top < window.innerHeight) reveal(section);
    });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(sweep); }
  }, { passive: true });
}
