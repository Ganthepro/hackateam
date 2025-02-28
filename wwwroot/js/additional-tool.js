document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-bar");
    const searchCancel = document.querySelector(".search-cancel");

    searchCancel.addEventListener("click", function () {
        searchInput.value = "";
    });
});
