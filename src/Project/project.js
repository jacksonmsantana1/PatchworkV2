import Either from 'data.either';
import Page from 'page';
import H from '../lib/Helper/Helper';
import './pw-project-body/pw-project-body';

/* eslint new-cap:0 */
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

    this.addEventListener('go-to-page', this.onGoToPage.bind(this), false);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  onGoToPage(evt) {
    const detail = evt.detail;
    const pwProjectBody = this.getPwProjectBody().get();

    window.alert('Would you like to save this project ?', (toSave) => {
      if (toSave) {
        H.emitEvent(true, true, '', 'save-project', pwProjectBody);
      } else {
        H.emitEvent(true, true, '', 'remove-project', pwProjectBody);
      }

      Page(`${detail}`);
    });

    evt.stopPropagation();
  }

  getPwProjectBody() {
    return Either.fromNullable(this)
      .chain(H.querySelector('pw-project-body'));
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
              <pw-nav-bar-tab class="active" href="/#/blocks" slot="tabsSlot">Block Builder</pw-nav-bar-tab>
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
