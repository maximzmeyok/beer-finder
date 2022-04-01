import { Beer } from './Beer.js';
import { REGEXP, searchHistory, foundBeers, favoritesBeers } from './script.js';
import { PRODUCTS_AREA, HISTORY_AREA, FAVORITES_BUTTON } from './elements.js';

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
  PRODUCTS_AREA.innerHTML = '';
  fetch(`https://api.punkapi.com/v2/beers?page=${pageCount}&per_page=5&beer_name=${searchValue}`)
  .then(response => response.json())
  .then(beers => {
    if (!beers.length) {
      showError();
      PRODUCTS_AREA.scrollIntoView();

      return;
    }

    searchHistory.add(searchValue);
    showSearchHistory();
    showProducts(beers);
    showLoadButton();
    PRODUCTS_AREA.scrollIntoView();
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
    const isFavoriteItem = favoritesBeers.find(favoritesBeer => favoritesBeer.id === item.id) ? true : false;

    const product = new Beer({
      name: item.name,
      image: item.image_url,
      description: item.description,
      id: item.id,
      isFavorite: isFavoriteItem,
    });

    foundBeers.push(product);
    PRODUCTS_AREA.innerHTML += product.getHtml();
  });
}

export function showError() {
  const errorElement = document.createElement('div');

  errorElement.classList.add('error');
  errorElement.innerHTML = 'There were no properties found for the given location.';
  PRODUCTS_AREA.append(errorElement);
}

export function showWarning() {
  const warningElement = document.createElement('div');

  warningElement.classList.add('warning');
  warningElement.innerHTML = 'There are no more beers in this search.';
  PRODUCTS_AREA.append(warningElement);
}

export function shortText(text) {
  return `${text.substring(0, 130)}...`;
}

export function showSearchHistory() {
  HISTORY_AREA.innerHTML = '';

  if (!searchHistory.size) {
    return;
  }

  searchHistory.forEach(item => {
    const itemElement = document.createElement('div');

    itemElement.classList.add('history-item');
    itemElement.innerHTML = item;
    HISTORY_AREA.append(itemElement);
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
  PRODUCTS_AREA.append(loadButton);

  loadButton.addEventListener('click', function() {
    removeElement(loadButton);
  });
}

export function removeElement(element) {
  element.remove();
}

export function addBeerToFavorites(id) {
  const currentBeer = foundBeers.find(item => item.id == id);

  currentBeer.isFavorite = true;
  favoritesBeers.push(currentBeer);
}

export function removeBeerFromFavorites(id) {
  const currentBeerIndex = favoritesBeers.findIndex(item => item.id == id);
  
  favoritesBeers.splice(currentBeerIndex, 1);

  if (foundBeers.length) {
    const currentBeer = foundBeers.find(item => item.id == id);

    currentBeer.isFavorite = false;
  }
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

export function refreshFavoritesButton() {
  const favoritesBeersCount = favoritesBeers.length;

  if (!favoritesBeersCount) {
    FAVORITES_BUTTON.innerHTML = 'Favorites';
    
    return;
  }

  FAVORITES_BUTTON.innerHTML = `Favorites (${favoritesBeers.length})`;
}

export function showFavoriteList() {
  createModalArea();

  const modalArea = document.getElementById('modalArea');
  
  fillModalByFavorites();

  modalArea.addEventListener('click', function(event) {
    const isRemoveButton = event.target.classList.contains('remove-button');
    const modalWrapper = document.querySelector('.modal-wrapper');
    const productsAreaItem = document.getElementById(event.target.id).nextElementSibling.nextElementSibling;

    if (!isRemoveButton) {
      return;
    }

    changeButtonView(event.target);
    changeButtonView(productsAreaItem);
    removeBeerFromFavorites(event.target.id);
    refreshFavoritesButton();

    if (!favoritesBeers.length) {
      modalWrapper.remove();
      
      return;
    }

    modalArea.innerHTML ='';
    fillModalByFavorites();
  });
}

export function createModalArea() {
  const modalWrapper = document.createElement('section');

  modalWrapper.classList.add('modal-wrapper');
  modalWrapper.innerHTML = `<div class="container modal-container" id="modalArea"></div>`;
  PRODUCTS_AREA.after(modalWrapper);

  addListenersInModalArea(modalWrapper);
}

export function fillModalByFavorites() {
  favoritesBeers.forEach(item => {
    const product = new Beer({
      name: item.name,
      image: item.image,
      description: item.description,
      id: item.id,
      isFavorite: item.isFavorite,
    });

    modalArea.innerHTML += product.getHtml();
  });
}

export function showSingleItem(itemId) {
  createModalArea();

  const modalArea = document.getElementById('modalArea');
  
  fillModalBySingle(itemId);

  modalArea.addEventListener('click', function(event) {
    const isRemoveButton = event.target.classList.contains('remove-button');
    const isAddButton = event.target.classList.contains('add-button');
    const productsAreaItem = document.getElementById(event.target.id)?.nextElementSibling.nextElementSibling;

    if (isRemoveButton) {
      changeButtonView(event.target);
      changeButtonView(productsAreaItem);
      removeBeerFromFavorites(event.target.id);
      refreshFavoritesButton();
    }

    if (isAddButton) {
      changeButtonView(event.target);
      changeButtonView(productsAreaItem);
      addBeerToFavorites(event.target.id);
      refreshFavoritesButton();
    }
  });
}

export function fillModalBySingle(itemId) {
  const singleItem = foundBeers.find(item => item.id == itemId);

  const product = new Beer({
    name: singleItem.name,
    image: singleItem.image,
    description: singleItem.description,
    id: singleItem.id,
    isFavorite: singleItem.isFavorite,
  });

  modalArea.innerHTML = product.getHtml();
}

export function addListenersInModalArea(modalWrapper) {
  document.addEventListener('click', function(event) {
    const ismodalWrapper = event.target.classList.contains('modal-wrapper');

    if (ismodalWrapper) {
      modalWrapper.remove();
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.code == 'Escape') {
      modalWrapper.remove();
    }
  });
}

export function setLocalStorage() {
  localStorage.setItem('searchHistory', JSON.stringify(Array.from(searchHistory)));
  localStorage.setItem('favoritesBeers', JSON.stringify(favoritesBeers));
}

export function getLocalStorage() {
  if (localStorage.getItem('searchHistory')) {
    const searchHistoryStorage = JSON.parse(localStorage.getItem('searchHistory'));

    searchHistoryStorage.forEach(item => searchHistory.add(item));
    showSearchHistory();
  }

  if (localStorage.getItem('favoritesBeers')) {
    const favoritesBeersStorage = JSON.parse(localStorage.getItem('favoritesBeers'));

    favoritesBeersStorage.forEach(item => favoritesBeers.push(item));
    refreshFavoritesButton();
  }
}