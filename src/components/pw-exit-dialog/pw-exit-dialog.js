import H from '../../lib/Helper/Helper';

export default class PwSaveDialog extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'message'];
  }

  createdCallback() {
    // Initializing attributes
    this._title = this.getAttribute('title') || '';
    this._message = this.getAttribute('message') || '';

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

  get saveButton() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(5));
  }

  get dontSaveButton() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(7));
  }


  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
    this.setAttribute('title', value);
    this.render();
  }

  get message() {
    return this._message;
  }

  set message(value) {
    this._message = value;
    this.setAttribute('message', value);
    this.render();
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div id="modalContainer">
              <div id="alertBox">
                <h1>${this.title}</h1>
                <p>${this.message}</p>
                <button type="button" class="closeBtn">Yes</button>
                <button type="button" class="closeBtn">No</button>
              </div>
            </div>`;
  }

  get style() {
    return `<style>
              #modalContainer {
                background-color:rgba(0, 0, 0, 0.3);
                position:absolute;
                top:0;
                width:100%;
                height:100%;
                left:0px;
                z-index:10000;
              }

              #alertBox {
                position:relative;
                width:33%;
                min-height:100px;
                max-height:400px;
                margin-top:50px;
                border:2px dashed #dea3a3;
                border-radius: 10px;
                background-color:#ffc5c5;
                background-repeat:no-repeat;
                top:30%;
                left: ${(document.documentElement.scrollWidth - this.offsetWidth) / 2}px;
              }

              h1 {
                margin:0;
                font:bold 1em Raleway,arial;
                background-color:#d89ba6;
                color:#FFF;
                border-bottom:1px solid #f97352;
                padding:10px 0 10px 5px;
              }

              p {
                height:50px;
                padding-left:5px;
                padding-top:30px;
                text-align:center;
                vertical-align:middle;
              }

              .closeBtn {
                display:inline-block;
                position:relative;
                margin:10px 15% 10px 15%;
                padding:15px;
                border:0 none;
                width:70px;
                text-transform:uppercase;
                text-align:center;
                color:#FFF;
                background-color:#e2b8c0;
                border-radius: 5px;
                text-decoration:none;
                outline:0!important;
              }

              .closeBtn:hover {
                background-color: #d89ba6;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-save-dialog')) {
  document.registerElement('pw-save-dialog', PwSaveDialog);
}
