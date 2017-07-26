import H from '../../lib/Helper/Helper';
import Measurement from '../../lib/Measurement/Measurement';

export default class PwMeasurementsModal extends HTMLElement {
  static get observedAttributes() {
    return ['visible'];
  }

  createdCallback() {
    // Setting the initial attributes
    this._visible = this.getAttribute('visible') || '';
    this._measurements = [];

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    // Event handler variables -> Necessary because of the removeEventListener
    // this.scrollHandler = this.onScroll.bind(this);
    this.overlayClickHandler = this.onOverlayClick.bind(this);
    this.addEventListener('show-measurements-modal-down', this.onShowMeasurementsModalDown.bind(this), false);

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

  onShowMeasurementsModalDown(evt) {
    const measures = Object.entries(evt.detail);
    this._measurements = measures.map((arr) => {
      const obj = Measurement.getMeasurementFromStr(arr[0]);
      obj.times = arr[1];
      return obj;
    });
    this.showModal();
    evt.stopPropagation();
  }

  onOverlayClick() {
    this.visible = '';
  }

  /* onScroll(evt) {
    [> eslint no-unused-vars:0 <]
    const yHeight = window.scrollY + 15;
    this.globalModalContents.chain(H.props('style')).chain(H.changeProps('top', `${yHeight}px`));
    evt.stopPropagation();
  } */

  addListeners() {
    // Adding event listeners responsible with the modal scroll and to exit of the modal
    // document.addEventListener('scroll', this.scrollHandler);
    this.overlay.get().addEventListener('click', this.overlayClickHandler, false); // FIXME Give a look about it
  }

  removeListeners() {
    // document.removeEventListener('scroll', this.scrollHandler);
    this.overlay.get().removeEventListener('click', this.overlayClickHandler);
  }

  gotToPageTop() {
    // Putting the modal at the top of the page
    const yHeight = window.scrollY + 15;
    this.globalModalContents
      .chain(H.props('style'))
      .chain(H.changeProps('top', `${yHeight}px`));
  }

  showModal() {
    this.render();
    this.gotToPageTop();
    this.addListeners();
    this.globalModal
      .chain(H.props('classList'))
      .chain(H.addClass('global-modal-show'));
  }

  hideModal() {
    this.globalModal
      .chain(H.props('classList'))
      .chain(H.removeClass('global-modal-show'));

    this.removeListeners();
  }

  get globalModal() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('div.global-modal'));
  }

  get overlay() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('div.overlay'));
  }

  get globalModalContents() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('div.global-modal_contents'));
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('id', value);
    this.render();
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

  squareTriangule(measurement) {
    return `<div class="measure">
              <div class="amount">x${measurement.times}</div>
              <div class="form">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle" width='150' height='150'>
                  <defs>
                    <pattern patternUnits="userSpaceOnUse" width="150" height="150" id="measure">
                      <image xlink:href="${measurement.image}" x="0" y="0" width="150" height="150"></image>
                    </pattern>
                  </defs>
                  <polygon fill="url(#measure)" points="25,25 25,125 125,125"/>
                  <text fill="#000000" stroke="#000" x="5" y="85" font-size="10">${measurement.a}</text>
                  <text fill="#000000" stroke="#000" x="65" y="140" font-size="10">${measurement.b}</text>
                </svg>
              </div>
            </div>`;
  }

  get html() {
    /* eslint class-methods-use-this:0 array-callback-return:0 */
    return `<div class="global-modal">
              <div class="overlay"></div>
              <div class="global-modal_contents global-modal-transition">
                  ${this._measurements.map((m) => {
                    /* eslint consistent-return:0 */
                    if (m.type === 'square-triangule') {
                      return this.squareTriangule(m);
                    }
                  }).join('')}
              </div>
              </div>
            </div>`;
  }

  get style() {
    return `<style>
              .measure {
                background: #e4a0a0;
                width: 45%;
                height: 150px;
                margin: 10px;
                border-style: dashed;
                float: left;
              }

              .amount {
                width: 20%;
                display: inline-block;
                background: #bb7d7d;
                font-size: -webkit-xxx-large;
                text-align: right;
                position: relative;
                top: -50px;
              }

              .form > svg {
                display: block;
                margin: auto;
              }

              .form {
                width: 33%;
                height: 100%;
                display: inline-block;
                background: #e4a0a0;
                margin-left: 50px;
              }

              .credit {
                position: fixed;
                bottom: 10px;
                width: 100%;
                left: 0;
              }

              .overlay {
                background: rgba(255, 255, 255, 0.77);
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 100;
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
                z-index: 150;
                background: mistyrose;
              }

              .global-modal_contents h1 {
                margin: 0;
                padding: 0;
                line-height: 32rem;
                text-align: center;
                display: block;
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
if (!window.customElements.get('pw-measurements-modal')) {
  document.registerElement('pw-measurements-modal', PwMeasurementsModal);
}
