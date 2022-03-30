import { shortText } from './functions.js';

export class Beer {
  constructor(obj) {
    Object.assign(this, obj);
  }

  getHtml() {
    return `
    <div>
      <img src="${this.image}" alt="Image">
      <h2>${this.name}</h2>
      <p>${shortText(this.description)}</p>
      <button class="button">Add</button>
    </div>
    `;
  }
}