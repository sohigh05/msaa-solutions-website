// Galeri memaparkan salinan bertanda air, tanpa pautan muat turun.
const grid = document.querySelector("[data-project-grid]");
const viewer = document.querySelector(".project-view");
const photo = viewer.querySelector("img");
const title = viewer.querySelector("h2");
const total = 42;
let selected = 1;
let opener;

function projectPath(number) {
  return `assets/projek/projek-${String(number).padStart(2, "0")}`;
}

function showProject(number) {
  selected = ((number - 1 + total) % total) + 1;
  title.textContent = `Foto projek ${selected} / ${total}`;
  photo.alt = `Foto projek ${selected} MSAA Solutions`;
  photo.src = `${projectPath(selected)}.webp`;
}

for (let number = 1; number <= total; number += 1) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "project-card";
  button.setAttribute("aria-label", `Besarkan foto projek ${number}`);
  button.innerHTML = `
    <img class="project-photo" src="${projectPath(number)}-kecil.webp"
      alt="" loading="lazy" decoding="async" draggable="false">
    <span>Foto ${String(number).padStart(2, "0")} <span aria-hidden="true">↗</span></span>
  `;
  button.addEventListener("click", () => {
    opener = button;
    showProject(number);
    viewer.showModal();
  });
  grid.append(button);
}

viewer.querySelector("[data-close]").addEventListener("click", () => viewer.close());
viewer.querySelector("[data-prev]").addEventListener("click", () => showProject(selected - 1));
viewer.querySelector("[data-next]").addEventListener("click", () => showProject(selected + 1));
viewer.addEventListener("close", () => opener?.focus());
viewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showProject(selected - 1);
  if (event.key === "ArrowRight") showProject(selected + 1);
});

// Halang menu simpan dan seretan biasa pada foto sahaja.
for (const area of [grid, viewer]) {
  for (const eventName of ["contextmenu", "dragstart"]) {
    area.addEventListener(eventName, (event) => {
      if (event.target.closest(".project-photo, .project-card")) event.preventDefault();
    });
  }
}
