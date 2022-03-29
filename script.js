import { searchInput, searchButton } from './elements.js';
import { isValidRequest, markInvalid, markValid, makeRequest } from './functions.js';

export const REGEXP = new RegExp("^[a-zA-Z0-9а-яА-ЯёЁ ]+$");
export const searchHistory = new Set();

export let pageCount = 1;

searchButton.addEventListener('click', function() {
  const searchValue = searchInput.value;

  if (isValidRequest(searchValue)) {
    makeRequest(pageCount, searchValue);
  } else {
    markInvalid(searchInput);
  }
});

searchInput.addEventListener('keydown', function(event) {
  const searchValue = searchInput.value;
  const buttonCode = event.code;

  markValid(searchInput);

  if (buttonCode === 'Enter' && isValidRequest(searchValue)) {
    makeRequest(pageCount, searchValue);
  } else if (buttonCode === 'Enter' && !isValidRequest(searchValue)) {
    markInvalid(searchInput);
  }
});