//==CREATING THE SONG CARDS==//
class Song {
  constructor(_id, _title, _artist, _releaseDate, _genre, _favourites, _image) {
    this.id = _id;
    this.title = _title;
    this.artist = _artist;
    this.releaseDate = _releaseDate;
    this.genre = _genre;
    this.favourites = _favourites;
    this.image = _image;
  } //constructor receives 7 values and stores them as properties using .this
}

//==STARTING THE FUNCTION AND PREPARING THE API REQUEST==//
let allSongs = []; //empty array to store the object songs

!(async function () {
  //allows code to use await when asking for information
  const url =
    "https://discoveryprovider.audius.co/v1/tracks/search?query=punk&app_name=REPLAY&limit=50";

  const options = {
    method: "GET", //data is being received
  };

  //==FETCHING DATA FROM AUDIUS==//
  let data = await fetch(url, options) //sends request and waits
    .then((response) => response.json()) //json converts response body into js data
    .then((result) => {
      return result;
    })
    .catch((error) => console.error(error)); //logs error

  console.log(data);

  //==CHECKING IF THE API RETURNED DATA==//
  if (!data || !data.data) {
    $("#libraryGrid").html(
      "<p class='libraryMessage'>Could not load the music library. Please try again later.</p>",
    );
    return;
  }

  //==PROCESSING THE MUSIC AND CREATING SONG OBJECTS==//
  for (let i = 0; i < data.data.length; i++) {
    let track = data.data[i]; //selects the current track

    let image = "";
    if (track.artwork) {
      image = track.artwork["480x480"];
    }

    let genre = "Unknown";
    if (track.genre) {
      genre = track.genre;
    }

    let releaseDate = "";
    if (track.release_date) {
      releaseDate = track.release_date.slice(0, 10);
    }

    let newSong = new Song(
      track.id,
      track.title,
      track.user.name,
      releaseDate,
      genre,
      track.favorite_count,
      image,
    );

    allSongs.push(newSong);
  }

  console.log(allSongs);
  console.log(allSongs.length);

  displaySongs(allSongs);

  //================================
  // CLARISHA adding filter
  //================================
  createGenreFilter();
  createYearFilter();
})();

//==PREPARING INFORMATION FOR THE SONG CARDS==//
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

    //==DYNAMICALLY CREATING THE HTML SONG CARDS==//
    let card =
      "<div class='col-12 col-sm-6 col-lg-4 col-xxl-3'>" +
      "<div class='songCard'>" +
      "<div class='songCardArt'>" +
      artwork +
      "<span class='songCardBadge'>&#9829; " +
      song.favourites +
      "</span>" +
      "</div>" +
      "<div class='songCardBody'>" +
      "<p class='songCardGenre'>" +
      song.genre +
      "</p>" +
      "<h3 class='songCardTitle'>" +
      song.title +
      "</h3>" +
      "<p class='songCardMeta'>" +
      song.artist +
      ", " +
      year +
      "</p>" +
      "<div class='songCardButtons'>" +
      "<a class='songCardView' href='songInfo.html?id=" +
      song.id +
      "'>View</a>" +
      "<button class='songCardSave' value='" +
      song.id +
      "'>+ Save</button>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    $("#libraryGrid").append(card); //find the grids + puts card inside it (runs once per song (inside a loop))
  }

  updateSaveButtons();
}

//==READING SAVED SONGS AND UPDATING SAVED BUTTONS==//
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

    let savedModal = new bootstrap.Modal(document.getElementById("savedModal"));
    savedModal.show();
  } else {
    saved.splice(saved.indexOf(songId), 1);
    $(this).text("+ Save");
    $(this).removeClass("isSaved");
  }

  localStorage.setItem("replaySaved", JSON.stringify(saved));
});

//================================
// Clarisha testing filters
//================================
console.log(allSongs);
console.log(allSongs.length);
displaySongs(allSongs);
createGenreFilter();
createYearFilter();
