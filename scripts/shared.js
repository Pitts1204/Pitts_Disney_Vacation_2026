/* ============================================================
   SHARED NAVIGATION + UTILITIES
   - Handles all [data-day-link] navigation
   - Works for buttons, divs, and anchors
   - Centralized so every page behaves consistently
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  wireDataLinkNavigation();
});

/**
 * Attach click handlers to any element with data-day-link.
 * This powers:
 * - Index day cards
 * - "Next Day" nav buttons
 * - Quick-access buttons
 * - Return-to-index buttons
 * - Any element using data-day-link
 */
function wireDataLinkNavigation() {
  const navElements = document.querySelectorAll("[data-day-link]");

  navElements.forEach(el => {
    el.addEventListener("click", event => {
      const target = event.currentTarget;
      const link = target.dataset.dayLink;

      if (!link) return;

      // Prevent default behavior for buttons or anchors
      event.preventDefault();

      // Navigate to the linked page
      window.location.href = link;
    });
  });
}
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("loader-hidden");
    setTimeout(() => loader.remove(), 500);
  }
});
