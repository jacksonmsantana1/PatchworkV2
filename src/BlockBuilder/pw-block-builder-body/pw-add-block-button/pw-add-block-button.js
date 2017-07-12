export default class PwAddBlockButton extends HTMLElement {
  createdCallback() {
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

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="round-button">
              <div class="round-button-circle">
                <a class="round-button">&#43</a>
              </div>
            </div>`;
  }

  get style() {
    return `<style>
              .round-button {
                position: fixed;
                bottom: 1%;
                width: 15%;
                left: 50%;
              }

              .round-button-circle {
                padding-bottom: 100%;
                border-radius: 50%;
                border:10px solid #cfdcec;
                overflow:hidden;
                background: #e4a0a0;
                box-shadow: 0 0 3px gray;
              }

              .round-button-circle:hover {
                background:#f19292;
              }

              .round-button a {
                padding-bottom: 5%;
                line-height:1em;
                margin-top:-0.5em;
                text-align:center;
                color:#e2eaf3;
                font-family:Verdana;
                font-size:5em;
                font-weight:bold;
                text-decoration:none;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-add-block-button')) {
  document.registerElement('pw-add-block-button', PwAddBlockButton);
}
