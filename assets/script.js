const RENDER_EVENT = 'render_event';

document.addEventListener(RENDER_EVENT, function () {
  $.ajax({
    url: 'http://www.omdbapi.com/',
    data: {
      apikey: 'b2ede8d5',
      s: $('#search').val(),
    },
    method: 'get',
    dataType: 'json',
    success: (results) => {
      const { Search: movies } = results;

      let cards = '';

      for (const movie of movies) {
        cards += makeCard(movie);
      }

      $('.movie').html(cards);

      $('.modal-detail-btn').on('click', function () {
        $('.modal-content').html('');
        const id = this.dataset.id;

        $.ajax({
          url: `http://www.omdbapi.com/`,
          data: {
            apikey: 'b2ede8d5',
            i: id,
          },
          method: 'get',
          dataType: 'json',
          success: (results) => {
            let detailMovie = makeMovieDetail(results);
            $('.modal-content').html(detailMovie);
          },
          erorr: (e) => console.log(e),
        });
      });
    },
    error: (e) => console.log(e),
  });
});

$('#button-addon2').on('click', function () {
  document.dispatchEvent(new Event(RENDER_EVENT));
});

$('#search').on('keypress', function (e) {
  if (e.which == 13) {
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
});

function makeCard({ Title, Year, Poster, imdbID }) {
  return `<div class="col-xl-3 p-0 col-lg-4 col-md-6 col-10">
              <div class="card">
                <img src="${Poster}" alt="${Title}" class="card-img-top"/>
                <div class="card-body">
                  <h5 class="card-title">${Title}</h5>
                  <small class="text-muted">${Year}</small>
                </div>
                <div class="card-footer">
                  <button type="button" class="btn btn-primary modal-detail-btn" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-id="${imdbID}">Show Details</button>
                </div>
              </div>
            </div>`;
}

function makeMovieDetail({ Title, Year, Actors, Director, Writer, Genre, Plot, Poster }) {
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
}
