export default class LoginError extends HTMLElement {
  static get observedAttributes() {
    return ['message'];
  }

  createdCallback() {
    // Setting the initial attributes
    this._message = this.getAttribute('message') || '';

    // setting the inner dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    if (super.createdcallback) {
      super.createdcallback();
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<p>${this.message}<p>`;
  }

  get style() {
    return `<style> p { color: #b77291; }</style>`;
  }

  set message(value) {
    /* eslint no-underscore-dangle:0 */
    this._message = value;
    this.setAttribute('message', value);
    this.render();
  }

  get message() {
    return this._message;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('login-error')) {
  document.registerElement('login-error', LoginError);
}
