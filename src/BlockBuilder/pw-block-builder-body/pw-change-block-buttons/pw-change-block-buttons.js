import H from '../../../lib/Helper/Helper';
import './pw-rotate-block-button/pw-rotate-block-button';
import './pw-delete-block-button/pw-delete-block-button';
import './pw-change-block-button/pw-change-block-button';

export default class PwChangeBlockButtons extends HTMLElement {
  static get observedAttributes() {
    return ['visible', 'x', 'y', 'row', 'column'];
  }

  createdCallback() {
    // Initializing attributes
    this._visible = this.getAttribute('visible') || '';
    this._x = this.getAttribute('x') || '';
    this._y = this.getAttribute('y') || '';
    this._row = this.getAttribute('row') || '';
    this._column = this.getAttribute('column') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();
    this.visible = '';

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

  showButtons() {
    this.buttons
      .chain(H.props('style'))
      .chain(H.changeProps('display', 'block'));
  }

  hideButtons() {
    this.buttons
      .chain(H.props('style'))
      .chain(H.changeProps('display', 'none'));
  }

  get buttons() {
    return H.getShadowRoot(this)
             .chain(H.childNodes)
             .chain(H.nth(1));
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

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    this.setAttribute('x', value);
    this.render();
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
    this.setAttribute('y', value);
    this.render();
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    if (!value) {
      this.hideButtons();
    } else {
      this.showButtons();
    }
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="wrap">
              <pw-rotate-block-button row="${this.row}" column="${this.column}"></pw-rotate-block-button>
              <pw-delete-block-button row="${this.row}" column="${this.column}"></pw-delete-block-button>
              <pw-change-block-button row="${this.row}" column="${this.column}"></pw-change-block-button>
            </div>`;
  }

  get style() {
    return `<style>
              .wrap {
                position:absolute;
                background-color: #fbbaba;
                top: ${this.y}px;
                left: ${this.x}px;
                padding: 0.5em;
                border-radius: 50%;
                border-style: ridge;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-change-block-buttons')) {
  document.registerElement('pw-change-block-buttons', PwChangeBlockButtons);
}
