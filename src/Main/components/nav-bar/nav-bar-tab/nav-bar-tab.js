import Page from 'page';

/* eslint no-underscore-dangle:0 new-cap:0 */
export default class NavBarTab extends HTMLElement {
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

  onClick() {
    Page(`${this.href}`);
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
    return `<li><a class="${this.class}" href="${this.href}"><slot></slot></a></li>`;
  }

  get style() {
    return `<style>
              @import url(https://fonts.googleapis.com/css?family=Nunito);

              li a {
                display: block;
                text-decoration: none;
                padding: 0 0.8em;
                -moz-transition: all 0.2s ease;
                -o-transition: all 0.2s ease;
                -webkit-transition: all 0.2s ease;
                transition: all 0.2s ease;
                border-bottom: 1px solid #db8b8b;
              }

              li a:hover {
                text-decoration: none;
                background-color: #e29797;
              }

              li a.active {
                background-color: #d98383;
              }

              a {
                color: #f7a1a1;
                opacity: 1;
                text-decoration: none;
              }

              a:hover {
                opacity: 0.85;
                text-decoration: underline;
              }

              @media only screen and (min-width: 768px) {
                li {
                  list-style-type: none;
                  display: inline-block;
                  text-align: center;
                  background-color: #f9c3c3;
                  box-shadow: 0 -3px 0 #fdd4d4 inset;
                }

                li a {
                  display: block;
                  border-bottom: 0;
                  padding: 0 0.8em;
                }

                li a:hover {
                  text-decoration: none;
                  box-shadow: 0 -3px 0 indianred inset;
                }

                li a.active {
                  box-shadow: 0 -3px 0 indianred inset;
                }
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('nav-bar-tab')) {
  document.registerElement('nav-bar-tab', NavBarTab);
}
