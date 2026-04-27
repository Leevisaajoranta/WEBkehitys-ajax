const apiKey = "c2d8749142ac46023e18d67d3e9f9bd1";

function fetchAlbums(artist) {
  fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error("Virhe:", error);
    });
}

fetchAlbums("Coldplay");
