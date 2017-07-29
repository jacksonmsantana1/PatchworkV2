import H from '../../../lib/Helper/Helper';

export default class PwHelperButtons extends HTMLElement {
  static get observedAttributes() {
    return ['active'];
  }

  createdCallback() {
    // Initializing attributes
    this._active = this.getAttribute('active') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  onClick(evt) {
    if (this.active) {
      this.active = '';
    } else {
      this.active = true;
    }

    evt.stopPropagation();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  setSlotsActive() {
    this.slots.map(nodes =>
      /* eslint array-callback-return: 0 */
      Array.prototype.slice.call(nodes).map((node) => {
        const _node = node;
        _node.active = true;
      }));
  }

  setSlotsDeactive() {
    this.slots.map(nodes =>
      /* eslint array-callback-return: 0 */
      Array.prototype.slice.call(nodes).map((node) => {
        const _node = node;
        _node.active = '';
      }));
  }

  get button() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('div.plus-button'));
  }

  get slots() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('slot'))
      .chain(H.assignedNodes);
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
    this.button.get().addEventListener('click', this.onClick.bind(this), false);
  }

  get active() {
    return this._active;
  }

  set active(value) {
    if (value) {
      this.setSlotsActive();
    } else {
      this.setSlotsDeactive();
    }

    this._active = value;
    this.setAttribute('active', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="plus-button ${this.active ? 'open' : ''}"></div>
              <slot></slot>`;
  }

  get style() {
    return `<style>
              .plus-button {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 100;
                height: 75px;
                width: 75px;
                border-radius: 100%;
                background-color: #e91e63;
                box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.58);
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
                -webkit-transform: scale(0.92);
                transform: scale(0.92);
              }

              .plus-button::before {
                content: "+";
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                color: #fff;
                font-size: 28px;
                font-weight: 600;
              }

              .plus-button:hover {
                -webkit-transform: scale(1);
                transform: scale(1);
                box-shadow: 3px 3px 12px 2px rgba(0,0,0,0.5);
              }

              .plus-button:active {
                -webkit-transform: scale(0.96);
                transform: scale(0.96);
                box-shadow: 2px 3px 11px 1px rgba(0,0,0,0.53);
              }

              .plus-button.open {
                -webkit-transform: rotate(45deg) scale(0.92);
                transform: rotate(45deg) scale(0.92);
                background-color: #333;
                box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.58);
              }

              .plus-button.open:hover {
                -webkit-transform: scale(1) rotate(45deg);
                transform: scale(1) rotate(45deg);
                box-shadow: 3px 3px 12px 2px rgba(0,0,0,0.5);
              }

              .plus-button.open:active {
                -webkit-transform: scale(0.96) rotate(45deg);
                transform: scale(0.96) rotate(45deg);
                box-shadow: 2px 3px 11px 1px rgba(0,0,0,0.53);
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-helper-buttons')) {
  document.registerElement('pw-helper-buttons', PwHelperButtons);
}
