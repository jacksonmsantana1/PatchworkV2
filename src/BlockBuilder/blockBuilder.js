import Page from 'page';
import Either from 'data.either';
import H from '../lib/Helper/Helper';
import './pw-block-builder-body/pw-block-builder-body';

/* eslint new-cap:0 */
class BlockBuilderPage extends HTMLElement {
  static get observedAttributes() {
    return ['session'];
  }

  createdCallback() {
    if (super.createdCallback) {
      super.createdCallback();
    }

    // Initializing properties
    this._session = this.getAttribute('session') || '';
    this.render();

    // Event Listeners
    this.addEventListener('go-to-page', this.onGoToPage.bind(this), false);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  onGoToPage(evt) {
    const detail = evt.detail;
    const pwBlockBuilderBody = this.getPwBlockBuilderBody().get();

    if (detail !== '/#/blocks') {
      window.alert('Would you like to save this project ?', (toSave) => {
        if (toSave) {
          H.emitEvent(true, true, '', 'save-project', pwBlockBuilderBody);
        } else {
          H.emitEvent(true, true, '', 'remove-project', pwBlockBuilderBody);
        }

        Page(`${detail}`);
      });
    }

    evt.stopPropagation();
  }

  getPwBlockBuilderBody() {
    return Either.fromNullable(this)
      .chain(H.querySelector('pw-block-builder-body'));
  }

  get session() {
    return this._session;
  }

  set session(value) {
    this._session = value;
    this.setAttribute('session', value);
    this.render();
  }

  get html() {
    return `<pw-nav-bar logo="Patchwork Project">
              <pw-nav-bar-tab class="active" href="/#/blocks" slot="tabsSlot">Block Builder</pw-nav-bar-tab>
              <pw-nav-bar-tab class="active" href="/#/main" slot="tabsSlot">Main</pw-nav-bar-tab>
              <pw-nav-bar-tab class="active" href="/#/login" slot="tabsSlot">Logout</pw-nav-bar-tab>
            </pw-nav-bar>
            <pw-block-builder-body session="${this.session}"></pw-block-builder-body>`;
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
if (!window.customElements.get('block-builder-page')) {
  document.registerElement('block-builder-page', BlockBuilderPage);
}
