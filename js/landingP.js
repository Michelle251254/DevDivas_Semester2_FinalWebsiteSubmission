class Song {
    constructor(_id, _title, _artist, _image, _rating) {
        this.id = _id;
        this.title = _title;
        this.artist = _artist;
        this.image = _image;
        this.rating = _rating;
    }
}

let allSongs = [];


!(async function () {

if ($("#featuredCarousel").length === 0) {
    return;
}

const url = "https://discoveryprovider.audius.co/v1/tracks/search?query=punk&app_name=REPLAY&limit=50";
const options = {
    method: "GET"
};

let data = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => { return result })
    .catch((error) => console.error(error));

console.log(data);

if (!data || !data.data) {
    console.log("The music could not be loaded.");
    return;
}
for (let i = 0; i < data.data.length; i++) {
    let track = data.data[i];

    let image = "";
    if (track.artwork) {
        image = track.artwork["480x480"];
    }

    let newSong = new Song(track.id, track.title, track.user.name, image, getRating(track.favorite_count));
    allSongs.push(newSong);
}

console.log(allSongs);
console.log(allSongs.length);


displayFeatured(allSongs.slice(0, 4));

displaySongRow(".trending .song-scroll", allSongs.slice(4, 10), 1, "col col-6 col-lg-3 col-xl-2");
displaySongRow("#trendingMore .row", allSongs.slice(10, 16), 7, "col");

displaySongRow(".discover .song-scroll", allSongs.slice(16, 22), 1, "col col-6 col-lg-3 col-xl-2");
displaySongRow("#discoverMore .row", allSongs.slice(22, 28), 7, "col");

})();

function getRating(favourites) {
    let rating = 3.5 + (favourites / 1000);

    if (rating > 5) {
        rating = 5;
    }

    return rating.toFixed(1);
}



function getStars(rating) {
    let stars = "";
    let filled = Math.round(rating);

    for (let i = 0; i < 5; i++) {
        if (i < filled) {
            stars = stars + "&#9733;";
        } else {
            stars = stars + "&#9734;";
        }
    }

    return stars;
}

function displayFeatured(songs) {
    $("#featuredCarousel .carousel-inner").empty();

    for (let i = 0; i < songs.length; i++) {
        let song = songs[i];

        let activeClass = "";
        if (i === 0) {
            activeClass = " active";
        }

        let colour = "bg-green";
        if (i % 2 === 1) {
            colour = "bg-pink";
        }

        let artwork = "";
        if (song.image !== "") {
            artwork = "<img src='" + song.image + "' alt='Album artwork'>";
        }

        let slide =
            "<div class='carousel-item" + activeClass + "' data-bs-interval='5000'>" +
                "<div class='featured-content d-flex align-items-center flex-wrap gap-4'>" +
                    "<div class='featured-cover " + colour + "'>" + artwork + "</div>" +
                    "<div class='featured-info'>" +
                        "<p class='new-release'>NEW RELEASE</p>" +
                        "<h2 class='featured-title'>" + song.title + "</h2>" +
                        "<p class='featured-artist'>" + song.artist + "</p>" +
                        "<div class='featured-rating'>" +
                            "<span class='stars'>" + getStars(song.rating) + "</span>" +
                            "<span class='rating-text'>" + song.rating + "/5</span>" +
                        "</div>" +
                        "<a href='#' class='btn btn-play'>PLAY NOW</a>" +
                    "</div>" +
                "</div>" +
            "</div>";

        $("#featuredCarousel .carousel-inner").append(slide);
    }
}

function displaySongRow(container, songs, startRank, columnClass) {
    $(container).empty();

    for (let i = 0; i < songs.length; i++) {
        let song = songs[i];
        let rank = startRank + i;

        let colour = "bg-green";
        if (rank % 2 === 1) {
            colour = "bg-pink";
        }

        let artwork = "";
        if (song.image !== "") {
            artwork = "<img src='" + song.image + "' alt='Album artwork'>";
        }

        let card =
            "<div class='" + columnClass + "'>" +
                "<a href='#' class='song-card'>" +
                    "<div class='song-cover " + colour + "'>" +
                        artwork +
                        "<span class='rating-badge'>&#9733; " + song.rating + "</span>" +
                        "<span class='rank'>" + rank + "</span>" +
                    "</div>" +
                    "<p class='song-name'>" + song.title + "</p>" +
                    "<p class='song-artist'>" + song.artist + "</p>" +
                "</a>" +
            "</div>";

        $(container).append(card);
    }
}