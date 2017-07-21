import H from '../../../../lib/Helper/Helper';

export default class PwZoomMinusButton extends HTMLElement {
  static get observedAttributes() {
    return ['scale'];
  }

  createdCallback() {
    // Initializing attributes
    this._scale = parseInt(this.getAttribute('scale'), 10) || 1;

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
      scale: this.scale,
    };

    H.emitEvent(true, true, detail, 'zoom-out-block-up', this);
    evt.stopPropagation();
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
    return `<button class='minus'>–</button>`;
  }

  get style() {
    return `<style>
              .minus{
                height:70px;
                width:70px;
                border-radius:50%;
                border:none;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                background: #e84a4a;
                text-align: center;
                font-size: 200%;
                font-weight: 500;
                color: rgb(255,255,255);
                box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.4), 0     2.5px 6px rgba(0, 0, 0, 0.2);
              }

              .minus:hover{
                background: #ff7272;
                cursor:pointer;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-zoom-minus-button')) {
  document.registerElement('pw-zoom-minus-button', PwZoomMinusButton);
}
