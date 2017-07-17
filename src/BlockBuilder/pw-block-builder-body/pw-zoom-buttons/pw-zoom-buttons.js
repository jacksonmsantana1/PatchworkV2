import './pw-zoom-minus-button/pw-zoom-minus-button';
import './pw-zoom-plus-button/pw-zoom-plus-button';

export default class PwZoomButtons extends HTMLElement {
  createdCallback() {
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

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="wrap">
              <pw-zoom-plus-button scale="1"></pw-zoom-plus-button>
              <pw-zoom-minus-button scale="1"></pw-zoom-minus-button>
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
