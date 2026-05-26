/* ============================================================
   SIMPLE, STABLE NAVIGATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const navElements = document.querySelectorAll("[data-link]");

  navElements.forEach(el => {
    el.addEventListener("click", event => {
      const link = el.dataset.link;
      if (!link) return;

      event.preventDefault();
      window.location.href = link;
    });
  });
});
