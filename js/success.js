/**
 * 🌴 Success & Celebration Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  const summaryElem = document.getElementById("finalSummary");
  const whatsappBtn = document.getElementById("whatsappBtn");

  // Retrieve confirmed submission
  let record = null;
  try {
    record = JSON.parse(localStorage.getItem("kerala_date_last_confirmed") || "null");
  } catch (e) {}

  if (!record && window.DATE_DB) {
    const list = window.DATE_DB.getAllProposals();
    if (list.length > 0) record = list[0];
  }

  if (record) {
    const name = record.name || "Sundari";
    const places = (record.places && record.places.length > 0) 
      ? record.places.join(", ") 
      : "Surprise spot";
    const dobText = record.dob ? `Birthday: <strong>${record.dob}</strong> (${record.zodiac || 'Special day'})` : "";

    summaryElem.innerHTML = `
      <strong>${escapeHtml(name)}</strong>'s Date is Confirmed! 🌸<br>
      Spots: <strong>${escapeHtml(places)}</strong><br>
      ${dobText ? dobText + '<br>' : ''}
      Location: <strong>${escapeHtml(record.area || "Kerala")}</strong>
    `;

    // Setup WhatsApp Link
    if (window.DATE_DB) {
      whatsappBtn.href = window.DATE_DB.getWhatsAppShareLink(record);
    }
  } else {
    summaryElem.innerHTML = `Date confirmed! Looking forward to having the best time ever! 🌴✨`;
    whatsappBtn.href = "https://wa.me/";
  }

  // Play celebration audio
  if (window.APP) {
    window.APP.playSound("celebrate");
  }

  // Launch confetti celebration
  launchConfetti();

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Lightweight custom canvas confetti burst
  function launchConfetti() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const confettiPieces = [];
    const colors = ['#ff4d6d', '#f6c453', '#10b981', '#ffffff', '#ff758f', '#38bdf8'];

    for (let i = 0; i < 80; i++) {
      confettiPieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        opacity: 1
      });
    }

    let frame = 0;
    function update() {
      if (frame > 140) return; // Stop after ~2.5 seconds
      frame++;

      confettiPieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.007;

        if (p.opacity > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      requestAnimationFrame(update);
    }

    update();
  }
});
