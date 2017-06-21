import H from '../../../lib/Helper/Helper';
import '../../components/main-body/project-modal/project-modal';

export default class MainBody extends HTMLElement {
  createdCallback() {
    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    this.addEventListener('show-project', this.onShowProject.bind(this), false);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  onShowProject(evt) {
    this.projectModal.get().id = evt.detail;
    this.projectModal.get().visible = true;
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get projectModal() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(1));
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<main>
              <project-modal visible="true"></project-modal>
              <slot></slot>
            </main>`;
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
if (!window.customElements.get('main-body')) {
  document.registerElement('main-body', MainBody);
}
