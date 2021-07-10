const API_KEY = '4a0cc1cacd55ba6273a4a990097cfd4f';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const NO_IMAGE_FOUND = 'https://www.windhorsepublications.com/wp-content/uploads/2019/11/image-coming-soon-placeholder-300x300.png';

const homeBtn = document.querySelector('.home-btn');
const form = document.getElementById('form');
const searchBar = document.getElementById('searchbar');
const prevPageBtn = document.getElementById('prev-page');
const currentPageBtn = document.getElementById('current-page');
const nextPageBtn = document.getElementById('next-page');
const leftVideoArrow = document.getElementById('left-arrow');
const rightVideoArrow = document.getElementById('right-arrow');
const filterBtn = document.getElementById('filter-btn');

let currentPageCount = 1;
let totalPagesCount = 0;
let activeVideoSlide = 0;
let totalVideos = 0;
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
  currentPageCount = 1;
  totalPagesCount = 0;
  currentPageBtn.innerText = currentPageCount;
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
  const tagList = document.querySelectorAll('.tag');
  tagList.forEach(tag => {
    tag.classList.remove('selected');
  })
}

function setGenre() {
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
    totalPagesCount = data.total_pages;
    console.log('Total: ', totalPagesCount);
    if(currentPageCount <= 1) {
      prevPageBtn.classList.add('disabled');
    }

    const headerDiv = document.getElementById('header');
    headerDiv.scrollIntoView({
      behavior: 'smooth'
    })
  })
  .catch(err => {
    console.log('Error in fetching movies data: '+ err);
  })

  if(moviesData.length === 0) {
    noMovies();
    return;
  }
  showMovies(moviesData);
}

function noMovies() {
  const mainBody = document.querySelector('.main-body');
  mainBody.innerHTML = '';
  const noResultsDiv = document.createElement('div');
  noResultsDiv.classList.add('no-movie');
  noResultsDiv.innerHTML = `<img src="https://bsmedia.business-standard.com/_media/bs/theme/faq_view_all/images/no-result-found.png" alt="No Results Found">`;
  mainBody.appendChild(noResultsDiv);

  return;
}

function showMovies(movieData) {
  const mainBody = document.querySelector('.main-body');
  mainBody.innerHTML = '';
  movieData.forEach(item => {
    const {title, poster_path, vote_average, overview, id} = item;
    const posterpath = poster_path ? IMAGE_BASE_URL + poster_path : NO_IMAGE_FOUND;
    let movieTitle = title;
    if(movieTitle.length > 38) {
      movieTitle = movieTitle.split('');
      movieTitle.splice(32, movieTitle.length - 32);
      movieTitle = movieTitle.join('') + '...';
    }

    let movieOverview = overview;
    if(movieOverview.length > 208) {
      movieOverview = movieOverview.split('');
      movieOverview.splice(205, movieOverview.length - 205);
      movieOverview = movieOverview.join('') + '...';
    }

    const knowMoreBtnId = id;
    const rateingColor = getColor(vote_average);
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="${posterpath}" alt="Movie">
      <div class="movie-info">
        <h3>${movieTitle}</h3>
        <span class="${rateingColor}">${vote_average}</span>
      </div>
      <div class="movie-description">
        <h3>${title}</h3>
        <p>${movieOverview}</p>
        <button class="know-more" id="${knowMoreBtnId}"><span>Know More</span></button>
      </div>`;

    movieCard.addEventListener('mouseover', () => {
      movieCard.style.boxShadow = `0 4px 7px 0 white, 0 6px 25px 0 ${rateingColor}`;
    })

    movieCard.addEventListener('mouseout', () => {
      movieCard.style.boxShadow = 'none';
    })

    mainBody.appendChild(movieCard);

    const knowMoreBtn = document.getElementById(knowMoreBtnId);
    knowMoreBtn.addEventListener('click', () => {
      openNav(knowMoreBtnId, title);
    })
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

nextPageBtn.addEventListener('click', () => {
  if(currentPageCount + 1 > totalPagesCount) {
    return;
  }

  currentPageCount++;
  let url = '';
  if(searchBar.value !== '') {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchBar.value}&page=${currentPageCount}`;
  } else if(selectedTags.length === 0) {
    url = `${API_URL}&api_key=${API_KEY}&page=${currentPageCount}`;
  } else {
    url = `${API_URL}&api_key=${API_KEY}&page=${currentPageCount}&with_genres=${encodeURI(selectedTags.join(','))}`;
  }
  
  fetchMovies(url);
  currentPageBtn.innerText = currentPageCount;

  if(currentPageCount > 1) {
    prevPageBtn.classList.remove('disabled');
  }

  if(currentPageCount + 1 > totalPagesCount) {
    nextPageBtn.classList.add('disabled');
  }
})

