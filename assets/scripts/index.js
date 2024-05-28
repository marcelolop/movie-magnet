'use strict';

// Imports
import { movies } from './data/movie_data.js';
import * as utils from './utils/utils.js';

// Selectors
const searchInput = utils.select('.search-bar');
const searchBtn = utils.select('.search-btn');
const resultsContainer = utils.select('.results-container');
const moviePoster = utils.select('.movie-poster-img');
const movieTitle = utils.select('.movie-title');
const movieYear = utils.select('.movie-year');
const movieRating = utils.select('.movie-rating');
const movieDuration = utils.select('.movie-duration');
const movieDescription = utils.select('.movie-description');
const movieGenres = utils.select('.movie-genres');
const movieDirector = utils.select('.movie-director');
const movieCast = utils.select('.movie-cast');

//Function Autocomplete
//Detecting user input in search bar and displaying suggestions based on user input
function autocomplete() {
  const searchTerm = searchInput.value.toLowerCase();
  const suggestions = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm));

  utils.select('.suggestions-container').innerHTML = '';

  const states = {
    'empty': () => {
      utils.select('.suggestions-container').classList.add('hidden');
      searchInput.classList.remove('suggestions-visible'); // Remove the class when suggestions are not visible
    },
    'found': () => {
      utils.select('.suggestions-container').classList.remove('hidden');
      searchInput.classList.add('suggestions-visible'); // Add the class when suggestions are visible
      suggestions.slice(0, Math.min(5, suggestions.length)).forEach(suggestion => {
        const suggestionElement = utils.create('li');
        suggestionElement.classList.add('suggestion');
        suggestionElement.textContent = suggestion.title;
        suggestionElement.addEventListener('click', () => {
          searchInput.value = suggestion.title;
          searchInput.dispatchEvent(new Event('input'));
          utils.select('.suggestions-container').classList.add('hidden');
          searchInput.classList.remove('suggestions-visible'); // Remove the class when a suggestion is clicked
        });
        utils.select('.suggestions-container').appendChild(suggestionElement);
      });
    },
    'notFound': () => {
      utils.select('.suggestions-container').classList.remove('hidden');
      searchInput.classList.add('suggestions-visible'); // Add the class when suggestions are visible
      const noMoviesElement = utils.create('li');
      noMoviesElement.classList.add('suggestion');
      noMoviesElement.textContent = 'No Movies Found';
      utils.select('.suggestions-container').appendChild(noMoviesElement);
    }
  };

  const searchState = searchTerm === '' ? 'empty' : (suggestions.length > 0 ? 'found' : 'notFound');

  states[searchState]();
}
// Variables
let movieIndex = 0;
let searchResults = [];

// Function searchMovies
// Search movies based on user input in search bar and call displayMovie function to display results within 
//results container
function searchMovies() {
  const query = searchInput.value.toLowerCase();
  
  // If the query is empty, do nothing
  if (query === '') {
    return;
  }
  
  // If the query is too short or if the query does not match any movie, do nothing
  if (query.length < 3 || !movies.some(movie => movie.title.toLowerCase() === query)) {
    searchResults = [];
    displayMovie();
    return;
  }
  
  // If the searched movie is the same as the currently displayed one , do nothing
  if (searchResults.length > 0 && searchResults[movieIndex].title.toLowerCase() === query) {
    return;
  }
  
  searchResults = movies.filter(movie => movie.title.toLowerCase().includes(query));
  displayMovie();
}

// Function displayMovie
// Display movie details based on user input in search bar and fetch results from searchResults array
function displayMovie() {
  if (searchResults.length > 0) {
    const movie = searchResults[movieIndex];
    resultsContainer.classList.remove('hidden');
    moviePoster.src = movie.poster;
    // Add animation
    resultsContainer.style.animation = 'none';
    setTimeout(function() {
      resultsContainer.style.animation = '';
    }, 10);
    setTimeout(() => {
      movieTitle.textContent = movie.title;
      movieYear.textContent = movie.year;
      movieRating.textContent = movie.rating;
      movieDuration.textContent = movie.runningTime;
      movieDescription.textContent = movie.description;
      movieGenres.innerHTML = '';
      movie.genre.forEach(genre => { 
        const genreElement = document.createElement('p');
        genreElement.classList.add('genre');
        genreElement.textContent = genre;
        movieGenres.appendChild(genreElement);
      })
      movieDirector.textContent = movie.director;
      movieCast.innerHTML = '';
      const castElement = document.createElement('p');
      castElement.classList.add('cast');
      castElement.textContent = movie.cast.join(', ');
      movieCast.appendChild(castElement);
    }, 200);
  } else {
    resultsContainer.classList.add('hidden');
  }
}

// Event listeners
utils.listen('click', searchBtn, searchMovies);
utils.listen('input', searchInput, autocomplete);

//Event Listener for pressing enter
utils.listen('keydown', document, (event) => {
  if (event.key === 'Enter') {
    searchMovies();
  }
});

// Initial display
displayMovie();