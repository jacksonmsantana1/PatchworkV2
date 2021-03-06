import Request from 'superagent';
import Page from 'page';
import Token from '../lib/Token/Token';
import './components/pw-main-body/pw-main-body';
import './components/pw-main-body/pw-projects-list/pw-projects-list';
import './components/pw-main-body/pw-project-item/pw-project-item';
import './components/pw-nav-bar/pw-nav-bar';
import './components/pw-nav-bar/pw-nav-bar-tab/pw-nav-bar-tab';

class MainPage extends HTMLElement {
  createdCallback() {
    if (super.createdCallback) {
      super.createdCallback();
    }

    // Initializing properties
    this._html = '';

    // Getting the projects from the server
    this.getProjects().then((res) => {
      if (res) {
        this.html = res.body;
        this.innerHTML = this.html;
        this.addEventListener('go-to-page', this.onGoToPage.bind(this), false);
        Token.setToken(res.req.header.Authorization);
      }
    })
    .catch((err) => {
      console.log(err.message);
      Page('/#/login'); /* eslint new-cap:0 */
    });
  }

  onGoToPage(evt) {
    const url = evt.detail;

    Page(url);
    evt.stopPropagation();
  }

  getProjects() {
    return Request.get('http://localhost:3000/projects')
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json');
  }

  get html() {
    return this._html;
  }

  set html(projects) {
    /* eslint quotes:0 class-methods-use-this:0 */
    this._html = `<pw-nav-bar logo="Patchwork Project">
                    <pw-nav-bar-tab class="active" href="/#/blocks" slot="tabsSlot">Block Builder</pw-nav-bar-tab>
                    <pw-nav-bar-tab class="active" href="/#/main" slot="tabsSlot">Main</pw-nav-bar-tab>
                    <pw-nav-bar-tab class="active" href="/#/login" slot="tabsSlot">Logout</pw-nav-bar-tab>
                  </pw-nav-bar>
                  <pw-main-body>
                    <pw-projects-list>
                      ${projects.map(proj => `<pw-project-item active="true" image="${proj.image}" id="${proj._id}">${proj.description}</pw-project-item>`).join('')}
                    </pw-projects-list>
                  </pw-main-body>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('main-page')) {
  document.registerElement('main-page', MainPage);
}
