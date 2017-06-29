/*  eslint no-underscore-dangle:0 */
export default class PwProjectLayout extends HTMLElement {
  static get observedAttributes() {
    return ['svg'];
  }

  createdCallback() {
    // Setting the initial attributes
    this._svg = this.getAttribute('svg') || '';

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

  get svg() {
    return this._svg;
  }

  set svg(value) {
    this._svg = value;
    this.setAttribute('svg', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="container">
              <img src="${this.svg}"/>
            </div>`;
  }

  get style() {
    return `<style>
              .container {
                border: 10px solid #b6bdc3;
                background: #fff;
                margin: 0 auto;
              }

              /* Required to make image fluid in IE */

              img:not(.png) {
                width: 100%;
                height: 40em;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project-layout')) {
  document.registerElement('pw-project-layout', PwProjectLayout);
}
