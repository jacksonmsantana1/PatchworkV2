import H from '../../../../lib/Helper/Helper';

export default class PwChangeBlockButton extends HTMLElement {
  static get observedAttributes() {
    return ['row', 'column'];
  }

  createdCallback() {
    // Initializaing attributes
    this._row = this.getAttribute('row') || '';
    this._column = this.getAttribute('column') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    // Event Listeners
    this.addEventListener('click', this.onClick.bind(this), false);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  onClick(evt) {
    const detail = {
      row: this.row,
      column: this.column,
    };

    H.emitEvent(true, true, detail, 'change-block-up', this);
    evt.stopPropagation();
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get row() {
    return this._row;
  }

  set row(value) {
    this._row = value;
    this.setAttribute('row', value);
    this.render();
  }

  get column() {
    return this._column;
  }

  set column(value) {
    this._column = value;
    this.setAttribute('column', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<i></i>`;
  }

  get style() {
    return `<style>
              i.press {
                animation: size .4s;
                color:#e23b3b;
              }

              i {
                cursor:pointer;
                padding:10px 12px 8px;
                background:#fff;
                border-radius:50%;
                display:inline-block;
                color:#aaa;
                transition:.2s;
              }

              i:hover {
                color:#666;
              }

              i:before {
                font-family:fontawesome;
                content: "\u270E";
                font-style:normal;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-change-block-button')) {
  document.registerElement('pw-change-block-button', PwChangeBlockButton);
}
