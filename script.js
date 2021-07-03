const API_KEY = '4a0cc1cacd55ba6273a4a990097cfd4f';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

fetchData()

async function fetchData() {
  const url = `${API_URL}&api_key=${API_KEY}`;
  let moviesData = [];

  await fetch(url)
  .then(res => {
    return res.json();
  })
  .then(data => {
    moviesData = data?.results;
    console.log('MoviesData: ', moviesData);
  })
  .catch(err => {
    console.log('Error in fetching movies data: '+ err);
  })

  showMovies(moviesData);
}

function showMovies(movieData) {
  console.log('In showmovie fun');
  const mainBody = document.querySelector('.main-body');
  mainBody.innerHTML = '';
  movieData.forEach(item => {
    const {title, poster_path, vote_average, overview} = item;

    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="${IMAGE_BASE_URL + poster_path}" alt="Movie">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
      </div>
      <div class="movie-description">
        <h3>${title}</h3>
        <p>${overview}</p>
      </div>`;

    mainBody.appendChild(movieCard);
  });
}

function getColor(rating) {
  if(rating >= 7) {
    return 'green';
  } else if(rating >= 4) {
    return 'orange';
  } else {
    return 'red';
  }
}