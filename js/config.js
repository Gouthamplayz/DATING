/**
 * 🌴 ORU DATE? (Kerala Version) - Configuration
 * -------------------------------------------------------------
 * Anyone forking this repository on GitHub can easily customize
 * this file with their own details in less than 1 minute!
 */

const CONFIG = {
  // 💖 Basic Details
  yourName: "Gautham",             // Your name (the one asking out)
  crushName: "Pennee",             // Default nickname/name if none provided
  proposalQuestion: "Oru Date povamoo?", // Proposal title in Malayalam
  proposalSubtitle: "From Kozhikode beach ice orathi to Munnar mist... oru chaya kudichu samsarikkan varumo? ☕🌴",
  
  // 📱 WhatsApp Notification (Optional but recommended!)
  // Put your international phone number with country code without '+' or spaces.
  // Example for India: "919876543210"
  whatsappNumber: "919876543210", 

  // 🔐 Admin Dashboard Passcode (Used to view stored responses on admin.html)
  adminPasscode: "1234",

  // ☁️ Optional Cloud Database (Supabase)
  // If you want responses synced to a remote cloud database for free:
  // 1. Create a free project at https://supabase.com
  // 2. Run the SQL script from database/supabase.sql in Supabase SQL editor
  // 3. Paste your URL and anon key below. (Leave blank to use local storage + WhatsApp only!)
  supabase: {
    enabled: false,
    url: "https://your-project.supabase.co",
    anonKey: "your-anon-key-here"
  },

  // 🌐 Optional Webhook URL (e.g. Discord, Formspree, SheetDB, Telegram bot)
  // If set, every date confirmation will also POST payload JSON to this URL.
  webhookUrl: "",

  // 🎭 Playful Malayalam phrases when she tries to hover or click "No":
  evasionPhrases: [
    "No? Athu nadakkilla! 😜",
    "Ayyada, angane ippo vendennu vekkanda! 😂",
    "Scene aanu tto, No option illa! 🙅‍♀️",
    "Njan vidaan udheshichittilla! 🏃‍♂️💨",
    "Munnar-il kondu povaam, Yes para! 🍃",
    "Kalyanam onnum alla, just oru date! 🙈",
    "Chaya & Parippuvada medichu tharaam! ☕",
    "Avale nokkikke, No parayan nokkunnu! 🤭",
    "Click cheyyan pattillallo he he! 🚀",
    "Yes mathram aanu valid option! 💖"
  ]
};

// Make config globally available
window.DATE_CONFIG = CONFIG;