prevPageBtn.addEventListener('click', () => {
  if(currentPageCount - 1 <= 0) {
    return;
  }

  currentPageCount--;
  let url = '';
  if(searchBar.value !== '') {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchBar.value}&page=${currentPageCount}`;
  } else if(selectedTags.length === 0) {
    url = `${API_URL}&api_key=${API_KEY}&page=${currentPageCount}`;
  } else {
    url = `${API_URL}&api_key=${API_KEY}&page=${currentPageCount}&with_genres=${encodeURI(selectedTags.join(','))}`;
  }
  fetchMovies(url);
  currentPageBtn.innerText = currentPageCount;

  if(currentPageCount <= totalPagesCount) {
    nextPageBtn.classList.remove('disabled');
  }
})

/* Open when someone clicks on the span element */
function openNav(btnId, movieTitle) {
  const url = `${BASE_URL}/movie/${btnId}/videos?api_key=${API_KEY}`;
  fetch(url)
  .then(res => res.json())
  .then(videoData => {
    console.log('videoData: ', videoData);
    showVideos(videoData, movieTitle);
  })
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  stopCurrentYTVideo();
}

function showVideos(videoData,movieTitle) {
  const overlayContainer = document.getElementById('overlay-container');
  if(videoData.results.length === 0) {
    console.log('No videos found');
    overlayContainer.innerHTML = '';
    const noResultsDiv = document.createElement('div');
    noResultsDiv.classList.add('no-movie');
    noResultsDiv.style.position = 'relative';
    noResultsDiv.style.left = '35%';
    noResultsDiv.innerHTML = `<img src="https://bsmedia.business-standard.com/_media/bs/theme/faq_view_all/images/no-result-found.png" alt="No Results Found">`;
    overlayContainer.appendChild(noResultsDiv);
    return;
  }

  let embed = [];
  let dots = [];
  videoData.results.forEach((video, idx) => {
    let {name, site, key} = video;
    if(site === "YouTube") {
      embed.push(`<iframe class="embed" width="560" height="315" src="https://www.youtube.com/embed/${key}?enablejsapi=1" title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
      dots.push(`<span class="dot">${idx + 1}</span>`);
    }
  })

  let content = `
                <div class="movie-title">
                  <h1>${movieTitle}</h1>
                </div>
                </br>
                ${embed.join('')}
                </br>
                <div class="dots">${dots.join('')}</div>
              `;

  overlayContainer.innerHTML = content;
  activeVideoSlide = 0;
  showVideoIframes();
}

function showVideoIframes() {
  const embedVideoList = document.querySelectorAll('.embed');
  totalVideos = embedVideoList.length;
  embedVideoList.forEach((item, index) => {
    if(activeVideoSlide === index) {
      item.classList.remove('hide');
      item.classList.add('show');
    } else {
      item.classList.remove('show');
      item.classList.add('hide');
    }
  })

  const dotsList = document.querySelectorAll('.dot');
  dotsList.forEach((dot, idx) => {
    if(activeVideoSlide === idx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  })
}

leftVideoArrow.addEventListener('click', () => {
  if(activeVideoSlide > 0) {
    activeVideoSlide--;
  } else {
    activeVideoSlide = totalVideos-1;
  }

  stopCurrentYTVideo();
  showVideoIframes();
})

rightVideoArrow.addEventListener('click', () => {
  if(activeVideoSlide < totalVideos-1) {
    activeVideoSlide++;
  } else {
    activeVideoSlide = 0;
  }

  stopCurrentYTVideo();
  showVideoIframes();
})

function stopCurrentYTVideo() {
  document.querySelector('.embed.show').contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
}

filterBtn.addEventListener('click', () => {
  const tagsFilterDiv = document.querySelector('.tags-filter');
  
  if(tagsFilterDiv.classList.contains('active')) {
    tagsFilterDiv.classList.remove('active');
  } else {
    tagsFilterDiv.classList.add('active');
  }
})
