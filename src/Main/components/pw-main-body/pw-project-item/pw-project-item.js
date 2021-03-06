import H from '../../../../lib/Helper/Helper';
import './pw-show-button/pw-show-button';

/*  eslint no-underscore-dangle:0 */
export default class PwProjectItem extends HTMLElement {
  static get observedAttributes() {
    return ['image', 'id', 'active'];
  }

  createdCallback() {
    // Setting the initial attributes
    this._id = this.getAttribute('id') || '';
    this._image = this.getAttribute('image') || '';
    this._active = this.getAttribute('active') || 'true';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    // Event Listeners
    this.addEventListener('mouseover', this.onMouseOver.bind(this), false);
    this.addEventListener('mouseout', this.onMouseOut.bind(this), false);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  onMouseOut() {
    this.button.get().visible = '';
  }

  onMouseOver() {
    this.button.get().visible = true;
  }

  get active() {
    return this._active;
  }

  set active(value) {
    this._active = value;
    this.setAttribute('active', value);
    if (!value) {
      this.setOpacity(0.4);
    } else {
      this.setOpacity(1);
    }
  }

  get button() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(5));
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('id', value);
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
              <figcaption><slot></slot></figcaption>
              <pw-show-button visible="true" active="true" id="${this.id}"></pw-show-button>
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
                display: inline-block;
                column-break-inside: avoid;
                opacity: 0.4;
              }

              figure:hover {
                opacity: 1;
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

              :host(:hover) figure:not(:hover) {
                opacity: 0.4;
              }

              @media screen and (max-width: 750px) {
                figure { width: 100%; }
                figure {
                  padding: 0.25em;
                }
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project-item')) {
  document.registerElement('pw-project-item', PwProjectItem);
}
