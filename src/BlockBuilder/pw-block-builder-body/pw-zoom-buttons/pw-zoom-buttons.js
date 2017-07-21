import './pw-zoom-minus-button/pw-zoom-minus-button';
import './pw-zoom-plus-button/pw-zoom-plus-button';

export default class PwZoomButtons extends HTMLElement {
  static get observedAttributes() {
    return ['scale'];
  }

  createdCallback() {
    // Initializing attributes
    this._scale = parseInt(this.getAttribute('scale'), 10) || 1;

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });

    this.render();
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

  get scale() {
    return this._scale;
  }

  set scale(value) {
    this._scale = parseInt(value, 10);
    this.setAttribute('scale', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="wrap">
              <pw-zoom-plus-button scale="${this.scale}"></pw-zoom-plus-button>
              <pw-zoom-minus-button scale="${this.scale}"></pw-zoom-minus-button>
            </div>`;
  }

  get style() {
    return `<style>
              .wrap {
                position: fixed;
                bottom: 1em;
                left: 1em;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-zoom-buttons')) {
  document.registerElement('pw-zoom-buttons', PwZoomButtons);
}
