//=======================================================
// CLARISHA FILTER FUNCTIONALITY ON EXPLORE PAGE
//=======================================================

//NOTES AND LOGIC for future presentation:
//I created a separate filtering system for my Content Library so that it is independent from my search bar. I use jQuery to retrieve the selected Genre and Release Year from the dropdown menus. I then use JavaScript's .filter() method to loop through my allSongs array and create a new array containing only songs that match the selected filters. I use conditional statements to allow "All Genres" and "All Years" to display all content, while specific selections only display matching songs. I use && so that when multiple filters are selected, a song must meet all of the selected conditions. Finally, I pass the filtered array into my existing displaySongs() function so that the content cards are dynamically updated. I use jQuery change event listeners so the filtering happens whenever the user changes either dropdown.

function filterSongs() {
  let selectedGenre = $("#genreFilter").val();
  let selectedYear = $("#yearFilter").val();

  console.log("Genre:", selectedGenre);
  console.log("Year:", selectedYear);

  let filteredSongs = allSongs.filter(function (song) {
    let genreMatch = selectedGenre === "all" || song.genre === selectedGenre;

    let yearMatch =
      selectedYear === "all" || song.releaseDate.startsWith(selectedYear);

    return genreMatch && yearMatch;
  });

  console.log("Filtered songs:", filteredSongs);

  displaySongs(filteredSongs);
}
//Connecting the genre dropdown

$("#genreFilter").on("change", function () {
  filterSongs();
});

//Connecting the year dropdown

$("yearFilter").on("change", function () {
  filterSongs();
});
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
function filterByPopularity() {
  let selectedPopularity = $("#popularityFilter").val();

  let filteredSongs = allSongs.filter(function (song) {
    if (selectedPopularity === "all") {
      return true;
    }

    return song.favourites >= Number(selectedPopularity);
  });

  displaySongs(filteredSongs);
}

//==================================================================
// SORT
//==================================================================
function sortSongs() {
  let selectedSort = $("#sortFilter").val();

  let sortedSongs = [...allSongs];

  if (selectedSort === "titleAZ") {
    sortedSongs.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  }

  if (selectedSort === "artistAZ") {
    sortedSongs.sort(function (a, b) {
      return a.artist.localeCompare(b.artist);
    });
  }

  if (selectedSort === "newest") {
    sortedSongs.sort(function (a, b) {
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    });
  }

  if (selectedSort === "oldest") {
    sortedSongs.sort(function (a, b) {
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    });
  }

  if (selectedSort === "popular") {
    sortedSongs.sort(function (a, b) {
      return b.favourites - a.favourites;
    });
  }

  displaySongs(sortedSongs);
}

//===============================================================
// Filter events
//==============================================================
$(document).on("change", "#genreFilter", function () {
  filterSongs();
});

$(document).on("change", "#yearFilter", function () {
  filterSongs();
});

$(document).on("change", "#popularityFilter", function () {
  filterByPopularity();
});

$(document).on("change", "#sortFilter", function () {
  sortSongs();
});
