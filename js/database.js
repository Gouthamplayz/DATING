/**
 * 🌴 Database & Sync Engine for Oru Date?
 * -------------------------------------------------------------
 * Works out-of-the-box on GitHub Pages with localStorage!
 * Also supports Supabase and Webhook syncing when configured.
 */

const DB = {
  STORAGE_KEY: "kerala_date_proposals_db",
  CURRENT_SESSION_KEY: "kerala_date_current_session",

  // Save partial session state as the user progresses through pages
  saveCurrentSession(data) {
    const existing = this.getCurrentSession();
    const updated = { ...existing, ...data };
    localStorage.setItem(this.CURRENT_SESSION_KEY, JSON.stringify(updated));
    return updated;
  },

  // Get current active session
  getCurrentSession() {
    try {
      return JSON.parse(localStorage.getItem(this.CURRENT_SESSION_KEY) || "{}");
    } catch (e) {
      return {};
    }
  },

  // Clear current active session
  clearCurrentSession() {
    localStorage.removeItem(this.CURRENT_SESSION_KEY);
  },

  // Finalize and save proposal submission to Database
  async submitProposal(payload) {
    const entry = {
      id: "dp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: payload.name || "Sundari",
      dob: payload.dob || "",
      age: payload.age || null,
      zodiac: payload.zodiac || "",
      places: payload.places || [],
      customPlace: payload.customPlace || "",
      area: payload.area || "",
      createdAt: new Date().toISOString(),
      status: "Accepted 💖"
    };

    // 1. Save to local storage database
    const allRecords = this.getAllProposals();
    allRecords.unshift(entry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allRecords));

    // Also store last confirmed submission for success screen
    localStorage.setItem("kerala_date_last_confirmed", JSON.stringify(entry));

    const syncResults = {
      local: true,
      supabase: false,
      webhook: false
    };

    // 2. Sync to Supabase if enabled
    const config = window.DATE_CONFIG || {};
    if (config.supabase && config.supabase.enabled && config.supabase.url && config.supabase.anonKey) {
      try {
        const response = await fetch(`${config.supabase.url}/rest/v1/date_proposals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": config.supabase.anonKey,
            "Authorization": `Bearer ${config.supabase.anonKey}`,
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            name: entry.name,
            dob: entry.dob,
            places: entry.places,
            area: entry.area,
            custom_place: entry.customPlace,
            notes: `Zodiac: ${entry.zodiac}, Age: ${entry.age}`
          })
        });
        if (response.ok) syncResults.supabase = true;
      } catch (err) {
        console.warn("Supabase sync failed (offline or config issue):", err);
      }
    }

    // 3. Dispatch to Webhook if provided
    if (config.webhookUrl && config.webhookUrl.trim() !== "") {
      try {
        const res = await fetch(config.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `🌴 **New Date Proposal Accepted!** 💖\n**Name:** ${entry.name}\n**DOB:** ${entry.dob} (${entry.zodiac})\n**Places:** ${entry.places.join(", ")}\n**Area:** ${entry.area || "N/A"}`,
            data: entry
          })
        });
        if (res.ok) syncResults.webhook = true;
      } catch (err) {
        console.warn("Webhook dispatch failed:", err);
      }
    }

    return { entry, syncResults };
  },

  // Get all proposals stored in browser database
  getAllProposals() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  },

  // Delete a specific proposal
  deleteProposal(id) {
    const list = this.getAllProposals().filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    return list;
  },

  // Clear all database records
  clearAllProposals() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  // Generate WhatsApp Direct Send Link with preformatted love message
  getWhatsAppShareLink(entry) {
    const config = window.DATE_CONFIG || {};
    const phone = (config.whatsappNumber || "").replace(/[^0-9]/g, "");
    
    const placesText = (entry.places && entry.places.length > 0) 
      ? entry.places.join(", ") 
      : "Surprise date spot!";
      
    const customText = entry.customPlace ? ` (${entry.customPlace})` : "";
    
    const msg = 
`🌴 *Oru Date Confirmed!* 💖
━━━━━━━━━━━━━━━━━
Hey ${config.yourName || "Machane"}! Njan date proposal accept cheythu! 🥰

👤 *Name:* ${entry.name}
🎂 *Birthday:* ${entry.dob} ${entry.zodiac ? '(' + entry.zodiac + ')' : ''}
📍 *Places I want to go:* ${placesText}${customText}
🗺️ *Area:* ${entry.area || "Any nice place in Kerala"}

Set aayallo! Eppozha povunne? 🌸✨`;

    const encoded = encodeURIComponent(msg);
    return phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  },

  // Export submissions to CSV for GitHub repo owner
  exportToCSV() {
    const records = this.getAllProposals();
    if (records.length === 0) return null;

    const headers = ["ID", "Name", "DOB", "Age", "Zodiac", "Places", "Area", "Custom Place", "Submitted At"];
    const rows = records.map(r => [
      r.id,
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${r.dob || ""}"`,
      r.age || "",
      `"${r.zodiac || ""}"`,
      `"${(r.places || []).join("; ")}"`,
      `"${(r.area || "").replace(/"/g, '""')}"`,
      `"${(r.customPlace || "").replace(/"/g, '""')}"`,
      `"${r.createdAt || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    return encodeURI(csvContent);
  }
};

window.DATE_DB = DB;
