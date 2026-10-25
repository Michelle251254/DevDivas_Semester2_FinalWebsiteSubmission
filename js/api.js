//creating the song class
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
//creating the song list
let allSongs = [];

//fetching 50 songs

!(async function () {
  const url = //the api url (search for punk songs and return up to 50 tracks)
    "https://discoveryprovider.audius.co/v1/tracks/search?query=punk&app_name=REPLAY&limit=50";
  const options = {
    method: "GET",
  };

  //FETCHING THE MUSIC
  //sends request to Audius. await waits for its result + result is stored in data
  let data = await fetch(url, options)
<<<<<<< Updated upstream
    .then((response) => response.json())
    .then((result) => {return result;})
=======
    .then((response) => response.json()) //reads respons as json + converts into js data
    .then((result) => {return result; //starts function that receives the result + passes it along
    })
>>>>>>> Stashed changes
    .catch((error) => console.error(error));

  console.log(data);

  if (!data || !data.data) {
    $("#libraryGrid").html( //find the html element with the id + replaces content
      "<p class='libraryMessage'>Could not load the music library. Please try again later.</p>",
    );
    return;
  }

<<<<<<< Updated upstream
  //turning the response into objects
  for (let i = 0; i < data.data.length; i++) { 
=======
  //starting the loop: start at the first item in Audius's list, then process each song one at a time until you've reached the end
  for (let i = 0; i < data.data.length; i++) {
>>>>>>> Stashed changes
    let track = data.data[i];

    let image = ""; 
    if (track.artwork) {
      image = track.artwork["480x480"]; //if it has an artwork, it gets its 480x480 img
    }

    let genre = "Unknown"; 
    if (track.genre) {
      genre = track.genre;
    }

    let releaseDate = "";
    if (track.release_date) {
      releaseDate = track.release_date.slice(0, 10);
    }

    //CREATING A NEW SONG
    let newSong = new Song(
      track.id,
      track.title,
      track.user.name,
      releaseDate,
      genre,
      track.favorite_count,
      image,
    );
<<<<<<< Updated upstream
    allSongs.push(newSong);
=======

    allSongs.push(newSong); //adds the newly created song object to the end of the all songs array
>>>>>>> Stashed changes
  }

  console.log(allSongs);
  console.log(allSongs.length);

  displaySongs(allSongs);
  //=======================================
  // CLARISHA adding filter
  //=======================================
  createGenreFilter();
  createYearFilter();
})();


//building the cards
function displaySongs(songs) {
  $("#libraryGrid").empty();
  $("#libraryCount").text(songs.length + " items");

  for (let i = 0; i < songs.length; i++) {
    let song = songs[i];

    let year = "";
    if (song.releaseDate !== "") {
      year = song.releaseDate.slice(0, 4);
    }

    let artwork = "";
    if (song.image !== "") {
      artwork =
        "<img src='" + song.image + "' alt='" + song.title + " artwork'>";
    }

    let card =
          //1. outer container 
          "<div class='col-12 col-sm-6 col-lg-4 col-xxl-3'>" +
            //2. song card
            "<div class='songCard'>" +
              //3. artwork section 
              "<div class='songCardArt'>" +
                artwork +
                //favourites bages
                "<span class='songCardBadge'>&#9829; " + song.favourites + "</span>" +
                "</div>" + //closes songCardArt
                //4. song information section
                "<div class='songCardBody'>" +
                //genre + title
                  "<p class='songCardGenre'>" + song.genre + "</p>" + "<h3 class='songCardTitle'>" + song.title + "</h3>" +
                  //artist + release year
                  "<p class='songCardMeta'>" + song.artist + ", " + year + "</p>" +
                  //5. buttons section
                  "<div class='songCardButtons'>" +
                  //view link
                    "<a class='songCardView' href='songInfo.html?id=" + song.id + "'>View</a>" +
                    //save button
                    "<button class='songCardSave' value='" + song.id + "'>+ Save</button>" +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</div>";

    $("#libraryGrid").append(card); //adds the completed card to the page
  }

  updateSaveButtons();
}

function getSavedSongs() {
  let saved = localStorage.getItem("replaySaved");

  if (saved) {
    return JSON.parse(saved);
  }

  return [];
}

function updateSaveButtons() {
  let saved = getSavedSongs();

  $(".songCardSave").each(function () {
    if (saved.indexOf($(this).val()) !== -1) {
      $(this).text("Saved");
      $(this).addClass("isSaved");
    }
  });
}

$(document).on("click", ".songCardSave", function () {
  let songId = $(this).val();
  let saved = getSavedSongs();

  if (saved.indexOf(songId) === -1) {
    saved.push(songId);
    $(this).text("Saved");
    $(this).addClass("isSaved");
  } else {
    saved.splice(saved.indexOf(songId), 1);
    $(this).text("+ Save");
    $(this).removeClass("isSaved");
  }

  localStorage.setItem("replaySaved", JSON.stringify(saved));
});

//===========================
// Clarisha testing filters
//===========================
console.log(allSongs);
console.log(allSongs.length);
displaySongs(allSongs);
createGenreFilter();
createYearFilter();
