class SongInfo {
    constructor(_id, _title, _artist, _artistId, _genre, _mood, _releaseYear, _duration, _favourites, _description, _image, _rating) {
        this.id = _id;
        this.title = _title;
        this.artist = _artist;
        this.artistId = _artistId;
        this.genre = _genre;
        this.mood = _mood;
        this.releaseYear = _releaseYear;
        this.duration = _duration;
        this.favourites = _favourites;
        this.description = _description;
        this.image = _image;
        this.rating = _rating;
    }
}


!(async function () {

if ($(".songInfoContainer").length === 0) {
    return;
}

const options = {
    method: "GET"
};

let songId = localStorage.getItem("replayCurrentSong");

if (!songId) {
    let firstUrl = "https://discoveryprovider.audius.co/v1/tracks/search?query=punk&app_name=REPLAY&limit=1";

    let firstData = await fetch(firstUrl, options)
        .then((response) => response.json())
        .then((result) => { return result })
        .catch((error) => console.error(error));

    if (firstData && firstData.data && firstData.data.length > 0) {
        songId = firstData.data[0].id;
    }
}

if (!songId) {
    console.log("No song could be loaded.");
    return;
}

const url = "https://discoveryprovider.audius.co/v1/tracks/" + songId + "?app_name=REPLAY";

let data = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => { return result })
    .catch((error) => console.error(error));

console.log(data);

if (!data || !data.data) {
    console.log("This song could not be loaded.");
    return;
}

let track = data.data;

let image = "";
if (track.artwork) {
    image = track.artwork["1000x1000"];
}

let genre = "Unknown";
if (track.genre) {
    genre = track.genre;
}

let mood = "Not listed";
if (track.mood) {
    mood = track.mood;
}

let releaseYear = "Unknown";
if (track.release_date) {
    releaseYear = track.release_date.slice(0, 4);
}

let description = "No description available for this track.";
if (track.description) {
    description = track.description;
}

let currentSong = new SongInfo(
    track.id,
    track.title,
    track.user.name,
    track.user.id,
    genre,
    mood,
    releaseYear,
    track.duration,
    track.favorite_count,
    description,
    image,
    getSongInfoRating(track.favorite_count)
);

console.log(currentSong);

displaySongInfo(currentSong);
loadMoreFromArtist(currentSong);

})();