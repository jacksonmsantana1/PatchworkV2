import H from '../../../../lib/Helper/Helper';

export default class PasswordInput extends HTMLElement {
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
    this.addEventListener('blur', this.onType.bind(this), false);

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

  render() {
    this.shadowRoot.innerHTML = this.html + this.style;
  }

  onType() {
    this.input.fold(H.logError('password-input'), inpt => H.emitEvent(true, true, inpt.value, 'password-typed', this));
  }

  // Set the value for foo, reflect to attribute, and re-render
  set active(value) {
    /* eslint no-underscore-dangle:0 */
    if (value) {
      this.input.fold(H.logError('password-input'), H.changeProps('disabled', false));
    } else {
      this.input.fold(H.logError('password-input'), H.changeProps('disabled', true));
    }
  }

  get input() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(0))
      .chain(H.childNodes)
      .chain(H.nth(1));
  }

  get html() {
    /* eslint class-methods-use-this:0 */
    return `<div class="group">
              <input type="password">
                <span class="highlight"></span>
                <span class="bar"></span>
               <label>Password</label>
            </div>`;
  }

  get style() {
    return `<style>
      * { box-sizing:border-box;  }

      .group {
        position: relative;
        margin-bottom: 45px;
      }

      input {
        font-size: 18px;
        padding: 10px 10px 10px 5px;
        -webkit-appearance: none;
        display: block;
        background: #fdd4d4;
        color: #636363;
        width: 100%;
        border: none;
        border-top-left-radius: 0.5em;
        border-top-right-radius: 0.5em;
        border-bottom: 1px solid #b77291;
      }

      input:focus { outline: none; }

      label {
        color: #b77291;
        font-size: 18px;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        left: 5px;
        top: 10px;
        transition: all 0.2s ease;
      }

      input ~ label, input.used ~ label {
        top: -20px;
        transform: scale(.75); left: -2px;
        color: #b77291;
      }

      .bar {
        position: relative;
        display: block;
        width: 100%;
      }

      .bar:before, .bar:after {
        content: '';
        height: 2px;
        width: 0;
        bottom: 1px;
        position: absolute;
        background: #f1b8d2;
        transition: all 0.2s ease;
      }

      .bar:before { left: 50%; }

      .bar:after { right: 50%; }

      input:focus ~ .bar:before, input:focus ~ .bar:after { width: 50%; }

      .highlight {
        position: absolute;
        height: 60%;
        width: 100px;
        top: 25%;
        left: 0;
        pointer-events: none;
        opacity: 0.5;
      }

      input:focus ~ .highlight {
        animation: inputHighlighter 0.3s ease;
      }

      @keyframes inputHighlighter {
        from { background: #4a89dc;  }
        to { width: 0; background: transparent;  }
      }
    </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('password-input')) {
  document.registerElement('password-input', PasswordInput);
}
