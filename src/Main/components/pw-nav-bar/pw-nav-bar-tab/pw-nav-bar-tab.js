import Page from 'page';
import H from '../../../../lib/Helper/Helper';

/* eslint no-underscore-dangle:0 new-cap:0 */
export default class PwNavBarTab extends HTMLElement {
  static get observedAttributes() {
    return ['href', 'class'];
  }

  createdCallback() {
    // Initializing properties
    this._href = this.getAttribute('href') || '/#/';
    this._class = this.getAttribute('href') || 'active';

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

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  onClick(evt) {
    if (this.href === '/#/login') {
      Page(`${this.href}`);
    } else {
      const detail = this.href;
      H.emitEvent(true, true, detail, 'go-to-page', this);
      evt.stopPropagation();
    }
  }

  get class() {
    return this._active;
  }

  set class(value) {
    this._active = value;
    this.setAttribute('class', value);
    this.render();
  }

  get href() {
    return this._href;
  }

  set href(value) {
    this._href = value;
    this.setAttribute('href', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<li><span class="${this.class}" href="${this.href}"><slot></slot></span></li>`;
  }

  get style() {
    return `<style>
              @import url(https://fonts.googleapis.com/css?family=Nunito);

              li span {
                display: block;
                text-decoration: none;
                padding: 0 0.8em;
                -moz-transition: all 0.2s ease;
                -o-transition: all 0.2s ease;
                -webkit-transition: all 0.2s ease;
                transition: all 0.2s ease;
                border-bottom: 1px solid #db8b8b;
              }

              li span:hover {
                text-decoration: none;
                background-color: #e29797;
              }

              li span.active {
                background-color: #d98383;
              }

              span {
                color: #8e4040;
                opacity: 1;
                text-decoration: none;
              }

              span:hover {
                opacity: 0.85;
                text-decoration: underline;
                cursor: pointer;
              }

              @media only screen and (min-width: 768px) {
                li {
                  list-style-type: none;
                  display: inline-block;
                  text-align: center;
                  background-color: #e4a0a0;
                  box-shadow: 0 -3px 0 #f19292 inset;
                }

                li span {
                  color: #ca6161;
                  display: block;
                  border-bottom: 0;
                  padding: 0 0.8em;
                }

                li span:hover {
                  text-decoration: none;
                  box-shadow: 0 -3px 0 indianred inset;
                }

                li span.active {
                  box-shadow: 0 -3px 0 indianred inset;
                }
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-nav-bar-tab')) {
  document.registerElement('pw-nav-bar-tab', PwNavBarTab);
}
