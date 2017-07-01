import Request from 'superagent';
import Page from 'page';
import Token from '../lib/Token/Token';
import './pw-project-body/pw-project-body';

// TODO Refactor the getHtml and the getProjects
class ProjectPage extends HTMLElement {
  createdCallback() {
    if (super.createdCallback) {
      super.createdCallback();
    }

    // Initializing properties
    this._id = this.getAttribute('id') || '';

    // Getting the projects from the server
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.getProject().then((res) => {
      this.html = res.body;
      this.render();
      this.setAttribute('id', value);
    })
    .catch((err) => {
      console.log(err.message);
      Page('/#/login'); /* eslint new-cap:0 */
    });
  }

  get html() {
    return this._html;
  }

  set html(project) {
    /* eslint quotes:0 class-methods-use-this:0 */
    this._html = `<pw-nav-bar logo="Patchwork Project">
                    <pw-nav-bar-tab class="active" href="/#/" slot="tabsSlot">Main</pw-nav-bar-tab>
                    <pw-nav-bar-tab class="active" href="/#/login" slot="tabsSlot">Logout</pw-nav-bar-tab>
                  </pw-nav-bar>
                  <pw-project-body id="${this.id}">
                    <h1>Project : ${project.name}</h1>
                  </pw-project-body>`;
  }

  render() {
    this.innerHTML = this.html;
  }

  getProject() {
    return Request.get(`http://localhost:3000/projects/${this.id}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json');
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('project-page')) {
  document.registerElement('project-page', ProjectPage);
}
