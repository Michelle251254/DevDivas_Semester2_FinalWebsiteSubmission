//=======================================================
// CLARISHA: SAVED SONGS PAGE
// Reads the saved songs from local storage and shows them in the table.
//=======================================================

//==GET THE SAVED SONGS FROM LOCAL STORAGE==//
function getSavedSongObjects() {
  let saved = localStorage.getItem("replaySavedSongs");

  if (saved) {
    return JSON.parse(saved);
  }

  return [];
}

//==WORK OUT THE STAR RATING FROM THE FAVOURITES==//
function getSavedRating(favourites) {
  let rating = 3.5 + favourites / 1000;

  if (rating > 5) {
    rating = 5;
  }

  return Math.round(rating * 10) / 10;
}

//==SHOW THE SAVED SONGS IN THE TABLE==//
function displaySavedSongs() {
  let saved = getSavedSongObjects();

  $("#savedSongsList").empty();

  // username and number of songs
  let username = localStorage.getItem("replayUsername");
  if (username) {
    $(".playlistSubtitle").text("Saved by " + username);
  }

  $("#savedCount").text(saved.length + " songs");

  // no saved songs: show a message and the plain pink cover
  if (saved.length === 0) {
    $(".albumPlaceholder").css("background-image", "none");
    $("#savedSongsList").html(
      "<tr><td colspan='6' class='savedEmpty'>You have not saved any songs yet. Go to Explore and click + Save.</td></tr>",
    );
    return;
  }

  // first saved song's artwork becomes the big cover
  if (saved[0].image !== "") {
    $(".albumPlaceholder").css(
      "background-image",
      "url('" + saved[0].image + "')",
    );
    $(".albumPlaceholder").css("background-size", "cover");
    $(".albumPlaceholder").css("background-position", "center");
  }

  // one table row per saved song
  for (let i = 0; i < saved.length; i++) {
    let song = saved[i];

    let year = "";
    if (song.releaseDate !== "") {
      year = song.releaseDate.slice(0, 4);
    }

    let artwork = "";
    if (song.image !== "") {
      artwork =
        "<img src='" + song.image + "' alt='" + song.title + " artwork'>";
    }

    let row =
      "<tr class='tableItem'>" +
      "<td class='albumIcon'>" +
      artwork +
      "</td>" +
      "<td class='tableTitle'>" +
      "<a href='songInfo.html?id=" +
      song.id +
      "'>" +
      song.title +
      "</a>" +
      "<span class='tableArtist'>" +
      song.artist +
      "</span>" +
      "</td>" +
      "<td class='tableGenre'>" +
      song.genre +
      "</td>" +
      "<td class='tableYear'>" +
      year +
      "</td>" +
      "<td class='tableRating'>&#9733; " +
      getSavedRating(song.favourites) +
      "</td>" +
      "<td class='removeIcon'>" +
      "<button class='removeBtn' value='" +
      song.id +
      "' aria-label='Remove " +
      song.title +
      "'>" +
      "<i class='fa-regular fa-circle-xmark'></i>" +
      "</button>" +
      "</td>" +
      "</tr>";

    $("#savedSongsList").append(row);
  }
}

//==REMOVE A SONG WHEN THE X BUTTON IS CLICKED==//
$(document).on("click", ".removeBtn", function () {
  let songId = $(this).val();

  // remove the whole song from my list
  let saved = getSavedSongObjects();
  for (let i = 0; i < saved.length; i++) {
    if (saved[i].id === songId) {
      saved.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("replaySavedSongs", JSON.stringify(saved));

  // remove the id from Danya's list, so Explore shows "+ Save" again
  let savedIds = [];
  if (localStorage.getItem("replaySaved")) {
    savedIds = JSON.parse(localStorage.getItem("replaySaved"));
  }
  if (savedIds.indexOf(songId) !== -1) {
    savedIds.splice(savedIds.indexOf(songId), 1);
  }
  localStorage.setItem("replaySaved", JSON.stringify(savedIds));

  displaySavedSongs();
});

//==SHOW THE SONGS WHEN THE PAGE LOADS==//
$(document).ready(function () {
  displaySavedSongs();
});
