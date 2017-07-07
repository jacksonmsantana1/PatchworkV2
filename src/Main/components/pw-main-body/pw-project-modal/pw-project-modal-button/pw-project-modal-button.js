import Page from 'page';
import ShortId from 'shortid';

export default class PwProjectModalButton extends HTMLElement {
  static get observedAttributes() {
    return ['id'];
  }

  createdCallback() {
    // Setting the initial attributes
    this._id = this.getAttribute('id') || '';

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

  onClick() {
    Page(`/#/projects/${this.id}/${ShortId.generate()}`); /* eslint new-cap:0 */
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('id', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<button type="button" class="button buttonBlue">
              Patch It !
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
if (!window.customElements.get('pw-project-modal-button')) {
  document.registerElement('pw-project-modal-button', PwProjectModalButton);
}
