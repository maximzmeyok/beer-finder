import { shortText } from './functions.js';

export class Beer {
  constructor(obj) {
    Object.assign(this, obj);
  }

  getHtml() {
    return `
    <div>
      <img src="${this.image}" alt="Image">
      <h2 id="${this.id}">${this.name}</h2>
      <p>${shortText(this.description)}</p>
      <button class="button add-button" id="${this.id}">Add</button>
    </div>
    `;
  }
}