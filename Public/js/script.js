class Song {
  constructor(_id, _title, _artist, _releaseDate, _genre, _favourites, _image) {
    this.id = _id;
    this.title = _title;
    this.artist = _artist;
    this.releaseDate = _releaseDate;
    this.genre = _genre;
    this.favourites = _favourites;
    this.image = _image;
  }
}

!(async function () {
  const url =
    "https://discoveryprovider.audius.co/v1/tracks/search?query=punk&app_name=REPLAY&limit=50";
  const options = {
    method: "GET",
  };

  let data = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.error(error));

  console.log(data);

  console.log(data.data);
  console.log(data.data.length);

  let id = data.data[0].id;
  let title = data.data[0].title;
  let artist = data.data[0].user.name;
  let genre = data.data[0].genre;
  let favourites = data.data[0].favorite_count + " likes";
  let releaseDate = data.data[0].release_date.slice(0, 10);

  let image = "";
  if (data.data[0].artwork) {
    image = data.data[0].artwork["480x480"];
  }

  let newSong = new Song(
    id,
    title,
    artist,
    releaseDate,
    genre,
    favourites,
    image,
  );

  document.getElementById("song-image").src = newSong.image;
  document.getElementById("song-title").innerHTML = newSong.title;
  document.getElementById("song-artist").innerHTML = newSong.artist;
  document.getElementById("song-genre").innerHTML = newSong.genre;
  document.getElementById("song-rating").innerHTML = newSong.favourites;
  document.getElementById("song-date").innerHTML = newSong.releaseDate;

  console.log(newSong);
})();
