//NOTES AND LOGIC for my future presentation:
// All my search, filter and sort options are in ONE function called applyFilters().
// Every dropdown and the search bar call this same function, so they all work together.
// 1. I use jQuery .val() to get what the user typed and what they picked in each dropdown.
// 2. I use .filter() on my allSongs array to keep only the songs that match everything.
//    I use && so a song must match the search AND the genre AND the year AND the rating.
//    "all" lets every song through, so "All Genres", "All Years" and "All Ratings" show everything.
// 3. I sort the filtered songs with my sortSongs() function.
// 4. I pass the songs into displaySongs() so the cards update without reloading the page.
//===================================================================
// APPLYING THE FILTERS TOGETHER
//===================================================================

function applyFilters() {
  // STEP 1: get the current value of the search bar and every dropdown
  // .toLowerCase() makes the search ignore capital letters
  // .trim() removes extra spaces before and after the search word
  let searchTerm = $("#searchInput").val().toLowerCase().trim();
  let selectedGenre = $("#genreFilter").val();
  let selectedYear = $("#yearFilter").val();
  let selectedRating = $("#ratingFilter").val();
  let selectedSort = $("#sortFilter").val();

  // STEP 2: .filter() checks every song one by one
  // a song is only kept if the function below returns true for it
  let filteredSongs = allSongs.filter(function (song) {
    // SEARCH: true if the title, artist OR genre contains the search word
    // (an empty search box matches every song)
    let searchMatch =
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm) ||
      song.genre.toLowerCase().includes(searchTerm);

    // GENRE (category): true if "All Genres" is picked OR the song's genre is the one picked
    let genreMatch = selectedGenre === "all" || song.genre === selectedGenre;
    // RELEASE DATE: true if "All Years" is picked OR the song's date starts with the picked year
    // e.g. "2024-03-01" starts with "2024"
    let yearMatch =
      selectedYear === "all" || song.releaseDate.startsWith(selectedYear);

    // RATING: true if "All Ratings" is picked OR the song's rating is the same or higher
    // Number() turns the dropdown value (text like "4.5") into a number so we can compare

    let ratingMatch =
      selectedRating === "all" || song.rating >= Number(selectedRating);

    // && means the song must pass ALL four checks to stay in the list
    return searchMatch && genreMatch && yearMatch && ratingMatch;
  });
  // STEP 3: put the filtered songs in the order the user picked
  sortSongs(filteredSongs, selectedSort);
  // STEP 4: show the filtered and sorted songs as cards on the page (function is in api.js)
  displaySongs(filteredSongs);
}

//============================================================
// GENRE DROPDOWN
//============================================================
// The API gives each song a genre, so I build the dropdown options from allSongs
// instead of typing them out by hand.
function createGenreFilter() {
  // empty array to collect each genre once
  let genres = [];

  // go through every song and add its genre if it is not in the list yet (no duplicates)
  allSongs.forEach(function (song) {
    if (!genres.includes(song.genre)) {
      genres.push(song.genre);
    }
  });

  // put the genres in alphabetical order
  genres.sort();

  // add one <option> to the genre dropdown for each genre
  for (let i = 0; i < genres.length; i++) {
    $("#genreFilter").append(
      "<option value='" + genres[i] + "'>" + genres[i] + "</option>",
    );
  }
}

//============================================================
// YEAR DROPDOWN
//============================================================
// Same idea as the genre dropdown, but with the release years.
function createYearFilter() {
  //empty array to collect each year once
  let years = [];

  allSongs.forEach(function (song) {
    //skip songs that has no release date
    if (song.releaseDate !== "") {
      //.slice takes the first 4 characters of the date
      let year = song.releaseDate.slice(0, 4);

      //only add the year if its not in the list yet so theres no duplicates
      if (!years.includes(year)) {
        years.push(year);
      }
    }
  });

  // sorts the years , then reverses them so the newest year is first
  years.sort().reverse();

  // add one <option> to the year dropdown for each year
  for (let i = 0; i < years.length; i++) {
    $("#yearFilter").append(
      "<option value='" + years[i] + "'>" + years[i] + "</option>",
    );
  }
}

//============================================================
// SORT
//============================================================
// Sorts the songs it is given (the filtered songs from applyFilters).
// .sort() compares two songs (a and b) at a time to decide which comes first.
// If "Sort By" is picked, none of the ifs run and the songs stay in the API's order.

function sortSongs(songs, selectedSort) {
  // A-Z by song title (localeCompare compares text alphabetically)
  if (selectedSort === "titleAZ") {
    songs.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  }

  // A-Z by artist name
  if (selectedSort === "artistAZ") {
    songs.sort(function (a, b) {
      return a.artist.localeCompare(b.artist);
    });
  }

  // newest first: new Date() turns the date text into a real date so they can be subtracted
  if (selectedSort === "newest") {
    songs.sort(function (a, b) {
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    });
  }
  // oldest first: same as newest, but a and b are swapped
  if (selectedSort === "oldest") {
    songs.sort(function (a, b) {
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    });
  }
  // highest rating first
  if (selectedSort === "rating") {
    songs.sort(function (a, b) {
      return b.rating - a.rating;
    });
  }
}

//============================================================
// SHOW ALL BUTTON
//============================================================
// Resets the search bar and every dropdown back to the start,
// then runs applyFilters() so ALL the songs show again.
function showAllSongs() {
  $("#searchInput").val("");
  $("#genreFilter").val("all");
  $("#yearFilter").val("all");
  $("#ratingFilter").val("all");
  $("#sortFilter").val("default");

  applyFilters();
}

//============================================================
// EVENTS
//============================================================
// "change" runs when the user picks a new option in a dropdown.
// Every dropdown calls the same applyFilters() function, so all the choices work together.
// (The search bar's event is in searchbar.js.)
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
// "click" runs when the Show All button is clicked
$(document).on("click", "#showAllBtn", function () {
  showAllSongs();
});
