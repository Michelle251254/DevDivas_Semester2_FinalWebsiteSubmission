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