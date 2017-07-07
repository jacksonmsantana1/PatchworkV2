import './pw-project-body/pw-project-body';

// TODO Refactor the getHtml and the getProjects
class ProjectPage extends HTMLElement {
  static get observedAttributes() {
    return ['id', 'session'];
  }

  createdCallback() {
    if (super.createdCallback) {
      super.createdCallback();
    }

    // Initializing properties
    this._id = this.getAttribute('id') || '';
    this._session = this.getAttribute('session') || '';
    this.render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  get session() {
    return this._session;
  }

  set session(value) {
    this._session = value;
    this.setAttribute('session', value);
    this.render();
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
    return `<pw-nav-bar logo="Patchwork Project">
              <pw-nav-bar-tab class="active" href="/#/main" slot="tabsSlot">Main</pw-nav-bar-tab>
              <pw-nav-bar-tab class="active" href="/#/login" slot="tabsSlot">Logout</pw-nav-bar-tab>
            </pw-nav-bar>
            <pw-project-body id="${this.id}" session="${this.session}">
            </pw-project-body>`;
  }

  get style() {
    /* eslint class-methods-use-this:0 */
    return `<style>
              h1 {
                text-align: center;
                font-family: monospace;
                color: #c1769c;
              }
            </style>`;
  }

  render() {
    this.innerHTML = this.style + this.html;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('project-page')) {
  document.registerElement('project-page', ProjectPage);
}
