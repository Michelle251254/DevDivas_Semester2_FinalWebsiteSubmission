

<meta> Clarisha Scheepers</meta>//=================================
// SEARCH BAR JAVASCRIPT CLARISHA
//=================================

//REMEMBER!!!!!!!!!! link the HTML searchbar's ID to the <input>

//================================================================
// NOTES ON WHAT EXACTLY I DID HERE:
//================================================================

//  Created a searchSongs() function that allows user to search     through music library. 

// Trimmed and converted search term to lowercase to make the search case INSENSITIVE and remove useless spaces.

// Used .filter() on allSongs array to find songs where title,artist,or genre contains the search term. Matching songs stored in filteredSongs() and passed to displaySongs() = dynamically updates the music cards on the page

// Used jQuery input event to detect whenever user types into search bar, .val() method gets the users search text and sends it to searchSongs(). This means the displayed music cards update dynamically as the user types without reloading the page. 

// The HTML <input> with the ID searchInput connects the JS search functionality to the actual searchbar on the website
//===============================================================
 

function searchSongs(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();

    let filteredSongs = allSongs.filter(function (song){

        return song.title.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm) ||
        song.genre.toLowerCase().includes(searchTerm);
    });
    displaySongs(filteredSongs);
}
//===========================================
//jquery to dynamically display the content 
//===========================================
$("searchInput").on("input" , function () {
    let searchTerm = $(this).val();
    searchSongs(searchTerm);

});

//============================================
//connect to HTML searchbar 
//============================================
//<input id="searchInput" type="text"> 