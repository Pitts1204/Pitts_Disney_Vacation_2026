/* ============================================================
   CINEMATIC THEME ENGINE — HYBRID MODE + DATE LOCK
   Controls:
   - Preview Mode (before trip)
   - Live Mode (during trip)
   - Dynamic hero banners
   - Glow accents
   - Park-specific typography
   - Smart Continue Trip logic
   ============================================================ */

/* -----------------------------
   1. TRIP DATE CONFIGURATION
----------------------------- */
const tripDays = {
  1: "2026-07-12",
  2: "2026-07-13",
  3: "2026-07-14",
  4: "2026-07-15",
  5: "2026-07-16",
  6: "2026-07-17",
  7: "2026-07-18",
  8: "2026-07-19"
};

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function getCurrentTripDay() {
  const today = getTodayDateString();
  for (const day in tripDays) {
    if (tripDays[day] === today) return parseInt(day);
  }
  return null;
}

/* -----------------------------
   2. THEME DEFINITIONS
----------------------------- */
const themes = {
  1: {
    name: "Travel Day",
    mode: "light",
    glow: "soft-blue",
    font: "clean-sans",
    banner: "travel",
    title: "Travel Day",
    subtitle: "Your adventure begins"
  },
  2: {
    name: "Magic Kingdom",
    mode: "light",
    glow: "gold",
    font: "storybook-serif",
    banner: "mk",
    title: "Magic Kingdom",
    subtitle: "Fantasy · Adventure · Wonder"
  },
  3: {
    name: "EPCOT",
    mode: "dark",
    glow: "purple-neon",
    font: "futuristic-geo",
    banner: "epcot",
    title: "EPCOT",
    subtitle: "Neon Future · Discovery"
  },
  4: {
    name: "Hollywood Studios",
    mode: "dark",
    glow: "red-cinematic",
    font: "bold-cinematic",
    banner: "hs",
    title: "Hollywood Studios",
    subtitle: "Action · Adventure · Galaxy"
  },
  5: {
    name: "Animal Kingdom",
    mode: "light",
    glow: "green-jungle",
    font: "adventure-serif",
    banner: "ak",
    title: "Animal Kingdom",
    subtitle: "Nature · Exploration · Discovery"
  },
  6: {
    name: "Epic Universe",
    mode: "dark",
    glow: "electric-blue",
    font: "cosmic-sans",
    banner: "epic",
    title: "Epic Universe",
    subtitle: "Cosmic Worlds · Mario Adventures"
  },
  7: {
    name: "Universal Studios / IOA",
    mode: "dark",
    glow: "comic-yellow",
    font: "comic-bold",
    banner: "universal",
    title: "Universal Studios / IOA",
    subtitle: "Adventure Worlds · Thrills"
  },
  8: {
    name: "Travel Home",
    mode: "light",
    glow: "soft-blue",
    font: "clean-sans",
    banner: "travel-home",
    title: "Travel Home",
    subtitle: "Safe travels"
  }
};

/* -----------------------------
   3. APPLY THEME TO PAGE
----------------------------- */
function applyTheme(day, isLiveMode = false) {
  const theme = themes[day];
  if (!theme) return;

  const body = document.body;
  const hero = document.getElementById("hero-banner");
  const title = document.getElementById("hero-title");
  const subtitle = document.getElementById("hero-subtitle");
  const modeIndicator = document.getElementById("mode-indicator");

  // Reset classes
  body.className = "dashboard";
  hero.className = "hero-banner";

  // Apply mode (dark/light)
  body.classList.add(theme.mode);

  // Apply glow accent
  body.classList.add(`glow-${theme.glow}`);

  // Apply font family
  body.classList.add(`font-${theme.font}`);

  // Apply hero banner background
  hero.classList.add(`banner-${theme.banner}`);

  // Update text
  title.textContent = theme.title;
  subtitle.textContent = theme.subtitle;

  // Mode indicator
  modeIndicator.textContent = isLiveMode ? "Live Mode" : "Preview Mode";
}

/* -----------------------------
   4. PREVIEW MODE (Before Trip)
----------------------------- */
function enablePreviewMode() {
  const dayCards = document.querySelectorAll(".day-card");

  dayCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      const day = parseInt(card.dataset.day);
      applyTheme(day, false);
    });

    card.addEventListener("click", () => {
      const link = card.dataset.dayLink;
      window.location.href = link;
    });
  });
}

/* -----------------------------
   5. LIVE MODE (During Trip)
----------------------------- */
function enableLiveMode(currentDay) {
  applyTheme(currentDay, true);

  const dayCards = document.querySelectorAll(".day-card");

  // Disable theme preview
  dayCards.forEach(card => {
    card.addEventListener("mouseenter", e => e.stopPropagation());
  });

  // Still allow navigation
  dayCards.forEach(card => {
    card.addEventListener("click", () => {
      const link = card.dataset.dayLink;
      window.location.href = link;
    });
  });
}

/* -----------------------------
   6. CONTINUE TRIP BUTTON LOGIC
----------------------------- */
function updateContinueTripButton(currentDay) {
  const btn = document.getElementById("continue-trip-btn");

  if (!currentDay) {
    btn.textContent = "Start Trip";
    btn.onclick = () => window.location.href = "parks/Day1-Travel.html";
    return;
  }

  if (currentDay >= 1 && currentDay <= 8) {
    btn.textContent = `Continue Day ${currentDay}`;
    btn.onclick = () => {
      window.location.href = document.querySelector(
        `.day-card[data-day="${currentDay}"]`
      ).dataset.dayLink;
    };
    return;
  }

  // After trip
  btn.textContent = "View Memories";
  btn.onclick = () => alert("Memory page coming soon!");
}

/* -----------------------------
   7. INITIALIZE ENGINE
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const currentDay = getCurrentTripDay();

  updateContinueTripButton(currentDay);

  if (currentDay) {
    enableLiveMode(currentDay);
  } else {
    enablePreviewMode();
  }
});
