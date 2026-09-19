/**
 * 🌴 Confirmation & Database Save Logic (Step 3)
 */

document.addEventListener("DOMContentLoaded", () => {
  const session = window.DATE_DB ? window.DATE_DB.getCurrentSession() : {};
  const config = window.DATE_CONFIG || {};

  const nameElem = document.getElementById("ticketName");
  const dobElem = document.getElementById("ticketDob");
  const placesElem = document.getElementById("ticketPlaces");
  const areaElem = document.getElementById("ticketArea");
  const hostElem = document.getElementById("ticketHost");
  const serialElem = document.getElementById("ticketSerial");
  const confirmBtn = document.getElementById("confirmBtn");
  const consentCheck = document.getElementById("consentCheck");

  // Populate Ticket
  const name = session.name || "Sundari";
  nameElem.textContent = name + " 🌸";

  if (session.dob) {
    const zodiacText = session.zodiac ? ` (${session.zodiac})` : "";
    dobElem.textContent = `${session.dob}${zodiacText} 🎂`;
  } else {
    dobElem.textContent = "Mystery Birthday 🎈";
  }

  // Places Badges
  const places = session.places || [];
  if (session.customPlace) {
    places.push("✨ " + session.customPlace);
  }

  if (places.length > 0) {
    placesElem.innerHTML = places.map(p => `<span class="ticket-badge-tag">${escapeHtml(p)}</span>`).join("");
  } else {
    placesElem.innerHTML = `<span class="ticket-badge-tag">Surprise Date Spot 🏖️</span>`;
  }

  areaElem.textContent = (session.area || "Any cozy spot in Kerala") + " 📍";
  hostElem.textContent = (config.yourName || "Gautham") + " ☕";
  serialElem.textContent = "#KL-" + Math.floor(1000 + Math.random() * 9000) + "-LOVE";

  // Handle Date Locking & Database Submission
  confirmBtn.addEventListener("click", async () => {
    if (!consentCheck.checked) {
      if (window.APP) window.APP.showToast("Please check the agreement box first! 🥰");
      return;
    }

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = "Locking in Kerala Registry... 💖🔐";

    if (window.APP) window.APP.playSound("celebrate");

    try {
      // Submit to unified database (localStorage + Supabase/Webhook)
      await window.DATE_DB.submitProposal(session);
      
      // Clear temporary draft session
      window.DATE_DB.clearCurrentSession();

      setTimeout(() => {
        window.location.href = "success.html";
      }, 700);
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback redirect anyway
      window.location.href = "success.html";
    }
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
