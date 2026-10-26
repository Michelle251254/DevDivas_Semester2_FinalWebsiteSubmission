//=================================
// SEARCH BAR JAVASCRIPT CLARISHA
//=================================

//===========================================
//jquery to dynamically display the content
//===========================================
$(document).ready(function () {
  $("#searchInput").on("input", function () {
    if ($("#libraryGrid").length > 0) {
      applyFilters();
    }
  });
});