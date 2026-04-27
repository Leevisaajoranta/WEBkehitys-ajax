const apiKey = "c2d8749142ac46023e18d67d3e9f9bd1";

const artistSelect = document.getElementById("artistSelect");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const albumsDiv = document.getElementById("albums");

function fetchAlbums(artist) {
  fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`)
    .then(response => response.json())
    .then(data => {
      showAlbums(data);
    })
    .catch(error => {
      console.error("Virhe:", error);
      albumsDiv.innerHTML = "<p>Tietojen hakemisessa tapahtui virhe.</p>";
    });
}

function showAlbums(data) {
  albumsDiv.innerHTML = "";

  if (!data.topalbums || !data.topalbums.album) {
    albumsDiv.innerHTML = "<p>Albumeita ei löytynyt.</p>";
    return;
  }

  data.topalbums.album.slice(0, 10).forEach(album => {
    const div = document.createElement("div");
    div.className = "album-card";

    const image = album.image && album.image[2] && album.image[2]["#text"]
      ? album.image[2]["#text"]
      : "https://via.placeholder.com/300x300?text=No+Image";

    div.innerHTML = `
      <img src="${image}" alt="${album.name}">
      <div class="album-card-content">
        <h3>${album.name}</h3>
        <p>${album.artist.name}</p>
        <button class="detailsBtn">Näytä kappaleet</button>
      </div>
      <div class="album-details"></div>
    `;

    const button = div.querySelector(".detailsBtn");
    const detailsDiv = div.querySelector(".album-details");

    button.addEventListener("click", function () {
      if (detailsDiv.innerHTML !== "") {
        detailsDiv.innerHTML = "";
        button.textContent = "Näytä kappaleet";
        return;
      }

      button.textContent = "Piilota kappaleet";
      fetchAlbumDetails(album.artist.name, album.name, detailsDiv);
    });

    albumsDiv.appendChild(div);
  });
}

function fetchAlbumDetails(artist, album, detailsDiv) {
  detailsDiv.innerHTML = "<p>Ladataan kappaleita...</p>";

  fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&api_key=${apiKey}&format=json`)
    .then(response => response.json())
    .then(data => {
      showAlbumDetails(data, detailsDiv);
    })
    .catch(error => {
      console.error("Virhe:", error);
      detailsDiv.innerHTML = "<p>Albumin tietojen hakeminen epäonnistui.</p>";
    });
}

function showAlbumDetails(data, detailsDiv) {
  if (!data.album) {
    detailsDiv.innerHTML = "<p>Albumin tietoja ei löytynyt.</p>";
    return;
  }

  const album = data.album;

  let tracksHtml = "<ol>";

  if (album.tracks && album.tracks.track) {
    const tracks = Array.isArray(album.tracks.track)
      ? album.tracks.track
      : [album.tracks.track];

    tracks.forEach(track => {
      tracksHtml += `<li>${track.name}</li>`;
    });
  } else {
    tracksHtml += "<li>Kappaleita ei löytynyt.</li>";
  }

  tracksHtml += "</ol>";

  detailsDiv.innerHTML = `
    <p><strong>Kuuntelijat:</strong> ${album.listeners || "-"}</p>
    <p><strong>Soitot:</strong> ${album.playcount || "-"}</p>
    <p><strong>Julkaistu:</strong> ${album.wiki ? album.wiki.published : "Ei tietoa"}</p>
    <h4>Kappaleet:</h4>
    ${tracksHtml}
  `;
}

artistSelect.addEventListener("change", function () {
  fetchAlbums(this.value);
});

searchBtn.addEventListener("click", function () {
  fetchAlbums(searchInput.value);
});

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    fetchAlbums(searchInput.value);
  }
});

fetchAlbums(artistSelect.value);