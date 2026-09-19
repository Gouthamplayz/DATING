/**
 * 🌴 Details & DOB Handler (Step 1)
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("detailsForm");
  const nameInput = document.getElementById("userName");
  const dobInput = document.getElementById("userDob");
  const previewBox = document.getElementById("zodiacPreview");
  const zodiacBadge = document.getElementById("zodiacBadge");

  // Load any existing session values
  const session = window.DATE_DB ? window.DATE_DB.getCurrentSession() : {};
  if (session.name) nameInput.value = session.name;
  if (session.dob) {
    dobInput.value = session.dob;
    updateZodiac(session.dob);
  }

  // Calculate Zodiac Sign & Age
  function getZodiacSign(day, month) {
    const zodiacSigns = [
      { name: "Capricorn ♑", endDay: 19 },
      { name: "Aquarius ♒", endDay: 18 },
      { name: "Pisces ♓", endDay: 20 },
      { name: "Aries ♈", endDay: 19 },
      { name: "Taurus ♉", endDay: 20 },
      { name: "Gemini ♊", endDay: 20 },
      { name: "Cancer ♋", endDay: 22 },
      { name: "Leo ♌", endDay: 22 },
      { name: "Virgo ♍", endDay: 22 },
      { name: "Libra ♎", endDay: 22 },
      { name: "Scorpio ♏", endDay: 21 },
      { name: "Sagittarius ♐", endDay: 21 },
      { name: "Capricorn ♑", endDay: 31 }
    ];
    return (day > zodiacSigns[month - 1].endDay) ? zodiacSigns[month].name : zodiacSigns[month - 1].name;
  }

  function updateZodiac(dobString) {
    if (!dobString) {
      previewBox.style.display = "none";
      return;
    }

    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return;

    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear();

    const today = new Date();
    let age = today.getFullYear() - year;
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < day)) {
      age--;
    }

    const zodiac = getZodiacSign(day, month);

    zodiacBadge.innerHTML = `✨ <strong>${zodiac}</strong> • Age ~${age > 0 ? age : 'N/A'} • Perfect Vibe! 🌸`;
    previewBox.style.display = "block";

    if (window.APP) window.APP.playSound('chime');
  }

  dobInput.addEventListener("change", (e) => {
    updateZodiac(e.target.value);
  });

  // Handle Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const dob = dobInput.value;

    if (!name) {
      if (window.APP) window.APP.showToast("Please enter your name 🌸");
      nameInput.focus();
      return;
    }

    if (!dob) {
      if (window.APP) window.APP.showToast("Please enter your birthday 🎂");
      dobInput.focus();
      return;
    }

    const birthDate = new Date(dob);
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const zodiac = getZodiacSign(day, month);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < day)) age--;

    // Save session
    window.DATE_DB.saveCurrentSession({
      name,
      dob,
      age,
      zodiac
    });

    if (window.APP) window.APP.playSound('chime');
    window.location.href = "place.html";
  });
});
