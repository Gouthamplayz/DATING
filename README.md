# 🌴 Oru Date? — Kerala Romantic Date Planner (GitHub Edition) 💖

A lovable, aesthetic, multi-page web application to ask someone on a date (Kerala Style), featuring the viral **un-rejectable runaway "No" button**, **Date of Birth (DOB) picker**, **Kerala date spots selector**, **built-in database with admin dashboard**, and **1-click WhatsApp notifications**.

Designed specifically to be deployed on **GitHub Pages for free in less than 2 minutes** so you and your friends can easily customize and share it!

---

## ✨ Features

- 🏃‍♂️ **Un-rejectable Runaway "No" Button**: Hovering or tapping "No" makes the button dodge across the screen with hilarious Malayalam comebacks (*"Ayyada!"*, *"No option illa tto!"*, *"Scene aanu!"*), while the **"Yes" button grows bigger and glows**!
- 🎂 **Step 1: DOB & Name Picker (`details.html`)**: Enter Name & Birthday with cute Kerala banter (*"Jathakam nokkaan alla tto, birthday special aakkaan aanu! 🎁"*), auto-detecting zodiac signs & age!
- 🏖️ **Step 2: Kerala Date Spots (`place.html`)**: Interactive cards for Kozhikode/Fort Kochi Beach (sunset & ice orathi), Aesthetic Cafés (cold brews & brownies), Lulu Mall (games & food), Alleppey Backwaters & Chaya, Munnar Mist, Movie + Biriyani, and custom spots!
- 🎟️ **Step 3: Official Kerala Date Pass (`confirm.html`)**: Styled as a romantic golden VIP pass that locks choices into the database.
- 🥳 **Celebration & WhatsApp Direct Send (`success.html`)**: Exploding confetti with a direct button that generates a pre-formatted WhatsApp message directly to your phone.
- 🔐 **Built-in Database & Admin Dashboard (`admin.html`)**: View all accepted date proposals, see their DOB and chosen spots, and download CSV reports — no external backend server needed!
- 🎵 **Web Audio Synth**: Pleasant romantic chimes and cartoon boing sounds with zero external `.mp3` dependencies.

---

## 🚀 How to Use & Deploy on GitHub Pages (For You & Your Friends)

### Step 1: Fork or Clone this Repository
1. Click the **Fork** button on GitHub to create your own copy of this repository.

### Step 2: Customize Your Details in `js/config.js`
Open `js/config.js` and change these lines:
```javascript
const CONFIG = {
  yourName: "Gautham",            // Your name
  crushName: "Pennee",            // Her nickname or name
  whatsappNumber: "919876543210", // Your WhatsApp number with country code (e.g. 91 for India)
  adminPasscode: "1234",          // Passcode to unlock admin.html
  ...
};
```
Commit and save your changes!

### Step 3: Enable GitHub Pages (Free Hosting)
1. In your GitHub repository, go to **Settings** → **Pages** (on the left menu).
2. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main` (or `master`) and folder `/ (root)`
3. Click **Save**.
4. Within 60 seconds, GitHub will give you a live URL like:  
   `https://<your-username>.github.io/<repo-name>/`

**Send this link to your crush on WhatsApp or Instagram! 🥰**

---

## 🗄️ How the Database Works

GitHub Pages hosts static files and cannot run traditional backend servers. We solved this by creating a **multi-tier database engine** in `js/database.js`:

1. **Instant Client Database (Default - Zero Setup Required)**:
   - Every proposal accepted is stored in the browser with full timestamps.
   - Open `<your-url>/admin.html` and enter your passcode (default `1234`) to view the complete submissions table or download it as a **CSV file**.

2. **Instant WhatsApp Ping (Recommended)**:
   - When she finishes, the success screen has a **"Send Choices on WhatsApp"** button.
   - Tapping it sends you a message with her Name, DOB, Zodiac, and all chosen date spots directly to your WhatsApp!

3. **Optional Cloud Database (Supabase)**:
   - If you want submissions sent to a free cloud database:
     1. Create a free project at [supabase.com](https://supabase.com).
     2. Run the SQL script from `database/supabase.sql` in the Supabase SQL editor.
     3. Paste your Supabase Project URL and Anon Key in `js/config.js` and set `enabled: true`.

4. **Optional Webhook (Discord / Formspree / Google Sheets)**:
   - Add your webhook URL in `js/config.js` under `webhookUrl`.

---

## 📂 Project Structure

```text
├── index.html          # Page 1: Un-rejectable Proposal Screen
├── details.html        # Page 2: Name & DOB Picker (with Zodiac banter)
├── place.html          # Page 3: Kerala Date Spot Selector
├── confirm.html        # Page 4: Official Kerala Date Pass Review
├── success.html        # Page 5: Celebration & WhatsApp Share Button
├── admin.html          # Private Dashboard to view stored responses & export CSV
├── css/
│   └── style.css       # Romantic Kerala sunset & palm emerald design system
├── js/
│   ├── config.js       # Central configuration (Name, Phone, Passcode)
│   ├── database.js     # Multi-tier database & WhatsApp message generator
│   ├── app.js          # Evasive "No" button physics, audio synth, particles
│   ├── details.js      # DOB logic, age calculation, zodiac detector
│   ├── place.js        # Kerala date spots multi-select logic
│   ├── confirm.js      # Date Pass voucher rendering & submission
│   ├── success.js      # Confetti & celebration logic
│   └── admin.js        # Admin dashboard authentication & table rendering
└── database/
    └── supabase.sql    # PostgreSQL / Supabase table schema
```

---

## 💻 Local Development

To preview or test the website on your computer:
1. Double-click `index.html` to open it in any browser (Chrome, Edge, Safari, Firefox).
2. Or open the folder in VS Code and use the **Live Server** extension.

---

Made with ❤️ in Kerala 🌴🥥
