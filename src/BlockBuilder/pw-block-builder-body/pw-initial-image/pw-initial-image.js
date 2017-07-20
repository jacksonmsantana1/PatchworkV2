import H from '../../../lib/Helper/Helper';

export default class PwInitialImage extends HTMLElement {
  static get observedAttributes() {
    return ['visible', 'src'];
  }

  createdCallback() {
    // Initializing attributes
    this._visible = this.getAttribute('visible') || '';
    this._src = this.getAttribute('src') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    if (this.visible) {
      this.show();
    } else {
      this.hide();
    }

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

  show() {
    this.div
      .chain(H.props('style'))
      .chain(H.changeProps('display', 'block'));
  }

  hide() {
    this.div
      .chain(H.props('style'))
      .chain(H.changeProps('display', 'none'));
  }

  get div() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1));
  }

  get src() {
    return this._src;
  }

  set src(value) {
    this._src = value;
    this.setAttribute('src', value);
    this.render();
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    if (!value) {
      this.hide();
    } else {
      this.show();
    }

    // this.setAttribute('visible', value);
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="initial">
              <h1><slot><slot></h1>
              <img src="${this.src}"/>
            </div>`;
  }

  get style() {
    return `<style>
            .initial {
              display: block;
            }

            img {
              display: table;
              margin: 0 auto;
            }

            h1 {
              text-align: center;
            }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-initial-image')) {
  document.registerElement('pw-initial-image', PwInitialImage);
}
