const APIURL =
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";

let page = 1;
let totalPages = 1;
let isFetching = false;
const movieList = document.querySelector(".movie-list");
const searchInput = document.getElementById("search");

const paginationContainer = document.createElement("div");
paginationContainer.classList.add("pagination");

document.querySelector(".content-container").appendChild(paginationContainer);

async function getMovies(url, newSearch = false) {
    if (isFetching) return;
    isFetching = true;

    const response = await fetch(url);
    const data = await response.json();

    if (newSearch) {
        movieList.innerHTML = "";
        page = 1;
    }

    totalPages = data.total_pages;
    showMovies(data.results);
    updatePagination();
    isFetching = false;
}

function showMovies(movies) {
    movieList.innerHTML = ""; // Clear previous movies
    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, id } = movie;

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-cards");

        movieCard.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${title}" class="movie-img">
            
            <div class="movie-overlay">
                <div class="movie-video">
                    <button class="movie-button" data-movie-id="${id}">Watch Now</button>
                    <button class="movie-button-watchlist"><i class="fas fa-plus"></i></button>
                </div>

                <h1 class="movie-title">${title}</h1>
                <span class="movie-rating">⭐ ${vote_average.toFixed(1)}</span>

                <p class="movie-desc">${overview ? overview.slice(0, 100) + "..." : "No description available."}</p>
            </div>
        `;

        movieList.appendChild(movieCard);
    });
}

function updatePagination() {
    paginationContainer.innerHTML = `
        <button id="prevPage" ${page === 1 ? "disabled" : ""}>Previous</button>
        <span>Page ${page} of ${totalPages}</span>
        <button id="nextPage" ${page === totalPages ? "disabled" : ""}>Next</button>
    `;

    document.getElementById("prevPage").addEventListener("click", () => {
        if (page > 1) {
            page--;
            getMovies(APIURL + page);
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if (page < totalPages) {
            page++;
            getMovies(APIURL + page);
        }
    });
}

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm, true);
    } else {
        getMovies(APIURL + page, true);
    }
});

// Initial load
getMovies(APIURL + page);


const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
    ".container,.heading,.navbar-container,.sidebar,.left-menu-icon,.toggle,.toggle-icon,#search,.profile-picture,.footer-container,.copyright,.footer-info"
);

let isStatus = true;

function toggleMode() {
    if (isStatus) {
        ball.classList.add("active");
        items.forEach(item => {
            item.classList.add("active");
        });
    } else {
        ball.classList.remove("active");
        items.forEach(item => {
            item.classList.remove("active");
        });
    }
    isStatus = !isStatus;
}

ball.addEventListener("click", toggleMode);

async function playVideo(movieId) {
    const API_KEY = "04c35731a5ee918f014970082a0088b1";
    const videoContainer = document.querySelector(".video-container");
    const videoFrame = document.querySelector("#video-frame");

    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await response.json();

    const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");

    if (trailer) {
        videoFrame.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&origin=${window.location.origin}`;
        videoFrame.setAttribute("allow", "autoplay; encrypted-media");
        videoContainer.style.display = "block";
    } else {
        alert("Trailer not available for this movie.");
    }
}

document.querySelector(".close-video").addEventListener("click", () => {
    document.querySelector(".video-container").style.display = "none";
    document.querySelector("#video-frame").src = "";
});

document.addEventListener("click", async function (event) {
    if (event.target.classList.contains("movie-button")) {
        const movieId = event.target.getAttribute("data-movie-id");
        if (movieId) {
            await playVideo(movieId);
        }
    }
});


//sidebar 
document.addEventListener("DOMContentLoaded", function () {
    const sidebarItems = document.querySelectorAll(".sidebar-item");

    sidebarItems.forEach((item) => {
        item.addEventListener("click", () => {
            sidebarItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");
        });
    });
});


