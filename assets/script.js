const RENDER_EVENT = 'render_event';
// document.addEventListener('DOMContentLoaded', function () {
//   document.dispatchEvent(new Event(RENDER_EVENT));
// });

document.addEventListener(RENDER_EVENT, function () {
  fetch(`http://www.omdbapi.com/?apikey=b2ede8d5&s=${$('#search').val()}`)
    .then((response) => response.json())
    .then((response) => {
      const { Search: movies } = response;

      let cards = '';

      for (const movie of movies) {
        cards += makeCard(movie);
      }

      $('.movie').html(cards);

      $('.modal-detail-btn').on('click', function () {
        $('.modal-content').html('');
        const id = this.dataset.id;

        fetch(`http://www.omdbapi.com/?apikey=b2ede8d5&i=${id}`)
          .then((response) => response.json())
          .then((response) => {
            let detailMovie = makeMovieDetail(response);
            $('.modal-content').html(detailMovie);
          })
          .catch((e) => console.log(e));
      });
    })
    .catch((e) => console.log(e));
});

$('#search-button').on('click', function () {
  document.dispatchEvent(new Event(RENDER_EVENT));
});

$('#search').on('keypress', function (e) {
  if (e.which == 13) {
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
});

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
                <div class="col-md-3">
                  <img src="${Poster}" alt="" class="img-fluid" />
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
