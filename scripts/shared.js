/* ============================================================
   SHARED NAVIGATION + UTILITIES
   - Handles all [data-day-link] navigation
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  wireDataLinkNavigation();
});

function wireDataLinkNavigation() {
  const navElements = document.querySelectorAll("[data-day-link]");

  navElements.forEach(el => {
    el.addEventListener("click", event => {
      const link = el.dataset.dayLink;
      if (!link) return;

      event.preventDefault();
      window.location.href = link;
    });
  });
}
