/**
 * 🌴 Places Selection Logic (Step 2)
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("placesForm");
  const areaInput = document.getElementById("dateArea");
  const customInput = document.getElementById("customSpot");
  const placeCards = document.querySelectorAll(".place-card");

  // Load existing session values
  const session = window.DATE_DB ? window.DATE_DB.getCurrentSession() : {};
  if (session.area) areaInput.value = session.area;
  if (session.customPlace) customInput.value = session.customPlace;

  const savedPlaces = session.places || [];

  // Initialize card selection states
  placeCards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (savedPlaces.includes(checkbox.value)) {
      checkbox.checked = true;
      card.classList.add("selected");
    }

    card.addEventListener("click", (e) => {
      // Toggle selection
      checkbox.checked = !checkbox.checked;
      if (checkbox.checked) {
        card.classList.add("selected");
        if (window.APP) window.APP.playSound("chime");
      } else {
        card.classList.remove("selected");
      }
    });
  });

  // Handle Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedCheckboxes = document.querySelectorAll('input[name="places"]:checked');
    const selectedPlaces = Array.from(selectedCheckboxes).map(cb => cb.value);
    const area = areaInput.value.trim();
    const customPlace = customInput.value.trim();

    if (selectedPlaces.length === 0 && !customPlace) {
      if (window.APP) {
        window.APP.showToast("Pick at least one fun place for our date! 🌸");
      }
      return;
    }

    // Save to active session
    window.DATE_DB.saveCurrentSession({
      places: selectedPlaces,
      area: area || "Anywhere in Kerala with good vibes",
      customPlace: customPlace
    });

    if (window.APP) window.APP.playSound("chime");
    window.location.href = "confirm.html";
  });
});
