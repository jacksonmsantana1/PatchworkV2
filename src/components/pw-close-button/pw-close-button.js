import H from '../../lib/Helper/Helper';

export default class PwCloseButton extends HTMLElement {
  static get observedAttributes() {
    return ['target'];
  }

  createdCallback() {
    // Initializing attributes
    this._target = this.getAttribute('target') || '';

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

  onClick(evt) {
    H.emitEvent(true, true, '', `close-${this.target}`, this);
    evt.stopPropagation();
  }

  get target() {
    return this._target;
  }

  set target(value) {
    this._target = value;
    this.setAttribute('target', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="circCont"><button class="circle" data-animation="simpleRotate" data-remove="200"></button></div>`;
  }

  get style() {
    return `<style>
              .circCont {
                display: inline-block;
              }

              .circle {
                width: 40px;
                height: 40px;
                background: transparent;
                border: 4px solid #E91E63;
                -moz-border-radius: 50%;
                -webkit-border-radius: 50%;
                border-radius: 50%;
                position: relative;
                cursor: pointer;
                display: inline-block;
                margin: 10px 20px;
              }

              .circle:after {
                width: 24px;
                height: 4px;
                background-color: #E91E63;
                content: "";
                left: 50%;
                top: 50%;
                margin-left: -12px;
                margin-top: -2px;
                position: absolute;
                -moz-transform: rotate(-45deg);
                -ms-transform: rotate(-45deg);
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                /*@include transform-origin(100%,100%);*/
              }

              .circle:before {
                left: 50%;
                top: 50%;
                margin-left: -12px;
                margin-top: -2px;
                width: 24px;
                height: 4px;
                background-color: #E91E63;
                content: "";
                position: absolute;
                -moz-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                /*@include transform-origin(0%,0%);*/
              }

              @-moz-keyframes rotate {
                0% {
                  -moz-transform: scale(1);
                  transform: scale(1);
                }
                100% {
                  -moz-transform: scale(0.8);
                  transform: scale(0.8);
                }
              }

              @-webkit-keyframes rotate {
                0% {
                  -webkit-transform: scale(1);
                  transform: scale(1);
                }
                100% {
                  -webkit-transform: scale(0.8);
                  transform: scale(0.8);
                }
              }

              @keyframes rotate {
                0% {
                  -moz-transform: scale(1);
                  -ms-transform: scale(1);
                  -webkit-transform: scale(1);
                  transform: scale(1);
                }
                100% {
                  -moz-transform: scale(0.8);
                  -ms-transform: scale(0.8);
                  -webkit-transform: scale(0.8);
                  transform: scale(0.8);
                }
              }

              .simpleRotate {
                -moz-animation: rotate 0.1s 2 ease-in-out alternate;
                -webkit-animation: rotate 0.1s 2 ease-in-out alternate;
                animation: rotate 0.1s 2 ease-in-out alternate;
              }

              .circle[data-animation="simpleRotate"]:not(.simpleRotate) {
                -moz-transition: cubic-bezier(0.175, 0.885, 0.52, 1.775) 200ms;
                -o-transition: cubic-bezier(0.175, 0.885, 0.52, 1.775) 200ms;
                -webkit-transition: cubic-bezier(0.175, 0.885, 0.52, 1.775) 200ms;
                transition: cubic-bezier(0.175, 0.885, 0.52, 1.775) 200ms;
              }

              .circle[data-animation="simpleRotate"]:not(.simpleRotate):hover {
                -moz-transform: scale(1.1);
                -ms-transform: scale(1.1);
                -webkit-transform: scale(1.1);
                transform: scale(1.1);
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-close-button')) {
  document.registerElement('pw-close-button', PwCloseButton);
}
