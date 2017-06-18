import R from 'ramda';
import H from '../../../../lib/Helper/Helper';

// TODO The disabled attribute is not working properly
export default class SubmitButton extends HTMLElement {
  static get observedAttributes() {
    return ['active'];
  }

  createdCallback() {
    // Setting the initial attributes
    this._active = this.active || 'true';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    // Setting Event Listeners
    this.addEventListener('click', this.onClick.bind(this), false);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  // When an attribute is updated, check if the value is different
  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  onClick() {
    H.emitEvent(true, true, '', 'submitted', this);
  }

  render() {
    this.shadowRoot.innerHTML = this.html + this.style;
  }

  get button() {
    return H.getShadowRoot(this).chain(H.childNodes).map(R.nth(0));
  }

  // Set the value for foo, reflect to attribute, and re-render
  set active(value) {
    /* eslint no-underscore-dangle:0 */
    if (value) {
      this.button.fold(H.logError('submit-button'), H.changeProps('disabled', false));
    } else {
      this.button.fold(H.logError('submit-button'), H.changeProps('disabled', true));
    }
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<button type="button" class="button buttonBlue">
              Submit
              <div class="ripples buttonRipples">
                <span class="ripplesCircle"></span>
              </div>
            </button>`;
  }

  get style() {
    return `<style>

      .button {
        position: relative;
        display: inline-block;
        padding: 12px 24px;
        margin: .3em 0 1em 0;
        width: 100%;
        vertical-align: middle;
        color: #fff;
        font-size: 16px;
        line-height: 20px;
        -webkit-font-smoothing: antialiased;
        text-align: center;
        letter-spacing: 1px;
        background: transparent;
        border: 0;
        border-bottom: 2px solid #e2a1c8;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .button:focus { outline: 0;  }

      .buttonBlue {
        background: #f1b8d2;
        text-shadow: 1px 1px 0 rgba(8, 0, 5, .5);
      }

      .buttonBlue:hover { background: #d08ca5;  }

      .ripples {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: transparent;
      }

      .ripplesCircle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
      }

      .ripples.is-active .ripplesCircle {
        animation: ripples .4s ease-in;
      }

      @keyframes ripples {
        0% { opacity: 0;  }
        25% { opacity: 1;  }
        100% {
          width: 200%;
          padding-bottom: 200%;
          opacity: 0;
        }
    }
    </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('submit-button')) {
  document.registerElement('submit-button', SubmitButton);
}
