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

    // ---------- Hilfsfunktionen ----------
    function setVideo(section, geraet, level) {
      const source = section.querySelector("source");
      const video = section.querySelector("video");

      source.src = `videos/${geraet}-p${level}.mp4`;
      video.load();

      const levelSpan = section.querySelector(".level");
      if (levelSpan) levelSpan.textContent = level;
    }

    function removeClones(geraet) {
      document
        .querySelectorAll(`.video-section[data-clone-of="${geraet}"]`)
        .forEach((el) => el.remove());
    }

    // ---------- Person auswählen ----------
    function selectPerson(name) {
      if (!names[name]) return;

      h1Name.textContent = name;
      if (nameLabel) nameLabel.textContent = name;
      setCookie("selectedName", name, 30);

      const person = names[name];
      const sections = document.querySelectorAll(".video-section");

      sections.forEach((section) => {
        const geraet = section.dataset.geraet;
        const value = person[geraet];

        // alte Klone entfernen
        removeClones(geraet);

        if (!value) {
          section.style.display = "none";
          return;
        }

        // macht aus "3" → ["3"] und aus ["4","5"] → ["4","5"]
        const levels = Array.isArray(value) ? value : [value];

        // Original-Block für erstes Level
        section.style.display = "";
        setVideo(section, geraet, levels[0]);

       // Weitere Levels → klonen
      for (let i = 1; i < levels.length; i++) {
        const clone = section.cloneNode(true);
        clone.dataset.cloneOf = geraet;

        // Überschrift im Klon anpassen (Level + Prefix)
        const h2 = clone.querySelector("h2");
        if (h2) {
          // ersetzt z.B. " - P4" am Ende durch " - P5"
          h2.textContent = h2.textContent.replace(/\s*-\s*P\d+\s*$/, ` - P${levels[i]}`);

          // optional: "Alternative: " prependen (nur wenn noch nicht vorhanden)
          if (!h2.textContent.startsWith("Alternative: ")) {
            h2.textContent = "Alternative: " + h2.textContent;
          }
        }

        setVideo(clone, geraet, levels[i]);
        section.insertAdjacentElement("afterend", clone);
      }
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
