import { Beer } from './Beer.js';
import { REGEXP, searchHistory } from './script.js';
import { productsArea } from './elements.js';

export function isValidRequest(searchRequest) {
  return searchRequest.match(REGEXP);
}

export function markInvalid(element) {
  element.classList.add('invalid');
}

export function markValid(element) {
  element.classList.remove('invalid');
}

export function makeRequest(pageCount, searchValue) {
  productsArea.innerHTML = '';
  fetch(`https://api.punkapi.com/v2/beers?page=${pageCount}&per_page=12&beer_name=${searchValue}`)
  .then(response => response.json())
  .then(beers => {
    if (beers.length === 0) {
      showError();
      productsArea.scrollIntoView();
      return;
    }

    searchHistory.add(searchValue);
    showSearchHistory();
    showProducts(beers);
    productsArea.scrollIntoView();
  });
}

export function showProducts(products) {
  products.forEach(item => {
    if (areAllProperties(item)) {
      return;
    }

    const product = new Beer({
      name: item.name,
      image: item.image_url,
      description: item.description,
      id: item.id,
    });

    productsArea.innerHTML += product.getHtml();
  });
}

export function showError() {
  const errorElement = document.createElement('div');

  errorElement.classList.add('error');
  errorElement.innerHTML = 'There were no properties found for the given location.';
  productsArea.append(errorElement);
}

export function shortText(text) {
  return `${text.substring(0, 130)}...`;
}

export function showSearchHistory() {
  historyArea.innerHTML = '';

  if (searchHistory.length === 0) {
    return;
  }

  searchHistory.forEach(item => {
    const itemElement = document.createElement('div');

    itemElement.innerHTML = item;
    historyArea.append(itemElement);
  });
}

export function areAllProperties(object) {
  return object.id === null || object.name === null || object.image_url === null || object.description === null;
}