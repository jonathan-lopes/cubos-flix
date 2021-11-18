const moviesContainer = document.querySelector(".movies");
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
const input = document.querySelector(".input");
const body = document.querySelector("body");
const btnTheme = document.querySelector(".btn-theme");

const highlightVideoLink = document.querySelector(".highlight__video-link");
const highlightVideo = document.querySelector(".highlight__video");
const highlightTitle = document.querySelector(".highlight__title");
const highlightRating = document.querySelector(".highlight__rating");
const highlightGenres = document.querySelector(".highlight__genres");
const highlightLaunch = document.querySelector(".highlight__launch");
const highlightDescription = document.querySelector(".highlight__description");
const highlightSubtitle = document.querySelector(".subtitle");
const highlightInfo = document.querySelector(".highlight__info");
const highlightGenreLaunch = document.querySelector(".highlight__genre-launch");

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal__title");
const modalDescription = document.querySelector(".modal__description");
const modalImage = document.querySelector(".modal__img");
const modalClose = document.querySelector(".modal__close");
const modalAverage = document.querySelector(".modal__average");
const modalGenres = document.querySelector(".modal__genres");

let currentPage = 0;
let currentMovies = [];

const moviesUrlHome =
  "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false";

btnNext.addEventListener("click", next);
btnPrev.addEventListener("click", previous);
input.addEventListener("keydown", search);
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", closeModal);
btnTheme.addEventListener("click", changeTheme);

localStorage.getItem("theme") === "dark" ? themeDark() : themeLight();

for (const modalChild of modal.children) {
  modalChild.addEventListener("click", (e) => e.stopPropagation());
}

function changeTheme() {
  localStorage.getItem("theme") === "dark" ? themeLight() : themeDark();
}

function themeDark() {
  localStorage.setItem("theme", "dark");
  btnTheme.src = "./assets/dark-mode.svg";
  btnPrev.src = "./assets/seta-esquerda-branca.svg";
  btnNext.src = "./assets/seta-direita-branca.svg";

  body.style.setProperty("--color-backgroud-body", "#242424");
  highlightSubtitle.style.setProperty(
    "--color-input-description-highlight__subtitle",
    "#FFFFFF"
  );
  highlightGenres.style.setProperty(
    "--color-highlight__genre-launch",
    "#FFFFFFB3"
  );
  highlightDescription.style.setProperty(
    "--color-input-description-highlight__subtitle",
    "#FFFFFF"
  );
  highlightInfo.style.setProperty("--color-highlight__info", "#FFFFFF26");
  highlightGenreLaunch.style.setProperty(
    "--color-highlight__genre-launch",
    "#ffffffb3"
  );
  input.style.setProperty(
    "--color-input-description-highlight__subtitle",
    "#FFFFFF"
  );
}

function themeLight() {
  localStorage.setItem("theme", "ligth");
  btnTheme.src = "./assets/light-mode.svg";
  btnPrev.src = "./assets/seta-esquerda-preta.svg";
  btnNext.src = "./assets/seta-direita-preta.svg";

  body.style.setProperty("--color-backgroud-body", "#FFFFFF");
  highlightSubtitle.style.setProperty(
    "--color-input-description-highlight__subtitle",
    "#000000"
  );
  highlightGenres.style.setProperty(
    "--color-highlight__genre-launch",
    "#000000B3"
  );
  highlightDescription.style.setProperty(
    "--color-input-description-highlight__subtitle",
    "#000000"
  );
  highlightInfo.style.setProperty("--color-highlight__info", "#00000026");
  highlightGenreLaunch.style.setProperty(
    "--color-highlight__genre-launch",
    "#000000b3"
  );
  input.style.setProperty(
    "--color-input-description-highlight__subtitle",
    "#000000"
  );
}

async function openModal(id) {
  modal.classList.remove("hidden");
  body.style.overflow = "hidden";

  const data = await request(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
  );

  modalTitle.textContent = data.title;
  modalImage.src = "";
  modalImage.src = data.backdrop_path;
  modalImage.alt = `Poster ${data.title}`;
  modalDescription.textContent = data.overview;
  modalAverage.textContent = data.vote_average;
  modalGenres.textContent = "";
  data.genres.forEach((genre) => {
    const modalGenre = document.createElement("span");
    modalGenre.textContent = genre.name;
    modalGenre.classList.add("modal__genre");

    modalGenres.append(modalGenre);
  });
}

function closeModal() {
  body.style.overflowY = "auto";
  modal.classList.add("hidden");
}

function search(event) {
  if (event.key !== "Enter") return;

  if (!input.value) {
    loadMovies();
    return;
  }

  loadSearchMovies(input.value);
  input.value = "";
}

async function loadSearchMovies(search) {
  try {
    const { results } = await request(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${search}`
    );

    console.log(results);

    currentMovies = results;
    displayMovies();
  } catch (error) {
    console.log(error);
  }
}

function next() {
  currentPage === 3 ? (currentPage = 0) : currentPage++;
  displayMovies();
}

function previous() {
  currentPage === 0 ? (currentPage = 3) : currentPage--;
  displayMovies();
}

async function request(endpoint) {
  try {
    const movieList = await (await fetch(endpoint)).json();
    return movieList;
  } catch (error) {
    console.error(error);
  }
}

async function loadHighlightMovie() {
  const highlight = await request(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
  );

  highlightVideo.style.backgroundImage = `url(${highlight.backdrop_path})`;
  highlightTitle.textContent = highlight.title;
  highlightRating.textContent = highlight.vote_average;
  highlightGenres.textContent = highlight.genres
    .map((genre) => genre.name)
    .join(", ");
  highlightLaunch.textContent = new Date(
    highlight.release_date
  ).toLocaleDateString("pt-br", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  highlightDescription.textContent = highlight.overview;

  const { results: highlightLink } = await request(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
  );

  highlightVideoLink.href = `https://www.youtube.com/watch?v=${highlightLink[1].key}`;
}

function displayMovies() {
  moviesContainer.innerHTML = "";

  for (let i = currentPage * 5; i < (currentPage + 1) * 5; i++) {
    const movie = currentMovies[i];

    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie");
    movieContainer.style.backgroundImage = `url(${movie.poster_path})`;

    movieContainer.addEventListener("click", () => openModal(movie.id));

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie__info");

    const movieTitle = document.createElement("span");
    movieTitle.classList.add("movie__title");
    movieTitle.textContent = movie.title;

    const star = document.createElement("img");
    star.classList.add("movie__star");
    star.src = "./assets/estrela.svg";
    star.alt = "Estrela";

    const movieRating = document.createElement("span");
    movieRating.classList.add("movie__rating");

    movieRating.append(star, movie.vote_average);

    movieInfo.append(movieTitle, movieRating);
    movieContainer.append(movieInfo);
    moviesContainer.append(movieContainer);
  }
}

async function loadMovies() {
  try {
    const { results } = await request(moviesUrlHome);
    currentMovies = results;
    displayMovies();
  } catch (error) {
    console.log(error);
  }
}

loadMovies();
loadHighlightMovie();
