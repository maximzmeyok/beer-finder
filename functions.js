import { Beer } from './Beer.js';
import { REGEXP, searchHistory, foundBeers, fovoritesBeers } from './script.js';
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

export function searchProducts(pageCount, searchValue) {
  productsArea.innerHTML = '';
  fetch(`https://api.punkapi.com/v2/beers?page=${pageCount}&per_page=5&beer_name=${searchValue}`)
  .then(response => response.json())
  .then(beers => {
    if (!beers.length) {
      showError();
      productsArea.scrollIntoView();

      return;
    }

    searchHistory.add(searchValue);
    showSearchHistory();
    showProducts(beers);
    showLoadButton();
    productsArea.scrollIntoView();
  });
}

export function searchMoreProducts(pageCount, searchValue) {
  fetch(`https://api.punkapi.com/v2/beers?page=${pageCount}&per_page=6&beer_name=${searchValue}`)
  .then(response => response.json())
  .then(beers => {
    if (!beers.length) {
      showWarning();

      return;
    }

    showProducts(beers);
    showLoadButton();
  });
}

export function showProducts(products) {
  products.forEach(item => {
    const product = new Beer({
      name: item.name,
      image: item.image_url,
      description: item.description,
      id: item.id,
    });

    foundBeers.push(product);
    productsArea.innerHTML += product.getHtml();
  });
}

export function showError() {
  const errorElement = document.createElement('div');

  errorElement.classList.add('error');
  errorElement.innerHTML = 'There were no properties found for the given location.';
  productsArea.append(errorElement);
}

export function showWarning() {
  const warningElement = document.createElement('div');

  warningElement.classList.add('warning');
  warningElement.innerHTML = 'There are no more beers in this search.';
  productsArea.append(warningElement);
}

export function shortText(text) {
  return `${text.substring(0, 130)}...`;
}

export function showSearchHistory() {
  historyArea.innerHTML = '';

  if (!searchHistory.size) {
    return;
  }

  searchHistory.forEach(item => {
    const itemElement = document.createElement('div');

    itemElement.classList.add('history-item');
    itemElement.innerHTML = item;
    historyArea.append(itemElement);
  });
}

export function isValidProduct(object) {
  return !object.id || !object.name || !object.image_url || !object.description;
}

export function showLoadButton() {
  const loadButton = document.createElement('div');

  loadButton.classList.add('load-button');
  loadButton.id = 'loadButton';
  loadButton.innerHTML = 'Load more';
  productsArea.append(loadButton);

  loadButton.addEventListener('click', function() {
    removeElement(loadButton);
  });
}

export function removeElement(element) {
  element.remove();
}

export function addBeerToFavorites(id) {
  const currentBeer = foundBeers.find(item => item.id == id);

  fovoritesBeers.push(currentBeer);
}

export function removeBeerFromFavorites(id) {
  const currentBeerIndex = fovoritesBeers.findIndex(item => item.id == id);

  fovoritesBeers.splice(currentBeerIndex, 1);
}

export function changeButtonView(element) {
  const isAddButton = element.classList.contains('add-button');

  if (isAddButton) {
    element.classList.remove('add-button');
    element.classList.add('remove-button');
    element.innerHTML = 'Remove';
    
    return;
  }

  element.classList.remove('remove-button');
  element.classList.add('add-button');
  element.innerHTML = 'Add';
}