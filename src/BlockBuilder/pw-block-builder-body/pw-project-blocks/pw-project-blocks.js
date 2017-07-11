export default class PwProjectBlocks extends HTMLElement {
  static get observedAttributes() {
    return ['session', 'max-columns', 'max-rows'];
  }

  createdCallback() {
    // Initializing attributes
    this._session = this.getAttribute('session') || '';
    this._maxColumns = this.getAttribute('max-columns') || '';
    this._maxRows = this.getAttribute('max-rows') || '';

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

  get maxRows() {
    return this._maxRows;
  }

  get maxColumns() {
    return this._maxColumns;
  }

  get session() {
    return this._session;
  }

  set session(value) {
    this._session = value;
    this.setAttribute('session', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="col4">
              <svg width="500" height="500" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              </svg>
            </div>`;
  }

  get style() {
    return `<style>
              .col4 {
                width: 33%;
                float: left;
                display: inline;
              }

              svg {
                float:left;
                display:inline;
                width: 100%;
                max-width: 560;
                height: 100%;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project-blocks')) {
  document.registerElement('pw-project-blocks', PwProjectBlocks);
}
