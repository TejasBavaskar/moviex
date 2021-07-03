const API_KEY = '4a0cc1cacd55ba6273a4a990097cfd4f';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const homeBtn = document.querySelector('.home-btn');
const form = document.getElementById('form');
const searchBar = document.getElementById('searchbar');

initialize();

homeBtn.addEventListener('click', () => {
  initialize();
  searchBar.value = '';
})

function initialize() {
  const url = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
  fetchData(url);
}

async function fetchData(url) {
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
  const mainBody = document.querySelector('.main-body');
  mainBody.innerHTML = '';
  movieData.forEach(item => {
    const {title, poster_path, vote_average, overview} = item;
    const rateingColor = getColor(vote_average);
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="${IMAGE_BASE_URL + poster_path}" alt="Movie">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${rateingColor}">${vote_average}</span>
      </div>
      <div class="movie-description">
        <h3>${title}</h3>
        <p>${overview}</p>
      </div>`;

    movieCard.addEventListener('mouseover', () => {
      movieCard.style.boxShadow = `0 4px 7px 0 white, 0 6px 25px 0 ${rateingColor}`;
    })

    movieCard.addEventListener('mouseout', () => {
      movieCard.style.boxShadow = 'none';
    })

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

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const searchTerm = searchBar.value;
  if(!searchTerm) {
    console.log('No search term');
    initialize();
    return;
  }

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`;
  fetchData(url);
})