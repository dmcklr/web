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

document.addEventListener("play", (e) => {
  if (e.target.tagName !== "VIDEO") return;

  document.querySelectorAll("video").forEach((video) => {
    if (video !== e.target) video.pause();
  });
}, true); // capture!


// ---------- Sichtbarkeit ----------
function showMain() {
  document.querySelector("main").style.display = "";
  document.getElementById("please-select").style.display = "none";
}

function showPleaseSelect() {
  document.querySelector("main").style.display = "none";
  document.getElementById("please-select").style.display = "";
}

// ---------- JSON laden ----------
fetch("turnen.json")
  .then((response) => response.json())
  .then((data) => {
    const names = data.list;

    const select = document.getElementById("nameSelect");
    const nameLabel = document.getElementById("selectedLabel");
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

      showMain(); // ✅ main einblenden / Hinweis ausblenden

      h1Name.textContent = name;
      if (nameLabel) nameLabel.textContent = name;
      setCookie("selectedName", name, 30);

      const person = names[name];
      const sections = document.querySelectorAll(".video-section");

      sections.forEach((section) => {
        const geraet = section.dataset.geraet;
        const value = person[geraet];

        removeClones(geraet);

        if (!value) {
          section.style.display = "none";
          return;
        }

        const levels = Array.isArray(value) ? value : [value];

        section.style.display = "";
        setVideo(section, geraet, levels[0]);

        // Weitere Levels → klonen
        for (let i = 1; i < levels.length; i++) {
          const clone = section.cloneNode(true);
          clone.dataset.cloneOf = geraet;

          const h2 = clone.querySelector("h2");
          if (h2) {
            h2.textContent = `Alternative: ${h2.textContent.replace(/\s*P\d+$/, "")}P${levels[i]}`;
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

    // ---------- Startzustand ----------
    const savedName = getCookie("selectedName");
    if (savedName && names[savedName]) {
      select.value = savedName;
      selectPerson(savedName);
    } else {
      showPleaseSelect(); // ✅ kein Cookie → Hinweis anzeigen
    }
  })
  .catch((error) => {
    console.error("Fehler beim Laden der JSON:", error);
  });
