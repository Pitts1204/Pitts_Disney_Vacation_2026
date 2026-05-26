// --- Navigation to park pages ---
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-day-link]");
  if (!btn) return;
  const href = btn.getAttribute("data-day-link");
  if (href) {
    window.location.href = href;
  }
});

// --- DDP Credit Tracker (Dashboard) ---
const DDP_TOTAL_CREDITS = 56; // adjust as needed
const PARTY_SIZE = 4;

function updateDDPDisplay(used) {
  const totalEl = document.getElementById("ddp-total");
  const usedEl = document.getElementById("ddp-used");
  const remainingEl = document.getElementById("ddp-remaining");
  const warningEl = document.getElementById("ddp-warning");

  if (!totalEl || !usedEl || !remainingEl) return;

  totalEl.textContent = DDP_TOTAL_CREDITS;
  usedEl.textContent = used;
  remainingEl.textContent = Math.max(DDP_TOTAL_CREDITS - used, 0);

  if (warningEl) {
    const remaining = DDP_TOTAL_CREDITS - used;
    if (remaining <= 8 && remaining > 0) {
      warningEl.textContent = `Heads up: only ${remaining} credits left.`;
      warningEl.classList.remove("hidden");
    } else if (remaining <= 0) {
      warningEl.textContent = "All credits used. Any additional meals will be out-of-pocket.";
      warningEl.classList.remove("hidden");
    } else {
      warningEl.classList.add("hidden");
    }
  }
}

function initDDPTracker() {
  const mealButtons = document.querySelectorAll("[data-meal]");
  const resetBtn = document.getElementById("ddp-reset");
  if (!mealButtons.length || !resetBtn) return;

  let usedCredits = 0;
  updateDDPDisplay(usedCredits);

  mealButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const meals = Number(btn.getAttribute("data-meal")) || 1;
      usedCredits += meals * PARTY_SIZE;
      updateDDPDisplay(usedCredits);
    });
  });

  resetBtn.addEventListener("click", () => {
    usedCredits = 0;
    updateDDPDisplay(usedCredits);
  });
}

// --- Budget Model (Dashboard) ---
const budgetModel = {
  realized: {
    flights: 0,
    hotels: 0,
    tickets: 0,
    diningCommitted: 0,
  },
  projected: {
    diningOutOfPocket: 0,
    snacks: 0,
    merch: 0,
    misc: 0,
  },
};

function formatMoney(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function initBudget() {
  const r = budgetModel.realized;
  const p = budgetModel.projected;

  const realizedTotal = r.flights + r.hotels + r.tickets + r.diningCommitted;
  const projectedTotal = p.diningOutOfPocket + p.snacks + p.merch + p.misc;
  const overallTotal = realizedTotal + projectedTotal;

  const map = [
    ["budget-flights", r.flights],
    ["budget-hotels", r.hotels],
    ["budget-tickets", r.tickets],
    ["budget-dining-committed", r.diningCommitted],
    ["budget-realized-total", realizedTotal],
    ["budget-dining-projected", p.diningOutOfPocket],
    ["budget-snacks", p.snacks],
    ["budget-merch", p.merch],
    ["budget-misc", p.misc],
    ["budget-projected-total", projectedTotal],
    ["budget-overall-total", overallTotal],
  ];

  map.forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatMoney(value);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDDPTracker();
  initBudget();
});
