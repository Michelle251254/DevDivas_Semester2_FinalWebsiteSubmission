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

let allSongs = [];

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

  if (!data || !data.data) {
    $("#libraryGrid").html(
      "<p class='libraryMessage'>Could not load the music library. Please try again later.</p>",
    );
    return;
  }

  for (let i = 0; i < data.data.length; i++) {
    let track = data.data[i];

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
  //=======================================
  // CLARISHA adding filter
  //=======================================
  createGenreFilter();
  createYearFilter();
})();

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

    $("#libraryGrid").append(card);
  }

  updateSaveButtons();
}

function getPlaylists() {
  let stored = localStorage.getItem("replayPlaylists");

  if (stored) {
    return JSON.parse(stored);
  }

  return [];
}

function savePlaylists(playlists) {
  localStorage.setItem("replayPlaylists", JSON.stringify(playlists));
}

function updateSaveButtons() {
  let playlists = getPlaylists();

  $(".songCardSave").each(function () {
    let songId = $(this).val();
    let found = false;

    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].songs.indexOf(songId) !== -1) {
        found = true;
      }
    }

    if (found) {
      $(this).text("Saved");
      $(this).addClass("isSaved");
    } else {
      $(this).text("+ Save");
      $(this).removeClass("isSaved");
    }
  });
}

// holds the song the user clicked save on
let selectedSongId = "";
let selectedSongTitle = "";

// opens the modal when a save button on a card is clicked
$(document).on("click", ".songCardSave", function () {
  selectedSongId = $(this).val();

  for (let i = 0; i < allSongs.length; i++) {
    if (allSongs[i].id === selectedSongId) {
      selectedSongTitle = allSongs[i].title;
    }
  }

  showPlaylistModal();
});

//Clarisha:Building playlist list inside the modal
// fills the modal in and shows it
function showPlaylistModal() {
  $(".playlistSongName").text(selectedSongTitle);
  $("#newPlaylistName").val("");
  $(".playlistMessage").text("");

  displayPlaylistOptions();

  let modal = new bootstrap.Modal(document.getElementById("playlistModal"));
  modal.show();
}

// builds one row for every playlist the user has made
function displayPlaylistOptions() {
  let playlists = getPlaylists();

  $("#playlistList").empty();

  if (playlists.length === 0) {
    $("#playlistList").html(
      "<p class='playlistEmpty'>You have no playlists yet. Create your first one below.</p>"
    );
    return;
  }

  for (let i = 0; i < playlists.length; i++) {
    let playlist = playlists[i];
    let already = playlist.songs.indexOf(selectedSongId) !== -1;

    let row = "";

    if (already) {
      row =
        "<div class='playlistRow playlistAlready'>" +
          "<span class='playlistRowName'>" + playlist.name + "</span>" +
          "<span class='playlistRowCount'>Already added</span>" +
        "</div>";
    } else {
      row =
        "<div class='playlistRow' data-index='" + i + "'>" +
          "<span class='playlistRowName'>" + playlist.name + "</span>" +
          "<span class='playlistRowCount'>" + playlist.songs.length + " songs</span>" +
        "</div>";
    }

    $("#playlistList").append(row);
  }
}

//============================================================

//clarisha: save song into existing playlist:
$(document).on("click", ".playlistRow", function () {
  if ($(this).hasClass("playlistAlready")) {
    return;
  }

  let index = $(this).attr("data-index");
  let playlists = getPlaylists();

  playlists[index].songs.push(selectedSongId);
  savePlaylists(playlists);

  $(".playlistMessage").text("Added to " + playlists[index].name + ".");

  displayPlaylistOptions();
  updateSaveButtons();
});
//=============================================================
//create new playlist from modal
$("#createPlaylistBtn").on("click", function () {
  let name = $("#newPlaylistName").val();

  if (name === "") {
    $(".playlistMessage").text("Please give your playlist a name.");
    return;
  }

  let playlists = getPlaylists();

  for (let i = 0; i < playlists.length; i++) {
    if (playlists[i].name === name) {
      $(".playlistMessage").text("You already have a playlist called " + name + ".");
      return;
    }
  }

  let newPlaylist = {
    name: name,
    songs: [selectedSongId],
  };

  playlists.push(newPlaylist);
  savePlaylists(playlists);

  $("#newPlaylistName").val("");
  $(".playlistMessage").text("Created " + name + " and added the song.");

  displayPlaylistOptions();
  updateSaveButtons();
});
//=============================================================



//===========================
// Clarisha testing filters
//===========================
console.log(allSongs);
console.log(allSongs.length);
displaySongs(allSongs);
createGenreFilter();
createYearFilter();
