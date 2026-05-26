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
    flights: 44.80,          // Delta cash portion
    hotels: 7452.36 + 3581.94, // Polynesian + Royal Pacific package
    tickets: 0,              // WDW tickets + Universal tickets are bundled in resort packages
    diningCommitted: 0,      // DDP is included in Polynesian total; keep 0 here
  },
  projected: {
    diningOutOfPocket: 750 + 600, // Disney LL snacks/extra + Universal dining rough combined
    snacks: 60,                   // Beach parking + snacks
    merch: 300,                   // Souvenirs + extras
    misc: 125,                    // Gas + tolls + misc
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
// --- Interactive Checklists (Action Items + Packing) ---

function createChecklistManager(listId, inputId, addBtnId, storageKey) {
  const listEl = document.getElementById(listId);
  const inputEl = document.getElementById(inputId);
  const addBtn = document.getElementById(addBtnId);

  if (!listEl || !inputEl || !addBtn) return;

  let items = [];

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      // ignore storage errors
    }
  }

  function render() {
    listEl.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");

      const label = document.createElement("span");
      label.textContent = item.text;
      label.className = "checklist-item-label" + (item.done ? " completed" : "");
      label.addEventListener("click", () => {
        items[index].done = !items[index].done;
        save();
        render();
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "checklist-remove";
      removeBtn.addEventListener("click", () => {
        items.splice(index, 1);
        save();
        render();
      });

      li.appendChild(label);
      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });
  }

  function addItem() {
    const text = inputEl.value.trim();
    if (!text) return;
    items.push({ text, done: false });
    inputEl.value = "";
    save();
    render();
  }

  // Load from storage
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      items = JSON.parse(stored);
    }
  } catch (e) {
    items = [];
  }

  addBtn.addEventListener("click", addItem);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addItem();
  });

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  initDDPTracker();
  initBudget();
  createChecklistManager("action-list", "action-input", "action-add-btn", "trip-actions");
  createChecklistManager("pack-list", "pack-input", "pack-add-btn", "trip-pack");
  createChecklistManager("prep-list", "prep-input", "prep-add-btn", "mk-day2-prep");
  createChecklistManager("nextday-list", "nextday-input", "nextday-add-btn", "mk-day2-nextday");
  createChecklistManager("prep-list", "prep-input", "prep-add-btn", "epcot-day3-prep");
  createChecklistManager("nextday-list", "nextday-input", "nextday-add-btn", "epcot-day3-nextday");
});

