// ---------- Cookie-Helfer ----------
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

// ---------- JSON laden ----------
fetch("turnen.json")
  .then((response) => response.json())
  .then((data) => {
    const names = data.list;

    const select = document.getElementById("nameSelect");
    const nameLabel = document.getElementById("selectedLabel"); // optional
    const h1Name = document.getElementById("h1name");

    // ---------- Person auswählen ----------
    function selectPerson(name) {
      if (!names[name]) return;

      h1Name.textContent = name;
      if (nameLabel) nameLabel.textContent = name;

      setCookie("selectedName", name, 30);

      const person = names[name];
      const sections = document.querySelectorAll(".video-section");

      sections.forEach((section) => {
        const geraet = section.dataset.geraet; // z.B. "barren"
        const level = person[geraet];          // z.B. "3"

        if (!level) return;

        const source = section.querySelector("source");
        const video = section.querySelector("video");

        source.src = `videos/${geraet}-p${level}.mp4`;
        video.load();

        const levelSpan = section.querySelector(".level");
        if (levelSpan) levelSpan.textContent = level;
      });
    }

    // ---------- Dropdown füllen ----------
    Object.keys(names)
      .sort((a, b) => a.localeCompare(b, "de"))
      .forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    // ---------- Auswahl ändern ----------
    select.addEventListener("change", (e) => {
      selectPerson(e.target.value);
    });

    // ---------- Cookie beim Laden prüfen ----------
    const savedName = getCookie("selectedName");
    if (savedName && names[savedName]) {
      select.value = savedName;
      selectPerson(savedName);
    }
  })
  .catch((error) => {
    console.error("Fehler beim Laden der JSON:", error);
  });
