import H from '../../../../lib/Helper/Helper';

const ZOOM_CONSTANT = 1;

export default class PwZoomPlusButton extends HTMLElement {
  createdCallback() {
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
      scale: ZOOM_CONSTANT,
    };

    H.emitEvent(true, true, detail, 'zoom-in-block-up', this);
    evt.stopPropagation();
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<button class='plus'>+</button>`;
  }

  get style() {
    return `<style>
              .plus{
                outline: 0;
                height:70px;
                width:70px;
                border-radius:50%;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                border:none;
                background: #69F0AE;
                text-align: center;
                font-size: 200%;
                font-weight: 500;
                color: rgb(255,255,255);
                box-shadow: 0 1.5px 8px rgba(0, 0, 0, 0.4), 0     2.5px 6px rgba(0, 0, 0, 0.2);
              }

              .plus:hover{
                 background: #9ffccd;
                 cursor:pointer;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-zoom-plus-button')) {
  document.registerElement('pw-zoom-plus-button', PwZoomPlusButton);
}
