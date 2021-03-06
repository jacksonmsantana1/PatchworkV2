import Request from 'superagent';
import Page from 'page';
import './pw-project-modal-button/pw-project-modal-button';
import './pw-project-layout/pw-project-layout';
import H from '../../../../lib/Helper/Helper';
import Token from '../../../../lib/Token/Token';

/*  eslint no-underscore-dangle:0 */
export default class PwProjectModal extends HTMLElement {
  static get observedAttributes() {
    return ['visible', 'id', 'buttonvisible'];
  }

  createdCallback() {
    // Setting the initial attributes
    this._visible = this.getAttribute('visible') || '';
    this._id = this.getAttribute('id') || '';
    this._buttonvisible = this.getAttribute('buttonvisible') || '';
    this._project = {};

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    // this.render();

    // Event handler variables -> Necessary because of the removeEventListener
    this.scrollHandler = this.onScroll.bind(this);
    this.overlayClickHandler = this.onOverlayClick.bind(this);

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

  onOverlayClick() {
    this.visible = '';
  }

  onScroll(evt) {
    /* eslint no-unused-vars:0 */
    const yHeight = window.scrollY + 15;
    this.modal.chain(H.props('style')).chain(H.changeProps('top', `${yHeight}px`));
    evt.stopPropagation();
  }

  getProject() {
    return Request.get(`http://localhost:3000/projects/${this.id}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json');
  }

  showModal() {
    this.getProject()
      .then((res) => {
        this.html = res.body;
        this.render();
        this.makeModalVisible();
        Token.setToken(res.req.header.Authorization);
      })
      .catch((err) => {
        console.log(err.message);
        Page('/#/login'); /* eslint new-cap:0 */
      });
  }

  makeModalVisible() {
    // Putting the modal at the top of the page
    const yHeight = window.scrollY + 15;
    this.modal.chain(H.props('style')).chain(H.changeProps('top', `${yHeight}px`));

    // Adding event listeners responsible with the modal scroll and to exit of the modal
    document.addEventListener('scroll', this.scrollHandler);
    this.overlay.get().addEventListener('click', this.overlayClickHandler, false); // FIXME Give a look about it

    H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.props('classList'))
      .chain(H.addClass('global-modal-show'));
  }

  hideModal() {
    H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.props('classList'))
      .chain(H.removeClass('global-modal-show'));

    document.removeEventListener('scroll', this.scrollHandler);
    this.overlay.get().removeEventListener('click', this.overlayClickHandler);

    this.id = '';
  }

  get overlay() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(1));
  }

  get modal() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(3));
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('id', value);
    this.render();
  }

  get buttonvisible() {
    return this._buttonVisible;
  }

  set buttonvisible(value) {
    this._buttonVisible = value;
    this.setAttribute('buttonvisible', value);
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    this._visible = value;
    this.setAttribute('visible', value);
    if (value) {
      this.showModal();
    } else {
      this.hideModal();
    }
  }

  get html() {
    return this._html;
  }

  set html(project) {
    /* eslint quotes:0 class-methods-use-this:0 */
    this._html = `<div class="global-modal">
              <div class="overlay"></div>
              <div class="global-modal_contents global-modal-transition">
                <div class="global-modal-header">
                  <span class="mobile-close"> X </span>
                  <h3> <span> ${project.name} </span> </h3>
                  <pw-project-layout svg="${project.layout}"></pw-project-layout>
                  ${this._buttonvisible ? `<pw-project-modal-button id="${this.id}"></pw-project-modal-button>` : ''}
                </div>
              </div>
            </div>`;
  }

  get style() {
    return `<style>
              .overlay {
                background: rgba(255, 255, 255, 0.77);
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
              }

              .global-modal {
                visibility: hidden;
              }

              .global-modal_contents {
                background: #FFF;
                -webkit-box-shadow: 0 0 8px 2px rgba(182, 182, 182, 0.75);
                -moz-box-shadow: 0 0 8px 2px rgba(182,182,182, 0.75);
                -o-box-shadow: 0 0 8px 2px rgba(182,182,182,0.75);
                box-shadow: 0 0 8px 2px rgba(182, 182, 182, 0.75);
                width: 50%;
                position: absolute;
                left: 10%;
                top: 15%;
                min-height: 95%;
                min-width: 80%;
                z-index: 10;
              }

              .global-modal-header{
                border-bottom: 1px solid #ccc;
              }

              .global-modal-header h3{
                color: #34495E;
                text-align: center;
                font-weight: bold;
                font-size: 22px;
              }

              .global-modal-show {
                visibility: visible;
              }

              .global-modal-transition {
                -webkit-transform: scale(0.7);
                -moz-transform: scale(0.7);
                -ms-transform: scale(0.7);
                transform: scale(0.7);
                opacity: 0;
                -webkit-transition: all 0.3s;
                -moz-transition: all 0.3s;
                transition: all 0.3s;
              }

              .global-modal-show .global-modal-transition {
                -webkit-transform: scale(1);
                -moz-transform: scale(1);
                -ms-transform: scale(1);
                transform: scale(1);
                opacity: 1;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project-modal')) {
  document.registerElement('pw-project-modal', PwProjectModal);
}
