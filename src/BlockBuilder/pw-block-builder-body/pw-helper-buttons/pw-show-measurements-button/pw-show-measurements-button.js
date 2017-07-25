import H from '../../../../lib/Helper/Helper';

export default class PwShowMeasurementsButton extends HTMLElement {
  static get observedAttributes() {
    return ['active'];
  }

  createdCallback() {
    // Initializing attributes
    this._active = this.getAttribute('active') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

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
    H.emitEvent(true, true, '', 'show-measurements-modal', this);
    evt.stopPropagation();
  }

  get div() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('div.social-button'));
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get active() {
    return this._active;
  }

  set active(value) {
    this._active = value;
    this.setAttribute('active', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="social-button pinterest-button ${this.active ? 'active' : ''}"></div>`;
  }

  get style() {
    return `<style>
              .social-button {
                position: fixed;
                height: 50px;
                width: 50px;
                -webkit-transform: scale(0.8);
                transform: scale(0.8);
                background-size: 153% !important;
                border-radius: 100%;
                box-shadow: 2px 2px 7px 0px rgba(0,0,0,0.4);
                cursor: pointer;
                z-index: 99;
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
                display: none;
              }

              .social-button:hover {
                -webkit-transform: scale(1);
                transform: scale(1);
                -webkit-transition: 0.35s cubic-bezier(0.3, 0.2, 0, 2.5);
                transition: 0.35s cubic-bezier(0.3, 0.2, 0, 2.5);
              }

              .social-button.pinterest-button {
                background: url("https://cdn0.iconfinder.com/data/icons/office-icon-set-2/100/Noun_Project_100Icon_10px_grid-99-128.png") no-repeat center;
              }

              .social-button.pinterest-button.active {
                bottom: 107px;
                right: 83px;
                display: block;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-show-measurements-button')) {
  document.registerElement('pw-show-measurements-button', PwShowMeasurementsButton);
}
