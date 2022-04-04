import { SEARCH_INPUT, SEARCH_BUTTON, PRODUCTS_AREA, ARROW_BUTTON, HISTORY_AREA, FAVORITES_BUTTON } from './elements.js';
import { isValidRequest, markInvalid, markValid, searchProducts, searchMoreProducts, addBeerToFavorites, removeBeerFromFavorites, changeButtonView, refreshFavoritesButton, showFavoriteList, showSingleItem, setLocalStorage, getLocalStorage } from './functions.js';

export const REGEXP = new RegExp("^[a-zA-Z0-9а-яА-ЯёЁ ]+$");
export const searchHistory = new Set();
export const foundBeers = [];
export const favoritesBeers = [];

export let pageCount = 1;

SEARCH_BUTTON.addEventListener('click', function() {
  const searchValue = SEARCH_INPUT.value;

  if (isValidRequest(searchValue)) {
    pageCount = 1;
    searchProducts(pageCount, searchValue);
  } else {
    markInvalid(SEARCH_INPUT);
  }
});

SEARCH_INPUT.addEventListener('keydown', function(event) {
  const searchValue = SEARCH_INPUT.value;
  const buttonCode = event.code;

  markValid(SEARCH_INPUT);

  if (buttonCode === 'Enter' && isValidRequest(searchValue)) {
    pageCount = 1;
    searchProducts(pageCount, searchValue);
  } else if (buttonCode === 'Enter' && !isValidRequest(searchValue)) {
    markInvalid(SEARCH_INPUT);
  }
});

PRODUCTS_AREA.addEventListener('click', function(event) {
  const isLoadMoreButton = event.target.classList.contains('load-button');
  const isAddButton = event.target.classList.contains('add-button');
  const isRemoveButton = event.target.classList.contains('remove-button');
  const isTitleButton = event.target.classList.contains('title-button');
  
  if (isLoadMoreButton) {
    pageCount++;
    searchMoreProducts(pageCount, SEARCH_INPUT.value);
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

  if (isTitleButton) {
    showSingleItem(event.target.id);
  }
});

document.addEventListener('scroll', function() {
  if (window.scrollY === 0) {
    ARROW_BUTTON.classList.add('hide');
    
    return;
  }

  ARROW_BUTTON.classList.remove('hide');
});

ARROW_BUTTON.addEventListener('click', function() {
  document.body.scrollIntoView();
});

HISTORY_AREA.addEventListener('click', function(event) {
  const isHistoryItem = event.target.classList.contains('history-item');
  const searchValue = event.target.innerHTML;

  if (isHistoryItem) {
    pageCount = 1;
    SEARCH_INPUT.value = searchValue;
    searchProducts(pageCount, searchValue);
  }
});

FAVORITES_BUTTON.addEventListener('click', function() {
  if (!favoritesBeers.length) {
    return;
  }
  
  showFavoriteList();
});

window.addEventListener('beforeunload', setLocalStorage);

window.addEventListener('load', getLocalStorage);