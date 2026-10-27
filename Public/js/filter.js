//=======================================================
// CLARISHA: SEARCH, FILTER AND SORT FOR THE EXPLORE PAGE
// Every dropdown and the search bar run applyFilters(),
// so all the choices work together.
//=======================================================

//==WORK OUT THE STAR RATING FROM THE FAVOURITES==//
function getSongRating(favourites) {
  let rating = 3.5 + favourites / 1000;

  if (rating > 5) {
    rating = 5;
  }

  return Math.round(rating * 10) / 10; // round to 1 decimal
}

//==APPLY THE SEARCH AND ALL FILTERS TOGETHER==//
function applyFilters() {
  // get what the user typed and picked
  let searchTerm = $("#searchInput").val().toLowerCase().trim();
  let selectedGenre = $("#genreFilter").val();
  let selectedYear = $("#yearFilter").val();
  let selectedRating = $("#ratingFilter").val();
  let selectedSort = $("#sortFilter").val();

  // keep only the songs that match everything ("all" lets every song through)
  let filteredSongs = allSongs.filter(function (song) {
    let searchMatch =
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm) ||
      song.genre.toLowerCase().includes(searchTerm);

    let genreMatch = selectedGenre === "all" || song.genre === selectedGenre;

    let yearMatch = selectedYear === "all" || song.releaseDate.startsWith(selectedYear);

    let ratingMatch =
      selectedRating === "all" ||
      getSongRating(song.favourites) >= Number(selectedRating);

    return searchMatch && genreMatch && yearMatch && ratingMatch;
  });

  // sort and show the songs (displaySongs is in api.js)
  sortSongs(filteredSongs, selectedSort);
  displaySongs(filteredSongs);

  // no songs matched
  if (filteredSongs.length === 0) {
    $("#libraryGrid").html("<p class='libraryMessage'>No songs match your search.</p>");
  }
}

//==FILL THE GENRE DROPDOWN FROM THE SONGS==//
function createGenreFilter() {
  let genres = [];

  // add each genre once (no duplicates)
  allSongs.forEach(function (song) {
    if (!genres.includes(song.genre)) {
      genres.push(song.genre);
    }
  });

  genres.sort();

  for (let i = 0; i < genres.length; i++) {
    $("#genreFilter").append(
      "<option value='" + genres[i] + "'>" + genres[i] + "</option>",
    );
  }
}

//==FILL THE YEAR DROPDOWN FROM THE SONGS==//
function createYearFilter() {
  let years = [];

  // add each year once (no duplicates), skipping songs with no date
  allSongs.forEach(function (song) {
    if (song.releaseDate !== "") {
      let year = song.releaseDate.slice(0, 4);

      if (!years.includes(year)) {
        years.push(year);
      }
    }
  });

  years.sort().reverse(); // newest year first

  for (let i = 0; i < years.length; i++) {
    $("#yearFilter").append(
      "<option value='" + years[i] + "'>" + years[i] + "</option>",
    );
  }
}

//==SORT THE SONGS==//
function sortSongs(songs, selectedSort) {
  if (selectedSort === "titleAZ") {
    songs.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  }

  if (selectedSort === "artistAZ") {
    songs.sort(function (a, b) {
      return a.artist.localeCompare(b.artist);
    });
  }

  if (selectedSort === "newest") {
    songs.sort(function (a, b) {
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    });
  }

  if (selectedSort === "oldest") {
    songs.sort(function (a, b) {
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    });
  }

  if (selectedSort === "rating") {
    songs.sort(function (a, b) {
      return b.favourites - a.favourites;
    });
  }
}

//==SHOW ALL: RESET THE SEARCH AND EVERY DROPDOWN==//
function showAllSongs() {
  $("#searchInput").val("");
  $("#genreFilter").val("all");
  $("#yearFilter").val("all");
  $("#ratingFilter").val("all");
  $("#sortFilter").val("default");

  applyFilters();
}

//==EVENTS (the search bar's event is in searchbar.js)==//
$(document).on("change", "#genreFilter", function () {
  applyFilters();
});

$(document).on("change", "#yearFilter", function () {
  applyFilters();
});

$(document).on("change", "#ratingFilter", function () {
  applyFilters();
});

$(document).on("change", "#sortFilter", function () {
  applyFilters();
});

$(document).on("click", "#showAllBtn", function () {
  showAllSongs();
});