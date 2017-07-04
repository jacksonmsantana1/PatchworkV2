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
    this.getProject(value).then((res) => {
      this._id = value;
      this.setAttribute('id', value);
      this.html = res.body;
      this.render();
    })
    .catch((err) => {
      console.log(err.message);
      Page('/#/login'); /* eslint new-cap:0 */
    });
  }

  get html() {
    return this._html;
  }

  get style() {
    return `<style>
              h1 {
                text-align: center;
                font-family: monospace;
                color: #c1769c;
              }
            </style>`;
  }

  set html(project) {
    /* eslint quotes:0 class-methods-use-this:0 */
    this._html = `<pw-nav-bar logo="Patchwork Project">
                    <pw-nav-bar-tab class="active" href="/#/" slot="tabsSlot">Main</pw-nav-bar-tab>
                    <pw-nav-bar-tab class="active" href="/#/login" slot="tabsSlot">Logout</pw-nav-bar-tab>
                  </pw-nav-bar>
                  <pw-project-body id="${this.id}">
                    <h1>${project.name}</h1>
                  </pw-project-body>`;
  }

  render() {
    this.innerHTML = this.style + this.html;
  }

  getProject(id) {
    return Request.get(`http://localhost:3000/projects/${id}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json');
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('project-page')) {
  document.registerElement('project-page', ProjectPage);
}
