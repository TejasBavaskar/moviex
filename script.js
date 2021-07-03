const API_KEY = '4a0cc1cacd55ba6273a4a990097cfd4f';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const NO_IMAGE_FOUND = 'https://www.windhorsepublications.com/wp-content/uploads/2019/11/image-coming-soon-placeholder-300x300.png';

const homeBtn = document.querySelector('.home-btn');
const form = document.getElementById('form');
const searchBar = document.getElementById('searchbar');

const genreData = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ];
let selectedTags = [];

initialize();

homeBtn.addEventListener('click', () => {
  initialize();
  clearSearchBar();
  clearTags();
})

function initialize() {
  setGenre();
  const url = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
  fetchMovies(url);
}

function clearSearchBar() {
  searchBar.value = '';
}

function clearTags() {
  selectedTags = [];
}

function setGenre() {
  console.log('genreData: ',genreData);
  
  const genreDiv = document.querySelector('.tags-filter');
  genreDiv.innerHTML = '';
  genreData.forEach(item => {
    const tagElement = document.createElement('div');
    tagElement.classList.add('tag');
    tagElement.id = item.id;
    tagElement.innerText = item.name;

    tagElement.addEventListener('click', () => {
      clearSearchBar();
      if(selectedTags.includes(tagElement.id)) {
        selectedTags.splice(selectedTags.indexOf(tagElement.id), 1);
        tagElement.classList.remove('selected');
      } else {
        selectedTags.push(tagElement.id);
        tagElement.classList.add('selected');
      }
      console.log('selectedTags: ', selectedTags);
      const url = `${API_URL}&api_key=${API_KEY}&with_genres=${encodeURI(selectedTags.join(','))}`;
      fetchMovies(url);
    })

    genreDiv.appendChild(tagElement);
  })
}

async function fetchMovies(url) {
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
    const posterpath = poster_path ? IMAGE_BASE_URL + poster_path : NO_IMAGE_FOUND;
    const rateingColor = getColor(vote_average);
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="${posterpath}" alt="Movie">
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
  clearTags();
  const searchTerm = searchBar.value;
  if(!searchTerm) {
    console.log('No search term');
    initialize();
    return;
  }

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`;
  fetchMovies(url);
})