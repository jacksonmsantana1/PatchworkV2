import Request from 'superagent';
import Token from '../lib/Token/Token';
import './components/main-body/main-body';
import './components/main-body/pw-projects-list/pw-projects-list';
import './components/main-body/pw-project/pw-project';
import './components/nav-bar/nav-bar';
import './components/nav-bar/nav-bar-tab/nav-bar-tab';

class MainPage extends HTMLElement {
  createdCallback() {
    if (super.createdCallback) {
      super.createdCallback();
    }

    this.getProjects().then((res) => {
      this.innerHTML = this.getHtml(res.body);
    });
  }

  getHtml(projects) {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<nav-bar logo="Patchwork Project">
              <nav-bar-tab class="active" href="/#/" slot="tabsSlot">Main</nav-bar-tab>
              <nav-bar-tab class="active" href="/#/login" slot="tabsSlot">Logout</nav-bar-tab>
            </nav-bar>
            <main-body>
              <pw-projects-list>
                ${projects.map(proj => `<pw-project active="true" image="${proj.image}" id="1">${proj.description}</pw-project>`).join('')}
              </pw-projects-list>
            </main-body>`;
  }

  getProjects() {
    return Request.get('http://localhost:3000/projects')
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json');
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('main-page')) {
  document.registerElement('main-page', MainPage);
}
