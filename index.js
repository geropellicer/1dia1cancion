window.addEventListener("DOMContentLoaded", async () => {
  const data = await fetch("./data.json").then(r => r.json());
  const cardsContainer = document.getElementById("cards-container");
  data.forEach(pub => {
    if (shouldShow(pub.Fecha)) {
      cardsContainer.appendChild(createCard(pub));
    }
  });
});

function shouldShow(fechaStr) {
  // Parse "DD/MM/YYYY" and compare with current AR time >= 12:00
  const [day, month, year] = fechaStr.split("/").map(Number);
  const pubDate = new Date(year, month - 1, day, 12, 0); 
  const nowAR = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
  const currentAR = new Date(nowAR);
  return currentAR >= pubDate;
}

function createCard(pub) {
  const card = document.createElement("div");
  card.className = "card";
  const carousel = document.createElement("div");
  carousel.className = "carousel";
  pub.Imagenes.forEach(imgURL => {
    const img = document.createElement("img");
    img.src = imgURL;
    carousel.appendChild(img);
  });
  const songLinksDiv = document.createElement("div");
  songLinksDiv.className = "song-links";
  if (Array.isArray(pub.Canciones)) {
    pub.Canciones.forEach((song, i) => {
      const link = document.createElement("a");
      link.href = pub.Links[i];
      link.textContent = song;
      link.target = "_blank";
      songLinksDiv.appendChild(link);
      if (i < pub.Canciones.length - 1) {
        songLinksDiv.appendChild(document.createTextNode(" y "));
      }
    });
  } else {
    const link = document.createElement("a");
    link.href = pub.Links;
    link.textContent = pub.Canciones;
    link.target = "_blank";
    songLinksDiv.appendChild(link);
  }
  const dateEl = document.createElement("div");
  dateEl.className = "date";
  dateEl.textContent = `Día ${pub["Día"]} - ${pub.Fecha}`;
  const textEl = document.createElement("div");
  textEl.innerHTML = pub.Texto.replace(/\n/g, "<br>");
  card.appendChild(carousel);
  card.appendChild(songLinksDiv);
  card.appendChild(dateEl);
  card.appendChild(textEl);
  return card;
}
