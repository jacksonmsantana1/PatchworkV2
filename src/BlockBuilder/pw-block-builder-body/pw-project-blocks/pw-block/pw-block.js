export default class PwBlock extends HTMLElement {
  static get observedAttributes() {
    return ['column', 'row'];
  }

  createdCallback() {
    // Initializing attributes
    this._column = this.getAttribute('column') || '';
    this._row = this.getAttribute('row') || '';

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

  get row() {
    return this._maxRows;
  }

  set row(value) {
    this._row = value;
    this.setAttribute('row', value);
    this.render();
  }

  get column() {
    return this._maxColumns;
  }

  set column(value) {
    this._column = value;
    this.setAttribute('column', value);
    this.render();
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
              <slot></slot>
            </div>`;
  }

  get style() {
    return `<style>
              .col4 {
                width: 33%;
                float: left;
                display: inline;
              }

              slot::slotted(svg) {
                display:inline;
                width: 100%;
                max-width: 560;
                height: 100%;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-block')) {
  document.registerElement('pw-block', PwBlock);
}
