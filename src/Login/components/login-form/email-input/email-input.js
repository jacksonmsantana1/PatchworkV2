import Either from 'data.either';
import H from '../../../../lib/Helper/Helper';

export default class EmailInput extends HTMLElement {
  static get observedAttributes() {
    return ['valid', 'active'];
  }

  createdCallback() {
    // Setting the initial attributes
    this._valid = this.valid || 'false';
    this._active = this.active || 'true';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    // Event listeners
    this.input.get().addEventListener('blur', this.onBlur.bind(this), true);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  connectedCallback() {
    this.valid = this.getAttribute('valid') || false;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.html + this.style;
  }

  validateEmail(email) {
    /* eslint max-len:0 no-useless-escape:0 */
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  onBlur(event) {
    /* eslint no-param-reassign:0 */
    if (!this.input.get().value) {
      this.setStyleBackground(event, '');
      H.changeProps('valid', 'false', this);
      this.onType();
    } else if (!this.validateEmail(this.input.get().value)) {
      this.setStyleBackground(event, '#d68291');
      H.changeProps('valid', 'false', this);
      this.onType();
    } else {
      this.setStyleBackground(event, '');
      H.changeProps('valid', 'true', this);
      this.onType();
    }
  }

  setStyleBackground(evt, color) {
    Either.fromNullable(evt)
      .chain(H.props('target'))
      .chain(H.props('style'))
      .map(H.changeProps('background', color));
  }

  onType() {
    this.input.fold(H.logError('email-input'),
      inpt => H.emitEvent(true, true, inpt.value, 'email-typed', this));
  }

  set valid(value) {
    /* eslint no-underscore-dangle:0 */
    this._valid = (value === 'true');
    this.setAttribute('valid', value);
  }

  set active(value) {
    /* eslint no-underscore-dangle:0 */
    if (value) {
      this.input.fold(H.logError('email-input'), H.changeProps('disabled', false));
    } else {
      this.input.fold(H.logError('email-input'), H.changeProps('disabled', true));
    }
  }

  get valid() {
    return this._valid;
  }

  get input() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(1));
  }

  get html() {
    return `
           <div class="group">
              <input type="text">
                <span class="highlight"></span>
                <span class="bar"></span>
               <label>Email</label>
            </div>`;
  }

  get style() {
    /* eslint class-methods-use-this:0 */
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

if (!window.customElements.get('email-input')) {
  document.registerElement('email-input', EmailInput);
}
