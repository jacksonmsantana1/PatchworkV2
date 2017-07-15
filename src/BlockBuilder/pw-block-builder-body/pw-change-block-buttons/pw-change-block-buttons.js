import H from '../../../../lib/Helper/Helper';

export default class PwChangeBlockButtons extends HTMLElement {
  static get observedAttributes() {
    return ['visible', 'x', 'y'];
  }

  createdCallback() {
    // Initializing attributes
    this._visible = this.getAttribute('visible') || '';
    this._x = this.getAttribute('x') || '';
    this._y = this.getAttribute('y') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    // Event Listeners

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
    // TODO
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return ``;
  }

  get style() {
    return `<style>
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-change-block-buttons')) {
  document.registerElement('pw-change-block-buttons', PwChangeBlockButtons);
}
