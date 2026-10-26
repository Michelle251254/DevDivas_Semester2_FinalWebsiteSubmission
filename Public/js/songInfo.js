class SongInfo {
    constructor(_id, _title, _artist, _genre, _mood, _releaseYear, _duration, _favourites, _description, _image, _rating) {
        this.id = _id;
        this.title = _title;
        this.artist = _artist;
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

let songId = new URLSearchParams(window.location.search).get("id");

if (!songId) {
    songId = localStorage.getItem("replayCurrentSong");
}

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
loadSimilarSongs(currentSong);

})();


function getSongInfoRating(favourites) {
    let rating = 3.5 + (favourites / 1000);

    if (rating > 5) {
        rating = 5;
    }

    return rating.toFixed(1);
}

function getSongInfoStars(rating) {
    let stars = "";
    let filled = Math.round(rating);

    for (let i = 0; i < 5; i++) {
        if (i < filled) {
            stars = stars + "<i class='fa-solid fa-star'></i>";
        } else {
            stars = stars + "<i class='fa-regular fa-star'></i>";
        }
    }

    return stars;
}

function formatSongDuration(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
}

function displaySongInfo(song) {


    if (song.image !== "") {
        $(".albumPlaceholder").css("background-image", "url('" + song.image + "')");
        $(".albumPlaceholder").css("background-size", "cover");
        $(".albumPlaceholder").css("background-position", "center");
    }

    $(".songGenre").text(song.genre.toUpperCase() + " \u2022 " + song.mood.toUpperCase());

    $(".songTitle").text(song.title);

    $(".artistDate").html("By <span class='artistBold'>" + song.artist + "</span> \u2022 Released " + song.releaseYear);

    $(".songRatings p").first().html(getSongInfoStars(song.rating));
    $(".songRatings p").last().text(song.rating + "/5 \u2022 " + song.favourites + " favourites");

    $(".songTags").html(
        "<li>" + song.mood + "</li>" +
        "<li>" + song.genre + "</li>" +
        "<li>" + formatSongDuration(song.duration) + "</li>"
    );

    $(".songDescription p").text(song.description);

    updateFavouriteButton(song.id);
}
async function loadSimilarSongs(song) {

    let searchTerm = song.genre;
    if (searchTerm === "Unknown") {
        searchTerm = "punk";
    }

    const url = "https://discoveryprovider.audius.co/v1/tracks/search?query=" + encodeURIComponent(searchTerm) + "&app_name=REPLAY&limit=10";
    const options = {
        method: "GET"
    };

    let data = await fetch(url, options)
        .then((response) => response.json())
        .then((result) => { return result })
        .catch((error) => console.error(error));

    console.log(data);

    if (!data || !data.data) {
        return;
    }

    $(".discover .song-scroll").empty();

    let rank = 1;

    for (let i = 0; i < data.data.length; i++) {
        let track = data.data[i];


        if (track.id === song.id) {
            continue;
        }

        if (rank > 6) {
            break;
        }

        let image = "";
        if (track.artwork) {
            image = track.artwork["480x480"];
        }

        let artwork = "";
        if (image !== "") {
            artwork = "<img src='" + image + "' alt='Album artwork'>";
        }

        let colour = "bg-green";
        if (rank % 2 === 1) {
            colour = "bg-pink";
        }

        let card =
            "<div class='col col-6 col-lg-3 col-xl-2'>" +
                "<a href='songInfo.html?id=" + track.id + "' class='song-card'>" +
                    "<div class='song-cover " + colour + "'>" +
                        artwork +
                        "<span class='rating-badge'>&#9733; " + getSongInfoRating(track.favorite_count) + "</span>" +
                        "<span class='rank'>" + rank + "</span>" +
                    "</div>" +
                    "<p class='song-name'>" + track.title + "</p>" +
                    "<p class='song-artist'>" + track.user.name + "</p>" +
                "</a>" +
            "</div>";

        $(".discover .song-scroll").append(card);

        rank = rank + 1;
    }
}


function getFavouriteSongs() {
    let saved = localStorage.getItem("replayFavourites");

    if (saved) {
        return JSON.parse(saved);
    }

    return [];
}

function updateFavouriteButton(songId) {
    let favourites = getFavouriteSongs();

    $(".favBtn").val(songId);

    if (favourites.indexOf(songId) !== -1) {
        $(".favBtn").text("Saved to Favourites");
    }
}

$(document).on("click", ".favBtn", function () {
    let songId = $(this).val();
    let favourites = getFavouriteSongs();

    if (favourites.indexOf(songId) === -1) {
        favourites.push(songId);
        $(this).text("Saved to Favourites");
    } else {
        favourites.splice(favourites.indexOf(songId), 1);
        $(this).text("+ Save to Favourites");
    }

    localStorage.setItem("replayFavourites", JSON.stringify(favourites));
});


