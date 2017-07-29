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
    this._blockSize = 1;

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

  onFocusOut(evt) {
    const value = parseFloat(this.input.get().value);

    if (value) {
      this._blockSize = value;
      this.showModal();
      this.input.get().value = value;
    }

    evt.stopPropagation();
  }

  onKeyPress(evt) {
    const value = this.input.get().value || '';
    let result = '';

    if (evt.which !== 46 && (evt.which < 48 || evt.which > 57)) {
      result = value;
    } else {
      result = value + evt.key;
    }

    this.input.get().value = result;
    evt.preventDefault();
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
    const yHeight = window.scrollY + 15;
    this.globalModalContents.chain(H.props('style')).chain(H.changeProps('top', `${yHeight}px`));
    evt.stopPropagation();
  } */

  addListeners() {
    // Adding event listeners responsible with the modal scroll and to exit of the modal
    // document.addEventListener('scroll', this.scrollHandler);
    this.overlay.get().addEventListener('click', this.overlayClickHandler, false); // FIXME Give a look about it
    this.input.get().addEventListener('focusout', this.onFocusOut.bind(this), false);
    this.input.get().addEventListener('keypress', this.onKeyPress.bind(this), false);
  }

  removeListeners() {
    // document.removeEventListener('scroll', this.scrollHandler);
    this.overlay.get().removeEventListener('click', this.overlayClickHandler);
  }

  gotToPageTop() {
    // Putting the modal at the top of the page
    const yHeight = 15;
    window.scrollTo(yHeight, 0);

    this.globalModalContents
      .chain(H.props('style'))
      .chain(H.changeProps('top', `${yHeight}px`));
  }

  showModal() {
    if (!this._blockSize) {
      this._blockSize = 1;
    }

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

  get input() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('input'));
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

  squareTriangule(blockSize, measurement, id) {
    const a = ((blockSize * measurement.a) / 100).toFixed(2);
    const b = ((blockSize * measurement.b) / 100).toFixed(2);
    const total = (((a * b) / 2) * measurement.times).toFixed(2);

    return `<div class="measure">
              <div class="amount">x${measurement.times}</div>
              <div class="form">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle" width='150' height='150'>
                  <defs>
                    <pattern patternUnits="userSpaceOnUse" width="150" height="150" id="${id}">
                      <image xlink:href="${measurement.image}" x="0" y="0" width="150" height="150"></image>
                    </pattern>
                  </defs>
                  <polygon fill="url(#${id})" points="30,25 30,125 130,125"/>
                  <text fill="#000000" stroke="#000" x="0" y="85" font-size="10">${a}</text>
                  <text fill="#000000" stroke="#000" x="65" y="140" font-size="10">${b}</text>
                </svg>
              </div>
              <div class="total">Total: ${total} cm<sup>2</sup></div>
            </div>`;
  }

  square(blockSize, measurement, id) {
    const a = ((blockSize * measurement.a) / 100).toFixed(2);
    const b = ((blockSize * measurement.b) / 100).toFixed(2);
    const total = (a * b * measurement.times).toFixed(2);

    return `<div class="measure">
              <div class="amount">x${measurement.times}</div>
              <div class="form">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle" width='150' height='150'>
                  <defs>
                    <pattern patternUnits="userSpaceOnUse" width="150" height="150" id="${id}">
                      <image xlink:href="${measurement.image}" x="0" y="0" width="150" height="150"></image>
                    </pattern>
                  </defs>
                  <polygon fill="url(#${id})" points="30,25 30,125 130,125 130, 25"/>
                  <text fill="#000000" stroke="#000" x="0" y="80" font-size="10">${a}</text>
                  <text fill="#000000" stroke="#000" x="70" y="140" font-size="10">${b}</text>
                </svg>
              </div>
              <div class="total">Total: ${total} cm<sup>2</sup></div>
            </div>`;
  }

  triangule(blockSize, measurement, id) {
    const a = ((blockSize * measurement.a) / 100).toFixed(2);
    const b = ((blockSize * measurement.b) / 100).toFixed(2);
    const total = (((a * b) / 2) * measurement.times).toFixed(2);

    return `<div class="measure">
              <div class="amount">x${measurement.times}</div>
              <div class="form">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle" width='150' height='150'>
                  <defs>
                    <pattern patternUnits="userSpaceOnUse" width="150" height="150" id="${id}">
                      <image xlink:href="${measurement.image}" x="0" y="0" width="150" height="150"></image>
                    </pattern>
                  </defs>
                  <polygon fill="url(#${id})" points="20,125 140,125 80,50"/>
                  <text fill="#000000" stroke="#000" x="5" y="85" font-size="10">${a}</text>
                  <text fill="#000000" stroke="#000" x="75" y="140" font-size="10">${b}</text>
                </svg>
              </div>
              <div class="total">Total: ${total} cm<sup>2</sup></div>
            </div>`;
  }

  rectangule(blockSize, measurement, id) {
    const a = ((blockSize * measurement.a) / 100).toFixed(2);
    const b = ((blockSize * measurement.b) / 100).toFixed(2);
    const total = (a * b * measurement.times).toFixed(2);

    return `<div class="measure">
              <div class="amount">x${measurement.times}</div>
              <div class="form">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle" width='150' height='150'>
                  <defs>
                    <pattern patternUnits="userSpaceOnUse" width="150" height="150" id="${id}">
                      <image xlink:href="${measurement.image}" x="0" y="0" width="150" height="150"></image>
                    </pattern>
                  </defs>
                  <polygon fill="url(#${id})" points="30,25 30,100 205,100 205, 25"/>
                  <text fill="#000000" stroke="#000" x="0" y="70" font-size="10">${a}</text>
                  <text fill="#000000" stroke="#000" x="85" y="120" font-size="10">${b}</text>
                </svg>
              </div>
              <div class="total">Total: ${total} cm<sup>2</sup></div>
            </div>`;
  }

  get html() {
    /* eslint class-methods-use-this:0 array-callback-return:0 */
    return `<div class="global-modal">
              <div class="overlay"></div>
              <div class="global-modal_contents global-modal-transition">
                <div class="size">
                 <input id="blockSize" type="text" placeholder="Block Size (cm)" />
                </div>
                  ${this._measurements.map((m, index) => {
                    /* eslint consistent-return:0 */
                    if (m.type === 'square-triangule') {
                      return this.squareTriangule(this._blockSize, m, index);
                    } else if (m.type === 'square') {
                      return this.square(this._blockSize, m, index);
                    } else if (m.type === 'triangule') {
                      return this.triangule(this._blockSize, m, index);
                    } else if (m.type === 'rectangule') {
                      return this.rectangule(this._blockSize, m, index);
                    }
                  }).join('')}
              </div>
              </div>
            </div>`;
  }

  get style() {
    return `<style>
              sup {
                font-size: small;
              }

              .size {
                display: flex;
                width: 100%;
                background: #d98383;
                height: 100px;
                justify-content: center;
                align-items:center;
              }

              input {
                width: 86%;
                height: 2.5em;
                margin: .75em;
                border-radius: 2em;
                border: none;
                background: rgba(255, 255, 255, 0.9);
                box-shadow: inset 0 0.1em 0.1em rgba(0, 0, 0, 0.8);
                padding-left: 1em;
                color: rgba(0, 0, 0, 0.65);
                font-family: "Helvetica", Arial, sans-serif;
                font-size: 100%;
              }

              input[type=text]:focus {
                border: 2px solid rgba(81, 203, 238, 1);
              }

              input:focus {outline:0;}

              .measure {
                background: #e4a0a0;
                margin: 25px;
                border-style: dashed;
                display: inline-flex;
                min-width: 45%;
              }

              .total {
                font-size: large;
                text-align: center;
                order: 3;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 15px;
                margin-left: 15px;
              }

              .amount {
                font-size: -webkit-xxx-large;
                order: 1;
              }

              .form > svg {
                margin: auto;
              }

              .form {
                order:2;
                margin-left: 15px;
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
