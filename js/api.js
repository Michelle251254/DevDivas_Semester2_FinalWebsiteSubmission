//==CREATING THE SONG CARDS==//
class Song {
  constructor(_id, _title, _artist, _releaseDate, _genre, _favourites, _image, _rating) {
    this.id = _id;
    this.title = _title;
    this.artist = _artist;
    this.releaseDate = _releaseDate;
    this.genre = _genre;
    this.favourites = _favourites;
    this.image = _image;

  } //constructor receives 7 values and stores them as properties using .this



//================================================================================
//Clarisha added _rating and the function "getSongRating" to improve the filters
//================================================================================

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









  let data = await fetch(url, options)
    .then((response) => response.json())

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
      getSongRating(track.favorite_count),
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
      "<span class='songCardBadge'>&#9733; " +
      song.rating+
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
}

//================================
// SAVE TO PLAYLIST
//================================

// remembers which song the user clicked save on
let currentSongId = "";
let currentSongTitle = "";

// the Bootstrap modal, created the first time it is needed
let playlistModal = null;

function getPlaylists() {
  let saved = localStorage.getItem("replayPlaylists");

  if (saved) {
    return JSON.parse(saved);
  }

  return [];
}

function savePlaylists(playlists) {
  localStorage.setItem("replayPlaylists", JSON.stringify(playlists));
}

// finds a playlist by name and returns its position, or -1 if there is none
function findPlaylist(playlists, name) {
  for (let i = 0; i < playlists.length; i++) {
    if (playlists[i].name === name) {
      return i;
    }
  }

  return -1;
}

// checks whether a song has been added to any playlist at all
function isSongSaved(songId) {
  let playlists = getPlaylists();

  for (let i = 0; i < playlists.length; i++) {
    if (playlists[i].songs.indexOf(songId) !== -1) {
      return true;
    }
  }

  return false;
}

// marks every card whose song is already in a playlist
function updateSaveButtons() {
  $(".songCardSave").each(function () {
    if (isSongSaved($(this).val())) {
      $(this).text("Saved");
      $(this).addClass("isSaved");
    } else {
      $(this).text("+ Save");
      $(this).removeClass("isSaved");
    }
  });
}

// builds the list of playlists inside the modal
function displayPlaylists() {
  let playlists = getPlaylists();

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

    $("#playlistList").empty();

    if (playlists.length === 0) {
      $("#playlistList").html(
        "<p class='playlistEmpty'>You have no playlists yet. Create one below.</p>",
      );
      return;
    }

    for (let i = 0; i < playlists.length; i++) {
      let alreadyIn = "";
      if (playlists[i].songs.indexOf(currentSongId) !== -1) {
        alreadyIn = "<span class='playlistAlready'>Added</span>";
      }

      let row =
        "<button type='button' class='playlistRow' value='" +
        i +
        "'>" +
        "<span class='playlistRowName'>" +
        playlists[i].name +
        "</span>" +
        "<span class='playlistRowCount'>" +
        playlists[i].songs.length +
        " songs</span>" +
        alreadyIn +
        "</button>";

      $("#playlistList").append(row);
    }
  }
}
// opens the modal when a save button on a card is clicked
$(document).on("click", ".songCardSave", function () {
  currentSongId = $(this).val();

  // reach up to the card this button belongs to, then back down to its title
  currentSongTitle = $(this).closest(".songCard").find(".songCardTitle").text();

  $("#playlistSongName").text(currentSongTitle);
  $("#playlistMessage").text("");
  $("#newPlaylistName").val("");

  displayPlaylists();

  if (playlistModal === null) {
    playlistModal = new bootstrap.Modal(
      document.getElementById("playlistModal"),
    );
  }

  playlistModal.show();
});


// adds the chosen song to the playlist that was clicked
$(document).on("click", ".playlistRow", function () {
  let position = Number($(this).val());
  let playlists = getPlaylists();

  if (playlists[position].songs.indexOf(currentSongId) !== -1) {
    $("#playlistMessage").text(
      "That song is already in " + playlists[position].name + ".",
    );
    return;
  }

  playlists[position].songs.push(currentSongId);
  savePlaylists(playlists);

  $("#playlistMessage").text(
    currentSongTitle + " added to " + playlists[position].name + ".",
  );

  displayPlaylists();
  updateSaveButtons();
});

// creates a new empty playlist
$(document).on("click", "#createPlaylistBtn", function () {
  let name = $("#newPlaylistName").val().trim();

  if (name === "") {
    $("#playlistMessage").text("Please type a playlist name.");
    return;
  }

  let playlists = getPlaylists();

  if (findPlaylist(playlists, name) !== -1) {
    $("#playlistMessage").text(
      "You already have a playlist called " + name + ".",
    );
    return;
  }

  playlists.push({ name: name, songs: [] });
  savePlaylists(playlists);

  $("#newPlaylistName").val("");
  $("#playlistMessage").text("Playlist " + name + " created.");

  displayPlaylists();
});

