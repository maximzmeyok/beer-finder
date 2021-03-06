import { shortText } from './functions.js';

export class Beer {
  constructor(obj) {
    Object.assign(this, obj);
  }

  getHtml() {
    return `
    <div>
      <img src="${this.image}" alt="Image">
      <h2 class="title-button" id="${this.id}">${this.name}</h2>
      <p>${shortText(this.description)}</p>
      <button class="button ${this.isFavorite ? 'remove-button' : 'add-button'}" id="${this.id}">${this.isFavorite ? 'Remove' : 'Add'}</button>
    </div>
    `;
  }
}