//=======================================================
// CLARISHA: SAVING THE WHOLE SONG FOR THE SAVED PAGE
// Danya's api.js only saves the song's id, so this file saves the whole song
// in a second list ("replaySavedSongs") for the Saved page to use.
//=======================================================

//==GET MY LIST OF SAVED SONGS==//
function getSavedSongObjects() {
  let saved = localStorage.getItem("replaySavedSongs");

  if (saved) {
    return JSON.parse(saved);
  }

  return [];
}

//==FIND A SONG USING ITS ID==//
function findSong(songId) {
  for (let i = 0; i < allSongs.length; i++) {
    if (allSongs[i].id === songId) {
      return allSongs[i];
    }
  }
}

//==WHEN "+ SAVE" IS CLICKED==//
$(document).on("click", ".songCardSave", function () {
  let songId = $(this).val();
  let savedIds = getSavedSongs(); // Danya's list, already updated by her code
  let savedSongs = getSavedSongObjects();

  // remove the song first, so it is never saved twice
  for (let i = 0; i < savedSongs.length; i++) {
    if (savedSongs[i].id === songId) {
      savedSongs.splice(i, 1);
      break;
    }
  }

  // if Danya's list has the id, the song was just saved, so add the whole song
  if (savedIds.indexOf(songId) !== -1) {
    savedSongs.push(findSong(songId));
  }

  localStorage.setItem("replaySavedSongs", JSON.stringify(savedSongs));
});
