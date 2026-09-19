/**
 * 🌴 Admin Dashboard Management Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  const authCard = document.getElementById("authCard");
  const dashboardCard = document.getElementById("dashboardCard");
  const authForm = document.getElementById("authForm");
  const passcodeInput = document.getElementById("passcodeInput");
  const tableBody = document.getElementById("proposalsTableBody");
  const emptyState = document.getElementById("emptyState");
  const totalCountElem = document.getElementById("totalProposalsCount");
  const favoriteSpotElem = document.getElementById("favoriteSpot");
  const latestDateElem = document.getElementById("latestDate");
  const exportCsvBtn = document.getElementById("exportCsvBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const lockBtn = document.getElementById("lockDashboardBtn");

  const config = window.DATE_CONFIG || {};
  const correctPasscode = config.adminPasscode || "1234";

  // Check if session is already unlocked
  if (sessionStorage.getItem("admin_authenticated") === "true") {
    showDashboard();
  }

  // Handle Passcode Unlock
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = passcodeInput.value.trim();

    if (entered === correctPasscode) {
      sessionStorage.setItem("admin_authenticated", "true");
      if (window.APP) window.APP.playSound("celebrate");
      showDashboard();
    } else {
      if (window.APP) {
        window.APP.playSound("boing");
        window.APP.showToast("Wrong passcode! Check js/config.js 🔐");
      }
      passcodeInput.value = "";
      passcodeInput.focus();
    }
  });

  // Lock Dashboard
  lockBtn.addEventListener("click", () => {
    sessionStorage.removeItem("admin_authenticated");
    dashboardCard.style.display = "none";
    authCard.style.display = "block";
    passcodeInput.value = "";
  });

  function showDashboard() {
    authCard.style.display = "none";
    dashboardCard.style.display = "block";
    renderTable();
  }

  // Render Table & Statistics
  function renderTable() {
    const list = window.DATE_DB ? window.DATE_DB.getAllProposals() : [];
    tableBody.innerHTML = "";

    totalCountElem.textContent = list.length;

    if (list.length === 0) {
      emptyState.style.display = "block";
      favoriteSpotElem.textContent = "None";
      latestDateElem.textContent = "N/A";
      return;
    }

    emptyState.style.display = "none";

    // Compute top spot
    const spotCounts = {};
    list.forEach(item => {
      (item.places || []).forEach(p => {
        spotCounts[p] = (spotCounts[p] || 0) + 1;
      });
    });

    let topSpot = "Surprise";
    let maxCount = 0;
    for (const [spot, count] of Object.entries(spotCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topSpot = spot.split("(")[0].trim();
      }
    }
    favoriteSpotElem.textContent = topSpot;

    // Latest Date
    const latestTime = new Date(list[0].createdAt);
    latestDateElem.textContent = isNaN(latestTime) ? "Recently" : latestTime.toLocaleDateString();

    // Fill table rows
    list.forEach(item => {
      const tr = document.createElement("tr");

      const placesBadges = (item.places || []).map(p => 
        `<span class="ticket-badge-tag">${escapeHtml(p)}</span>`
      ).join(" ");

      const customNote = item.customPlace ? `<br><small style="color:var(--gold-glow)">Note: ${escapeHtml(item.customPlace)}</small>` : "";

      const timeFormatted = item.createdAt 
        ? new Date(item.createdAt).toLocaleDateString() + ' ' + new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "Recent";

      tr.innerHTML = `
        <td><span class="badge-status">Accepted 💖</span></td>
        <td><strong>${escapeHtml(item.name || "Sundari")}</strong></td>
        <td>${escapeHtml(item.dob || "N/A")} 🎂</td>
        <td>${escapeHtml(item.zodiac || "—")} (Age: ${item.age || "N/A"})</td>
        <td>${placesBadges || "Surprise"}${customNote}</td>
        <td>${escapeHtml(item.area || "Kerala")}</td>
        <td style="font-size: 12px; color: var(--text-dim);">${timeFormatted}</td>
        <td>
          <button class="btn-del" data-id="${item.id}">Delete</button>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    // Attach row delete handlers
    document.querySelectorAll(".btn-del").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        if (confirm("Delete this date proposal record?")) {
          window.DATE_DB.deleteProposal(id);
          renderTable();
          if (window.APP) window.APP.showToast("Proposal deleted 🗑️");
        }
      });
    });
  }

  // Handle CSV Download
  exportCsvBtn.addEventListener("click", () => {
    const csvUrl = window.DATE_DB.exportToCSV();
    if (!csvUrl) {
      if (window.APP) window.APP.showToast("No proposals to export yet!");
      return;
    }

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = `kerala_date_proposals_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (window.APP) window.APP.showToast("CSV downloaded successfully! 📥");
  });

  // Handle Clear All
  clearAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear ALL saved proposals? This cannot be undone.")) {
      window.DATE_DB.clearAllProposals();
      renderTable();
      if (window.APP) window.APP.showToast("All database records cleared 🧹");
    }
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
});
