import './pw-project/pw-project';

export default class PwProjectBody extends HTMLElement {
  static get observedAttributes() {
    return ['id'];
  }

  createdCallback() {
    // Initializing attributes
    this._id = this.getAttribute('id') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<main>
              <slot></slot>
              <pw-project id="${this.id}"></pw-project>
            </main>`;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('id', value);
    this.render();
  }

  get style() {
    return `<style>
              main {
                background: #f9dae0;
                font-family: "Open Sans", Helvetica Neue, Helvetica, Arial, sans-serif;
                color: #fff;
                padding: 5em;
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

              @media screen and (max-width: 750px) {
                main {
                  padding: 2em;
                }
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project-body')) {
  document.registerElement('pw-project-body', PwProjectBody);
}
