import H from '../../../lib/Helper/Helper';
import './pw-add-column-button/pw-add-column-button';
import './pw-remove-column-button/pw-remove-column-button';

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

    // EventListeners

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

  get button() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('div.plus-button'));
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
    this.button.get().addEventListener('click', this.onClick.bind(this), false);
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
    return `<div class="plus-button ${this.active ? 'open' : ''}"></div>
              <pw-add-column-button active="${this.active ? 'true' : ''}"></pw-add-column-button>
              <pw-remove-column-button active="${this.active ? 'true' : ''}"></pw-remove-column-button>`;
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
.social-button {
  position: fixed;
  bottom: 43px;
  right: 41px;
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
}
.social-button:hover {
  -webkit-transform: scale(1);
          transform: scale(1);
  -webkit-transition: 0.35s cubic-bezier(0.3, 0.2, 0, 2.5);
  transition: 0.35s cubic-bezier(0.3, 0.2, 0, 2.5);
}
.social-button.twitter-button {
  background: url("https://cdn4.iconfinder.com/data/icons/social-icon-4/842/twitter-256.png") no-repeat center;
}
.social-button.twitter-button.active {
  bottom: 110px;
  right: 21px;
}
.social-button.facebook-button {
  background: url("https://cdn4.iconfinder.com/data/icons/social-icon-4/842/facebook-256.png") no-repeat center;
}
.social-button.facebook-button.active {
  bottom: 105px;
  right: 73px;
}
.social-button.pinterest-button {
  background: url("https://cdn4.iconfinder.com/data/icons/social-icon-4/842/pinterest-256.png") no-repeat center;
}
.social-button.pinterest-button.active {
  bottom: 67px;
  right: 109px;
}
.social-button.insta-button {
  background: url("https://cdn4.iconfinder.com/data/icons/social-icon-4/842/instagram-256.png") no-repeat center;
}
.social-button.insta-button.active {
  bottom: 15px;
  right: 105px;
}
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-helper-buttons')) {
  document.registerElement('pw-helper-buttons', PwHelperButtons);
}
