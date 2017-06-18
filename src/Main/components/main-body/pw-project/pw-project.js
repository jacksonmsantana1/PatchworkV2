/*  eslint no-underscore-dangle:0 */
export default class PwProject extends HTMLElement {
  static get observedAttributes() {
    return ['image', 'description', 'id'];
  }

  createdCallback() {
    // Setting the initial attributes
    this._id = this.getAttribute('id') || '';
    this._description = this.getAttribute('description') || '';
    this._image = this.getAttribute('image') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('id', value);
    this.render();
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
    this.setAttribute('description', value);
    this.render();
  }

  get image() {
    return this._image;
  }

  set image(value) {
    this._image = value;
    this.setAttribute('image', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<figure>
              <img src="${this.image}">
              <figcaption>${this.description}</figcaption>
            </figure>`;
  }

  get style() {
    return `<style>
              figure {
                background: #fefefe;
                border: 2px solid #fcfcfc;
                box-shadow: 0 1px 2px rgba(34, 25, 25, 0.4);
                margin: 0 2px 15px;
                padding: 15px;
                padding-bottom: 10px;
                transition: opacity .4s ease-in-out;
                display: inline-block;
                column-break-inside: avoid;
              }

              figure img {
                width: 100%; height: auto;
                border-bottom: 1px solid #ccc;
                padding-bottom: 15px;
                margin-bottom: 5px;
              }

              figure figcaption {
                font-size: .9rem;
                color: #444;
                line-height: 1.5;
              }

              @media screen and (max-width: 750px) {
                figure { width: 100%; }
                div#columns figure {
                  padding: 0.25em;
                }
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project')) {
  document.registerElement('pw-project', PwProject);
}
