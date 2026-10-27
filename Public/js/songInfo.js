//==CREATING THE SONG INFO CLASS==//
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
    } //constructor receives 11 values and stores them as properties using .this
}


//==STARTING THE FUNCTION AND SETTING UP THE API REQUEST==//
!(async function () { //allows code to use await when asking for information

//checking which page your on
if ($(".songInfoContainer").length === 0) {   //.length counts matching elements 
    return;
}

const options = {
    method: "GET"
};

//FINDING OUT WHICH SONG THE VISITOR SELECTED 
let songId = new URLSearchParams(window.location.search).get("id"); 
//finds the id of the selected song using urlsearchparams

if (!songId) {
    songId = localStorage.getItem("replayCurrentSong"); //if no id try finding in local storage
}

//==FETCHING A FALLBACK SONG==//
if (!songId) {
    let firstUrl = "https://discoveryprovider.audius.co/v1/tracks/search?query=punk&app_name=REPLAY&limit=1"; //searches for 1

    let firstData = await fetch(firstUrl, options)
        .then((response) => response.json())
        .then((result) => { return result })
        .catch((error) => console.error(error));

    if (firstData && firstData.data && firstData.data.length > 0) { //check if theres a response, if theres a data list and if that list isnt empty 
        songId = firstData.data[0].id; //get the id of the first returned song
    }
}

if (!songId) {
    console.log("No song could be loaded.");
    return;
}

//FETCHING THE SELECTED SONG
const url = "https://discoveryprovider.audius.co/v1/tracks/" + songId + "?app_name=REPLAY";
//gets the information for the track with the specific id
//creates an api url containing the selected songs id

let data = await fetch(url, options) //sends request and waits for response 
    .then((response) => response.json()) //convert api response body from json to js data
    .then((result) => { return result }) //return data so it can be stored in data 
    .catch((error) => console.error(error));

console.log(data);

if (!data || !data.data) {
    console.log("This song could not be loaded.");
    return;
}
//STORES THE SELECTED SONGS INFO IN TRACK 
let track = data.data;

//==PREPARING THE SONG DATA==//
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

//CREATING THE SONG INFO OBJECT - info got prepared and is now being put into the object
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

displaySongInfo(currentSong); //fills info on webpage
loadSimilarSongs(currentSong); //use songs info + find similar songs

})();


//==CALCULATING THE RATING==//
function getSongInfoRating(favourites) {
    let rating = 3.5 + (favourites / 1000);

    if (rating > 5) {
        rating = 5;
    }

    return rating.toFixed(1);
}

//==GENERATING THE STAR ICONS==//
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

//==FORMATTING THE SONG DURATION==//
function formatSongDuration(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60); 
    let seconds = totalSeconds % 60;
//divides the duration by 60 to work out how many whole minutes it contains 
//math.floor rounds down the nearest whole number
//% gives the remainder after dividing by 60
    if (seconds < 10) {
        seconds = "0" + seconds; 
    }

    return minutes + ":" + seconds;
}


//DISPLAYING THE SONG INFORMATION 
function displaySongInfo(song) {


    if (song.image !== "") {
        $(".albumPlaceholder").css("background-image", "url('" + song.image + "')"); 
        $(".albumPlaceholder").css("background-size", "cover");
        $(".albumPlaceholder").css("background-position", "center");
    }
    //finds html element, changes its css property, setting bg img to songs artword

    $(".songGenre").text(song.genre.toUpperCase() + " \u2022 " + song.mood.toUpperCase()); // updates text bullet

    $(".songTitle").text(song.title);

    $(".artistDate").html("By <span class='artistBold'>" + song.artist + "</span> \u2022 Released " + song.releaseYear);

    $(".songRatings p").first().html(getSongInfoStars(song.rating));
    $(".songRatings p").last().text(song.rating + "/5 \u2022 " + song.favourites + " favourites");

    $(".songTags").html(
        "<li>" + song.mood + "</li>" +
        "<li>" + song.genre + "</li>" +
        "<li>" + formatSongDuration(song.duration) + "</li>"
    ); //li means list item

    $(".songDescription p").text(song.description);

    updateFavouriteButton(song.id);
}

//==LOAD SIMILAR SONGS==//
//genre based song recommendations 
async function loadSimilarSongs(song) { //receives the currently selected song info object as a parameter

    let searchTerm = song.genre; //variable that stores the selected songs genre
    if (searchTerm === "Unknown") { //conditional statement 
        searchTerm = "punk";
    }

    //creates another api url
    //searching for song using the selected track genre
    //encodeURIComponent(searchTerm) converts the search term into a format thats safe to include in a url
    const url = "https://discoveryprovider.audius.co/v1/tracks/search?query=" + encodeURIComponent(searchTerm) + "&app_name=REPLAY&limit=10";
    const options = {
        method: "GET" //specify method 
    };

//==FETCHING RECOMMEND SONGS - ACTUAL API REQUEST==//
    let data = await fetch(url, options)
    //fetch sends request
    //await waits for the promise chain to settle
    //data stores final result
        .then((response) => response.json())
        .then((result) => { return result }) //returns converted result
        .catch((error) => console.error(error));

    console.log(data);

    if (!data || !data.data) {
        return;
    }

    $(".discover .song-scroll").empty();

    let rank = 1; //number displayed on suggested songs

    for (let i = 0; i < data.data.length; i++) {
        let track = data.data[i];


        if (track.id === song.id) {
            continue;
        }
       //continue skips current track + moves to the next track
       //used when the song is already being viewed 

        if (rank > 6) {
            break;
        }
        //break stops the entire loop
        //used after 6 recommended songs have been added

        let image = "";
        if (track.artwork) {
            image = track.artwork["480x480"];
        }

        let artwork = "";
        if (image !== "") {
            artwork = "<img src='" + image + "' alt='Album artwork'>";
        }
         //checks if the artwork exists, if it does it creates an html img tag using the imgs url

        let colour = "bg-green";
        if (rank % 2 === 1) { //checks if the loop position is odd, if it is...
            colour = "bg-pink";
        }

        //==CREATING AND DISPLAYING SIMILAR SONG CARDS==//
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
            //this section dynamically creates the html for the song card
            //+ joins the html strings with variables

        $(".discover .song-scroll").append(card);

        rank = rank + 1; //increases rank for next song
    }
}

//==GETTING THE SAVED SONGS==//
function getFavouriteSongs() {
    let saved = localStorage.getItem("replayFavourites");

    if (saved) {
        return JSON.parse(saved); //converts saved text back into an array
    }

    return [];
}

function updateFavouriteButton(songId) {
    let favourites = getFavouriteSongs();

    $(".favBtn").val(songId); //sets the buttons value to the songs id

    if (favourites.indexOf(songId) !== -1) { //checks if the current song is already in the array
        $(".favBtn").text("Saved to Favourites");//if the value is saved update text
    }
}

$(document).on("click", ".favBtn", function () {
    let songId = $(this).val();
    let favourites = getFavouriteSongs(); //gets the songs id + existing saved list

    if (favourites.indexOf(songId) === -1) { 
        favourites.push(songId); //if the songs isn't saved pushed adds it
        $(this).text("Saved to Favourites");
    } else {
        favourites.splice(favourites.indexOf(songId), 1); //if it is already saved, splice removes it
        $(this).text("+ Save to Favourites");
    }

    localStorage.setItem("replayFavourites", JSON.stringify(favourites));
});


