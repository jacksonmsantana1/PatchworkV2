import Page from 'page';
import Request from 'superagent';
import H from '../../../lib/Helper/Helper';
import Token from '../../../lib/Token/Token';

/* eslint  new-cap:0 */
export default class PwProject extends HTMLElement {
  static get observedAttributes() {
    return ['id', 'session'];
  }

  createdCallback() {
    // Initializing attributes
    this.id = this.getAttribute('id') || '';
    this.session = this.getAttribute('session') || '';
    this._svg = {};

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });

    this.addEventListener('change-svg-image', this.onChangeSvgImage.bind(this), false);

    if (this.session && this.id) {
      this.getOldProject(Token.getPayload().get().email, this.session)
        .then((res) => {
          if (res.body.projectId === this.id) {
            this._svg = res.body.svg;
            this.render();
            this.addListenersToPolygons();
          } else {
            console.error('Session ID is not bounded with the this project');
            Page('/#/main');
          }

          Token.setToken(res.req.header.Authorization);
        })
        .catch((err) => {
          console.error(err.message);
          this.getNewProject(this.id)
            .then((res) => {
              this._svg = res.body.svg;
              this.render();
              this.addListenersToPolygons();
              Token.setToken(res.req.header.Authorization);
              return this.saveNewProject();
            })
            .then((res) => {
              console.log('New project Saved');
              Token.setToken(res.req.header.Authorization);
            });
        });
    }

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  detachedCallback() {
    const token = Token.getToken().get();
    const retVal = confirm("Do you want to save this project ?");

    if (retVal !== true) {
      this.removeProject(token);
    }
  }

  onChangeSvgImage(evt) {
    const id = evt.detail.id;
    const image = evt.detail.image;

    this.updateSvgObject(id, image);
    this.saveProjectSvg().then((res) => {
      console.log('Project Saved');
      this.setSvgPatternImage(id, image);
      evt.stopPropagation();
      Token.setToken(res.req.header.Authorization);
    });
  }

  updateSvgObject(id, image) {
    const _svg = Object.assign({}, this._svg);
    _svg.patterns.map((pattern) => {
      if (pattern.id === id) {
        pattern.image.href = image; /* eslint no-param-reassign:0 */
      }
    });

    this._svg = _svg;
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  projectToSVG(project) {
    return `<svg width="${project.width}" height="${project.height}" viewBox="${project.viewBox}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${project.patterns.map(pattern => `${this.patternSVG(pattern)}`).join('')}
      </defs>
      ${project.polygons.map(polygon => `${this.polygonSVG(polygon)}`).join('')}
    </svg>`;
  }

  // EX: pattern = {
  //   id: "PATERN_ID",
  //   width: "PATTERN_WIDTH",
  //   height: "PATTERN_HEIGHT",
  //   image: {
  //     href: "http://blablac.com.br",
  //     x: 150,
  //     y: 150,
  //     width: 100,
  //     height: 100
  //   }
  // }
  patternSVG(pattern) {
    return `<pattern id="${pattern.id}" patternUnits="userSpaceOnUse" width="${pattern.width}" height="${pattern.height}">
              <image xlink:href="${pattern.image.href}" x="${pattern.image.x}" y="${pattern.image.y}" width="${pattern.image.width}" height="${pattern.image.height}" />
            </pattern>`;
  }

  // EX: polygon = { points: [[x1, y1], [x2, y2], ... , [xn, yn]], id: "POLYGON ID" }
  polygonSVG(polygon) {
    const points = polygon.points.reduce((val, point) => `${val} ${point[0]},${point[1]}`);
    return `<polygon points="${points}" fill="url(#${polygon.id})" id="${polygon.id}"></polygon>`;
  }

  addListenersToPolygons() {
    /* eslint array-callback-return:0 */
    this.svg.map((elem) => {
      elem.addEventListener('click', function clicked(evt) {
        if (evt.target !== evt.currentTarget) {
          const id = evt.target.id;
          H.emitEvent(true, true, id, 'show-fabrics', this);
        }

        evt.stopPropagation();
      });
    });
  }

  setSvgPatternImage(id, img) {
    return this.getSvgPatternById(id)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.props('href'))
      .chain(H.changeProps('baseVal', img));
  }

  getSvgPatternById(id) {
    /* eslint consistent-return:0 */
    return this.svg.chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .map(nodes =>
        Array.prototype.slice.call(nodes).filter(node =>
          (node && node.tagName === 'pattern' && node.id === id)))
      .chain(H.nth(0));
  }

  getSvgPolygonById(id) {
    /* eslint consistent-return:0 */
    return this.svg.chain(H.childNodes).map(nodes =>
      Array.prototype.slice.call(nodes).filter(node =>
        (node && node.tagName === 'polygon' && node.id === id)))
      .chain(H.nth(1));
  }

  saveNewProject() {
    return Request.post(`http://localhost:3000/user/save/project`)
      .set('Authorization', Token.getToken().get())
      .set('Content-Type', 'application/json')
      .send({
        projectId: this.id,
        sessionId: this.session,
        name: '//TODO See how to do this',
        svg: this._svg,
      })
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          Page('/#/login');
        }
      });
  }

  saveProjectSvg() {
    const email = Token.getPayload().get().email;
    const sessionId = this.session;

    return Request.put(`http://localhost:3000/user/${email}/projects/${sessionId}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json')
     .send({ svg: this._svg })
     .catch((err) => {
       if (err.message === 'Unauthorized') {
         Page('/#/login');
       }
     });
  }

  removeProject(token) {
    return Request.delete(`http://localhost:3000/user/projects/${this.session}`)
     .set('Authorization', token)
     .set('Content-Type', 'application/json')
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          Page('/#/login');
        }
      });
  }

  getNewProject(id) {
    return Request.get(`http://localhost:3000/projects/${id}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json')
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          Page('/#/login');
        }
      });
  }

  getOldProject(email, session) {
    return Request.get(`http://localhost:3000/users/${email}/projects/${session}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json')
     .catch((err) => {
       if (err.message === 'Unauthorized') {
         Page('/#/login');
       }
     });
  }

  get svg() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.childNodes)
      .chain(H.nth(0));
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('id', value);
  }

  get session() {
    return this._session;
  }

  set session(value) {
    this._session = value;
    this.setAttribute('session', value);
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div id="wrapper" class="size1">${this.projectToSVG(this._svg)}</div>`;
  }

  get style() {
    return `<style>
              #wrapper {
                position:relative;
                width:500px;
                height:500px;
                margin:0 auto
              }

              svg {
                position:absolute;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project')) {
  document.registerElement('pw-project', PwProject);
}
