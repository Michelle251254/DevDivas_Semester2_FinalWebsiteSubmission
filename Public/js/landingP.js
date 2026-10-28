//==CREATING THE SONG CLASS AND ARRAY==//
class Song {
    constructor(_id, _title, _artist, _image, _rating) {
        this.id = _id;
        this.title = _title;
        this.artist = _artist;
        this.image = _image;
        this.rating = _rating;
    }
}

let allSongs = [];//empty array where the song objects will be stored

//==STARTING THE FUNCTION AND SENDING THE API REQUEST==//
!(async function () { //allows code to use await when asking for information 

if ($("#featuredCarousel").length === 0) {
    return; //checks if the carousel exist
}

const url = "https://discoveryprovider.audius.co/v1/tracks/search?query=punk&app_name=REPLAY&limit=50";
const options = {
    method: "GET"
};

//==FETCHING MUSIC AND CHECKING THE RESPONSE==//
let data = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => { return result })
    .catch((error) => console.error(error));

console.log(data);

if (!data || !data.data) {
    console.log("The music could not be loaded.");
    return;
}

//==PROCESSING TRACKS INTO SONG OBJECTS==//
for (let i = 0; i < data.data.length; i++) { 
    let track = data.data[i]; //selects the current track

    let image = "";
    if (track.artwork) {
        image = track.artwork["480x480"];
    }

    let newSong = new Song(track.id, track.title, track.user.name, image, getRating(track.favorite_count));
    allSongs.push(newSong);//new song creates an object, push adds the new song to the all songs array
}

console.log(allSongs);
console.log(allSongs.length);


//==DIVIDING SONGS BETWEEN HOME PAGE SECTIONS==//
displayFeatured(allSongs.slice(0, 4)); //selects 4 songs for carousel 
//creates carousel cards

displaySongRow(".trending .song-scroll", allSongs.slice(4, 10), 1, "col col-6 col-lg-3 col-xl-2");
displaySongRow("#trendingMore .row", allSongs.slice(10, 16), 7, "col");
//creates the trending and discover cards
displaySongRow(".discover .song-scroll", allSongs.slice(16, 22), 1, "col col-6 col-lg-3 col-xl-2");
displaySongRow("#discoverMore .row", allSongs.slice(22, 28), 7, "col");

})();


//==CALCULATING SONG RATING==//
function getRating(favourites) {
    let rating = 3.5 + (favourites / 1000);

    if (rating > 5) {
        rating = 5;
    }

    return rating.toFixed(1);
}


//==GENERATING STAR ICONS==//
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


//==PREPARING THE FEATURED CAROUSEL==//
function displayFeatured(songs) {
    $("#featuredCarousel .carousel-inner").empty();

    for (let i = 0; i < songs.length; i++) {
        let song = songs[i];

        let activeClass = "";
        if (i === 0) { 
            activeClass = " active"; //stores the bootstrap class "active" for the first slide
        }

        //==PREPARING CAROUSEL COLORS AND ARTWORKS==//
        let colour = "bg-green";
        if (i % 2 === 1) { //checks if the loop position is odd, if it is...
            colour = "bg-pink";
        }

        let artwork = "";
        if (song.image !== "") {
            artwork = "<img src='" + song.image + "' alt='Album artwork'>";
        } 
        //checks if the artwork exists, if it does it creates an html img tag using the imgs url

        //==CREATING THE FEATURED CAROUSEL SLIDES==//
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
            //this section dynamically creates the html for each featured carousel slide
            //+ joins the html strings with variables 

        $("#featuredCarousel .carousel-inner").append(slide);//inserts each completed slide into carousel 
    }
}


//==PREPARING THE TRENDING AND DISCOVER NOW ROWS==//
function displaySongRow(container, songs, startRank, columnClass) {
    $(container).empty();

    for (let i = 0; i < songs.length; i++) {
        let song = songs[i];
        let rank = startRank + i; //calculates the rank 

        let colour = "bg-green";
        if (rank % 2 === 1) { //checks if the loop position is odd, if it is...
            colour = "bg-pink";
        }

        let artwork = "";
        if (song.image !== "") {
            artwork = "<img src='" + song.image + "' alt='Album artwork'>";
        }
        //checks if the artwork exists, if it does it creates an html img tag using the imgs url


        //==CREATING AND DISPLAYING THE SONG CARDS==//
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
            //this section dynamically creates the html for each trending/discover song card
            //+ joins the html strings with variables

        $(container).append(card);//inserts completed song in the selected section
    }
}



//===============================================
// CLARISHA WELCOME MESSAGE JS
// gets the username that logIn.js saved in local storage
// and puts it in the welcome heading on the home page
//On the home page, $(document).ready waits until the page has loaded. Then localStorage.getItem reads the username that was saved when the user logged in. The if statement checks that a username actually exists, so the page never says 'Welcome back, null'. If it does, jQuery's .text() changes the heading to 'Welcome back' plus the username, joining them with the plus sign. That's string concatenation.


$(document).ready(function(){
    let username = localStorage.getItem("replayUsername");
    if (username){ 
        $("#welcomeTitle").text("Welcome back, " + username);
    }
});

//===============================================



