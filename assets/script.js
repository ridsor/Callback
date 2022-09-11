const RENDER_EVENT = 'render_event';
const search = document.getElementById('search');
const btnSearch = document.getElementById('search-button');

// document.addEventListener('DOMContentLoaded', function () {
//   document.dispatchEvent(new Event(RENDER_EVENT));
// });

document.addEventListener(RENDER_EVENT, async function () {
  const movies = await getMovies(search.value);

  updateUI(movies);
});

btnSearch.addEventListener('click', function () {
  document.dispatchEvent(new Event(RENDER_EVENT));
});

search.addEventListener('keyup', function (e) {
  if (e.which == 13) {
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
});

// event binding merupakan event untuk element yang belum ada
document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('modal-detail-btn')) {
    const id = e.target.dataset.id;

    document.querySelector('.modal-content').innerHTML = makeLoaderForModal();

    const movieDetail = await getMovieDetail(id);

    updateUIMovieDetail(movieDetail);
  }
});

const updateUIMovieDetail = (movie) => {
  const elementMovieDetail = makeMovieDetail(movie);

  document.querySelector('.modal-content').innerHTML = elementMovieDetail;
};

const getMovieDetail = (id) => {
  return fetch(`http://www.omdbapi.com/?apikey=b2ede8d5&i=${id}`)
    .then((r) => r.json())
    .catch((e) => console.log(e));
};

const updateUI = (movies) => {
  let elementMovies = '';

  movies.forEach((movie) => (elementMovies += makeCard(movie)));

  document.querySelector('.movie').innerHTML = elementMovies;
};

const getMovies = (keyword) => {
  return fetch(`http://www.omdbapi.com/?apikey=b2ede8d5&s=${keyword}`)
    .then((r) => r.json())
    .then((r) => r.Search)
    .catch((e) => console.log(e));
};

const makeCard = ({ Title, Year, Poster, imdbID }) => {
  return `<div class="p-1">
              <div class="card">
                <img src="${Poster}" alt="${Title}" class="card-img-top poster"/>
                <div class="card-body">
                  <h5 class="card-title">${Title}</h5>
                  <small class="text-muted year">${Year}</small>
                </div>
                <div class="card-footer">
                  <button type="button" class="btn btn-primary modal-detail-btn" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-id="${imdbID}">Show Details</button>
                </div>
              </div>
            </div>`;
};

const makeMovieDetail = ({ Title, Year, Actors, Director, Writer, Genre, Plot, Poster }) => {
  return `<div class="modal-header">
            <h4 class="modal-title" id="exampleModalLabel">${Title} (${Year})</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-3 text-center">
                  <img src="${Poster}" alt="${Title}" class="img-fluid poster" />
                </div>
                <div class="col-md">
                  <ul class="list-group">
                    <li class="list-group-item"><strong>Director : </strong>${Director}</li>
                    <li class="list-group-item"><strong>Actors : </strong>${Actors}</li>
                    <li class="list-group-item"><strong>Writer : </strong>${Writer}</li>
                    <li class="list-group-item"><strong>Genre : </strong>${Genre}</li>
                    <li class="list-group-item">
                      <strong>Plot : </strong><br />
                      ${Plot}
                    </li>
                  </ul>
                </div>
                </div>
            </div>
          </div>
          <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>`;
};

const makeLoaderForModal = () => {
  return `<div class="modal-body">
    <div class="container-fluid text-center">
      <img src="./assets/img/loader.gif" alt="">
    </div>
  </div>`;
};
