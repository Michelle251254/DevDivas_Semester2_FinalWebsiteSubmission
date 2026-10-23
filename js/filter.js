//=======================================================
// CLARISHA FILTER FUNCTIONALITY ON EXPLORE PAGE
//=======================================================

//NOTES AND LOGIC for future presentation:
//I created a separate filtering system for my Content Library so that it is independent from my search bar. I use jQuery to retrieve the selected Genre and Release Year from the dropdown menus. I then use JavaScript's .filter() method to loop through my allSongs array and create a new array containing only songs that match the selected filters. I use conditional statements to allow "All Genres" and "All Years" to display all content, while specific selections only display matching songs. I use && so that when multiple filters are selected, a song must meet all of the selected conditions. Finally, I pass the filtered array into my existing displaySongs() function so that the content cards are dynamically updated. I use jQuery change event listeners so the filtering happens whenever the user changes either dropdown.

function applyFilters(){
  let searchTerm = $("#searchInput").val().toLowercase().trim();
  let selectedGenre = $("#genreFilter").val();
  let selectedYear = $("#yearFilter").val();
  let selectedRating = $("#ratingFilter").val();

  let filteredSongs = allSongs.filter(function (song) {
    let searchMatch = 
    song.title.toLowercase().includes(searchTerm) ||
    song.artist.toLowercase().includes(searchTerm) ||
    song.genre.toLowercase().includes(searchTerm);

    let genreMatch = selectedGenre === "all" || song.genre === selectedGenre; 
    let yearMatch = selectedYear === "all" || song.releaseDate.startsWith(selectedYear);
    let ratingMatch = selectedRating === "all" || song.rating >= Number(selectedRating);
    return searchMatch && genreMatch && yearMatch && ratingMatch;
  });
  sortSongs(filteredSongs, selectedSort);
  displaySongs(filteredSongs)
}

//============================================================
// GENRE
//============================================================
//API gives the genres, making a dropdown from allSongs

function createGenreFilter() {
  let genres = [];

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

//==================================================================
// YEAR
//==================================================================

function createYearFilter() {
  let years = [];

  allSongs.forEach(function (song) {
    if (song.releaseDate !== "") {
      let year = song.releaseDate.slice(0, 4);

      if (!years.includes(year)) {
        years.push(year);
      }
    }
  });

  years.sort().reverse();

  for (let i = 0; i < years.length; i++) {
    $("#yearFilter").append(
      "<option value='" + years[i] + "'>" + years[i] + "</option>",
    );
  }
}
//==================================================================
// POPULARITY
//==================================================================

//==================================================================
// SORT
//==================================================================
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
      return b.rating - a.rating;
    });
  }

}
  function showAllSongs() {
  $("#searchInput").val("");
  $("#genreFilter").val("all");
  $("#yearFilter").val("all");
  $("#ratingFilter").val("all");
  $("#sortFilter").val("default");

  applyFilters();
  }
//===============================================================
// Filter events
//==============================================================
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
