import H from '../../lib/Helper/Helper';
import './pw-project/pw-project';
import './pw-fabrics-list/pw-fabrics-list';

export default class PwProjectBody extends HTMLElement {
  static get observedAttributes() {
    return ['visible'];
  }

  createdCallback() {
    // Initializing attributes
    this._id = this.getAttribute('id') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    this.addEventListener('svg-image-choosed', this.onSvgImageChoosed.bind(this), false);
    this.addEventListener('show-fabrics', this.onShowFabrics.bind(this), false);
    this.addEventListener('click', this.onClick.bind(this), false);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  onClick() {
    this.getPwFabricList().map((list) => {
      if (list.visible) {
        /* eslint no-param-reassign:0 */
        list.visible = '';
      }
    });
  }

  onShowFabrics(evt) {
    evt.stopPropagation();
    this.getPwFabricList().map((pwProjectList) => {
      H.emitEvent(true, true, evt.detail, 'show-fabrics-down', pwProjectList);
    });
  }

  onSvgImageChoosed(evt) {
    /* eslint array-callback-return:0 */
    evt.stopPropagation();
    this.getPwProject().map((pwProject) => {
      H.emitEvent(true, true, evt.detail, 'change-svg-image', pwProject);
    });
  }

  getPwProject() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(3));
  }

  getPwFabricList() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(5));
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
    return `<main>
              <slot></slot>
              <pw-project id="${this.id}"></pw-project>
              <pw-fabrics-list visible=""></pw-fabrics-list>
            </main>`;
  }

  get style() {
    return `<style>
              main {
                background: #f9dae0;
                font-family: "Open Sans", Helvetica Neue, Helvetica, Arial, sans-serif;
                color: #fff;
                padding: 5em 0 5em 0;
                padding-top: 15px;
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
