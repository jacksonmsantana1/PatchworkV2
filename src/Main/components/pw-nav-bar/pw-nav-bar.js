import H from '../../../lib/Helper/Helper';

/* eslint no-underscore-dangle:0 */
export default class PwNavBar extends HTMLElement {
  static get observedAttributes() {
    return ['logo', 'url'];
  }

  createdCallback() {
    // Initializing properties
    this._logo = this.getAttribute('logo') || 'ANUS';
    this._url = this.getAttribute('url') || '/#/main';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    this.getMenuIcon().get().addEventListener('click', this.onMenuIconClick.bind(this), false);

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

  onMenuIconClick() {
    this.getNav().get().classList.toggle('expand');
    console.log('ANUS');
  }

  getNav() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(5));
  }

  getMenuIcon() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(3));
  }

  get logo() {
    return this._logo;
  }

  set logo(value) {
    this._logo = value;
    this.setAttribute('logo', value);
    this.render();
  }

  get url() {
    return this._url;
  }

  set url(value) {
    this._url = value;
    this.setAttribute('url', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<header class="header">
              <div class="wrap">
                <h2 class="logo"><a href="${this.url}">${this.logo}</a></h2>
                <a id="menu-icon">&#9776; Menu</a>
                <nav class="navbar">
                  <ul class="menu">
                    <slot name="tabsSlot"></slot>
                  </ul>
                </nav>
              </div>
            </header>`;
  }

  get style() {
    return `<style>
              @import url(https://fonts.googleapis.com/css?family=Nunito);
              *, *:before, *:after {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }

              .header {
                position: relative;
                width: 100%;
                background: #e4a0a0;
                height: 50px;
                line-height: 50px;
                box-shadow: 0 -3px 0 #f19292 inset;
              }

              .wrap {
                max-width: 960px;
                /* Changge this with your max-width size */
                margin: 0 auto;
              }

              .logo {
                font-family: inherit;
                font-size: 1.5em;
                margin-left: 1em;
              }

              .logo a {
                color: #ca6161;
                text-decoration: none;
                opacity: 1;
                -moz-transition: all 0.2s ease;
                -o-transition: all 0.2s ease;
                -webkit-transition: all 0.2s ease;
                transition: all 0.2s ease;
              }

              .logo a:hover {
                opacity: 0.85;
              }

              #menu-icon {
                display: block;
                position: absolute;
                top: 0;
                right: 1em;
                color: #ca6161;
                text-decoration: none;
                font-weight: bold;
                cursor: pointer;
                opacity: 1;
                padding: 0 0.4em;
              }

              #menu-icon:hover {
                opacity: 0.85;
                text-decoration: none;
                border: none;
              }

              .navbar {
                background-color: indianred;
                float: none;
                max-height: 0;
                overflow: hidden;
                -moz-transition: max-height 0.4s;
                -o-transition: max-height 0.4s;
                -webkit-transition: max-height 0.4s;
                transition: max-height 0.4s;
                position: relative;
                z-index: 10;
              }

              .navbar .menu {
                margin: 0;
                padding: 0;
                list-style-type: none;
              }

              .expand {
                max-height: 20em;
              }

              @media only screen and (min-width: 768px) {
                .wrap {
                  padding-left: 1em;
                  padding-right: 1em;
                }

                .logo {
                  margin-left: 0;
                }

                .logo, .navbar {
                   display: inline-block;
                }

                /* Mobile menu icon */
                #menu-icon {
                  display: none;
                }

                .navbar {
                  float: right;
                  max-height: none;
                }

                .navbar .menu {
                  box-shadow: 0 -3px 0 #bc3a3a inset;
                }
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-nav-bar')) {
  document.registerElement('pw-nav-bar', PwNavBar);
}
