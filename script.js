import { searchInput, searchButton, productsArea, arrowButton } from './elements.js';
import { isValidRequest, markInvalid, markValid, searchProducts, searchMoreProducts } from './functions.js';

export const REGEXP = new RegExp("^[a-zA-Z0-9а-яА-ЯёЁ ]+$");
export const searchHistory = new Set();

let pageCount = 1;

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
  
  if (isLoadMoreButton) {
    pageCount++;
    searchMoreProducts(pageCount, searchInput.value);
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