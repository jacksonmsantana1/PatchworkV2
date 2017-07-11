import './pw-project-blocks/pw-project-blocks';

export default class PwBlockBuilderBody extends HTMLElement {
  static get observedAttributes() {
    return ['session'];
  }

  createdCallback() {
    // Initializing attributes
    this._session = this.getAttribute('session') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

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

  get session() {
    return this._session;
  }

  set session(value) {
    this._session = value;
    this.setAttribute('session', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<main>
              <pw-project-blocks session="${this.session}" maxRows="3" maxColumns="3"></pw-project-blocks>
              <pw-fabrics-list visible=""></pw-fabrics-list>
            </main>`;
  }

  get style() {
    return `<style>
              main {
                background: #f9dae0;
                font-family: "Open Sans", Helvetica Neue, Helvetica, Arial, sans-serif;
                color: #fff;
                padding: 6em 0 6em 0;
              }

              main .helper {
                background: rgba(0, 0, 0, 0.2);
                color: #d6c5ea;
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate3d(-50%, -50%, 0);
                padding: 1.2em 2em;
                text-align: center;
                border-radius: 20px;
                font-size: 2em;
                font-weight: bold;
                display: inline-block;
              }

             main .helper span {
               color: rgba(0, 0, 0, 0.2);
               font-size: 0.4em;
               display: block;
              }

              pw-project-blocks {
                display: inline-block;
              }


              @media screen and (max-width: 750px) {
                main {
                  padding: 6em;
                }
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-block-builder-body')) {
  document.registerElement('pw-block-builder-body', PwBlockBuilderBody);
}
