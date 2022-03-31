import { searchInput, searchButton, productsArea, arrowButton, historyArea, favoritesButton } from './elements.js';
import { isValidRequest, markInvalid, markValid, searchProducts, searchMoreProducts, addBeerToFavorites, removeBeerFromFavorites, changeButtonView, refreshFavoritesButton, showFavoriteList } from './functions.js';

export const REGEXP = new RegExp("^[a-zA-Z0-9а-яА-ЯёЁ ]+$");
export const searchHistory = new Set();
export const foundBeers = [];
export const favoritesBeers = [];

export let pageCount = 1;

searchButton.addEventListener('click', function() {
  const searchValue = searchInput.value;

  if (isValidRequest(searchValue)) {
    pageCount = 1;
    searchProducts(pageCount, searchValue);
  } else {
    markInvalid(searchInput);
  }
});

searchInput.addEventListener('keydown', function(event) {
  const searchValue = searchInput.value;
  const buttonCode = event.code;

  markValid(searchInput);

  if (buttonCode === 'Enter' && isValidRequest(searchValue)) {
    pageCount = 1;
    searchProducts(pageCount, searchValue);
  } else if (buttonCode === 'Enter' && !isValidRequest(searchValue)) {
    markInvalid(searchInput);
  }
});

productsArea.addEventListener('click', function(event) {
  const isLoadMoreButton = event.target.classList.contains('load-button');
  const isAddButton = event.target.classList.contains('add-button');
  const isRemoveButton = event.target.classList.contains('remove-button');
  
  if (isLoadMoreButton) {
    pageCount++;
    searchMoreProducts(pageCount, searchInput.value);
  }

  if (isAddButton) {
    changeButtonView(event.target);
    addBeerToFavorites(event.target.id);
    refreshFavoritesButton();
  }

  if (isRemoveButton) {
    changeButtonView(event.target);
    removeBeerFromFavorites(event.target.id);
    refreshFavoritesButton();
  }
});

document.addEventListener('scroll', function() {
  if (window.scrollY === 0) {
    arrowButton.classList.add('hide');
    
    return;
  }

  arrowButton.classList.remove('hide');
});

arrowButton.addEventListener('click', function() {
  document.body.scrollIntoView();
});

historyArea.addEventListener('click', function(event) {
  const isHistoryItem = event.target.classList.contains('history-item');
  const searchValue = event.target.innerHTML;

  if (isHistoryItem) {
    pageCount = 1;
    searchInput.value = searchValue;
    searchProducts(pageCount, searchValue);
  }
});

favoritesButton.addEventListener('click', function() {
  if (!favoritesBeers.length) {
    return;
  }
  
  showFavoriteList();
});