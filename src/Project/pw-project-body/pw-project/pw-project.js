import Page from 'page';
import Request from 'superagent';
import H from '../../../lib/Helper/Helper';
import Token from '../../../lib/Token/Token';

const MAX_ZOOM = 100;
const MIN_ZOOM = 20;

/* eslint  new-cap:0 prefer-arrow-callback:0 */
export default class PwProject extends HTMLElement {
  static get observedAttributes() {
    return ['id', 'session'];
  }

  createdCallback() {
    // Initializing attributes
    this.id = this.getAttribute('id') || '';
    this.session = this.getAttribute('session') || '';
    this._svg = {};
    this._width = 0;
    this._height = 0;
    this._zoomScale = 100;
    this._exit = false;

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });

    // Event listeners
    this.addEventListener('change-svg-image', this.onChangeSvgImage.bind(this), false);
    this.addEventListener('zoom-in-down', this.onZoomIn.bind(this), false);
    this.addEventListener('zoom-out-down', this.onZoomOut.bind(this), false);
    this.addEventListener('save-project', this.onSaveProject.bind(this), false);
    this.addEventListener('remove-project', this.onRemoveProject.bind(this), false);

    if (this.session && this.id) {
      this.getOldProject(Token.getPayload().get().email, this.session)
        .then((res) => {
          if (res.body && res.body.projectId === this.id) {
            this._svg = res.body.svg;
            this._width = res.body.width;
            this._height = res.body.height;
            this.render();
            Token.setToken(res.req.header.Authorization);
          } else {
            console.error('Session ID is not bounded with the this project');
            Page('/#/main');
          }
        })
        .catch(() => {
          this.getNewProject(this.id)
            .then((res) => {
              if (res && res.body) {
                this._svg = res.body.svg;
                this._width = res.body.width;
                this._height = res.body.height;
                this.render();
                this.addListenersToPolygons();
                this.addMouseOverListenersToPolygons();
                this.addMouseOutListenersToPolygons();
                Token.setToken(res.req.header.Authorization);
                return this.saveNewProject();
              }
            })
            .then((res) => {
              if (res.body) {
                console.log('New project Saved');
                Token.setToken(res.req.header.Authorization);
              }
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
    if (!this._exit) {
      window.alert('Would you like to save this project ?', (toSave) => {
        if (toSave) {
          this.saveProjectSvg().then((res) => {
            if (res) {
              console.log('Project Saved');
              Token.setToken(res.req.header.Authorization);
            }
          });
        } else {
          this.removeProject().then((res) => {
            if (res) {
              console.log('Project Removed');
              Token.setToken(res.req.header.Authorization);
            }
          });
        }
      });
    }
  }

  onSaveProject(evt) {
    this.saveProjectSvg().then((res) => {
      if (res) {
        console.log('Project Saved');
        Token.setToken(res.req.header.Authorization);
      }
    });

    this._exit = true;
    evt.stopPropagation();
  }

  onRemoveProject(evt) {
    this.removeProject().then((res) => {
      if (res) {
        console.log('Project Removed');
        Token.setToken(res.req.header.Authorization);
      }
    });

    this._exit = true;
    evt.stopPropagation();
  }

  onZoomIn(evt) {
    const scale = evt.detail.scale;

    // Maximum scale of 100
    if (this._zoomScale >= MAX_ZOOM) {
      this._zoomScale = MAX_ZOOM;
    } else {
      this._zoomScale += scale;
    }

    this.render();
    evt.stopPropagation();
  }

  onZoomOut(evt) {
    const scale = evt.detail.scale;

    // Minimum scale of 50
    if (this._zoomScale <= MIN_ZOOM) {
      this._zoomScale = MIN_ZOOM;
    } else {
      this._zoomScale -= scale;
    }

    this.render();
    evt.stopPropagation();
  }

  onChangeSvgImage(evt) {
    const id = evt.detail.id;
    const image = evt.detail.image;

    this.updateSvgObject(id, image);
    this.saveProjectSvg().then((res) => {
      if (res) {
        console.log('Project Saved');
        this.setSvgPatternImage(id, image);
        evt.stopPropagation();
        Token.setToken(res.req.header.Authorization);
      }
    });
  }

  updateSvgObject(id, image) {
    const _svg = Object.assign({}, this._svg); // FIXME - use _.deepCopy
    _svg.patterns.map((pattern) => {
      if (pattern.id === id) {
        pattern.image.href = image; /* eslint no-param-reassign:0 */
      }
    });

    this._svg = _svg;
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
    this.addListenersToPolygons();
    this.addMouseOverListenersToPolygons();
    this.addMouseOutListenersToPolygons();
  }

  projectToSVG(project) {
    return `<svg width="${project.width}" height="${project.height}" viewBox="${project.viewBox}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${project.patterns.map(pattern => `${this.patternSVG(pattern)}`).join('')}
      </defs>
      ${project.polygons.map(polygon => `${this.polygonSVG(polygon)}`).join('')}
    </svg>`;
  }

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

  addMouseOverListenersToPolygons() {
    const _this = this;
    this.svg.map((elem) => {
      elem.addEventListener('mouseover', function mouseover(evt) {
        if (evt.target !== evt.currentTarget) {
          const id = evt.target.id;
          _this.setSvgPolygonStroke(id, 'white', 1.5);
        }

        evt.stopPropagation();
      });
    });
  }

  addMouseOutListenersToPolygons() {
    const _this = this;
    this.svg.map((elem) => {
      elem.addEventListener('mouseout', function mouseover(evt) {
        if (evt.target !== evt.currentTarget) {
          const id = evt.target.id;
          _this.setSvgPolygonStroke(id, '', 0);
        }

        evt.stopPropagation();
      });
    });
  }

  setSvgPolygonStroke(id, stroke, width) {
    this.getSvgPolygonById(id).map((polygon) => {
      const _polygon = polygon;

      _polygon.style.stroke = stroke;
      _polygon.style.strokeWidth = width;
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
    return this.svg.chain(H.querySelector('defs'))
      .chain(H.querySelectorAll('pattern'))
      .map(nodes => Array.prototype.slice.call(nodes).filter(node =>
          (node && node.id === id)))
      .chain(H.nth(0));
  }

  getSvgPolygonById(id) {
    return this.svg.chain(H.querySelectorAll('polygon'))
      .map(nodes => Array.prototype.slice.call(nodes).filter(node =>
          (node && node.id === id)))
      .chain(H.nth(0));
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
        type: 'project',
        width: this._width,
        height: this._height,
      })
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          Page('/#/login');
        } else if (err.message === 'Bad Request') {
          return Promise.reject('User Project Not Saved');
        } else {
          return Promise.reject('Something occured...');
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
       } else if (err.message === 'Bad Request') {
         return Promise.reject('User Project Not Updated');
       } else {
         return Promise.reject('Something occured...');
       }
     });
  }

  removeProject() {
    return Request.delete(`http://localhost:3000/user/projects/${this.session}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json')
     .catch((err) => {
       if (err.message === 'Unauthorized') {
         Page('/#/login');
       } else if (err.message === 'Bad Request') {
         return Promise.reject('Project Not Removed');
       } else {
         return Promise.reject('Something occured...');
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
        } else if (err.message === 'Bad Request') {
          return Promise.reject('Project Not Found');
        } else {
          return Promise.reject('Something occured...');
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
       } else if (err.message === 'Bad Request') {
         return Promise.reject('User Project Not Found');
       } else {
         return Promise.reject('Something occured...');
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
                display: block;
              }

              svg {
                display: table;
                margin: auto;
                width: ${this._zoomScale}%;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project')) {
  document.registerElement('pw-project', PwProject);
}
