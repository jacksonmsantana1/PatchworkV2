import Task from 'data.task';
import Page from 'page';
import Request from 'superagent';
import H from '../../../lib/Helper/Helper';
import Token from '../../../lib/Token/Token';

export default class PwProject extends HTMLElement {
  static get observedAttributes() {
    return ['id'];
  }

  createdCallback() {
    // Initializing attributes
    this._id = this.getAttribute('id') || '';
    this._svg = {};

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.getProject().fork(err => console.log(err.message), (proj) => {
      this._svg = proj.svg;
      this.render();
      this.addListenersToPolygons();
    });

    this.addEventListener('change-svg-image', this.onChangeSvgImage.bind(this), false);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  onChangeSvgImage(evt) {
    const id = evt.detail.id;
    const image = evt.detail.image;

    this.setSvgPatternImage(id, image);
    evt.stopPropagation();
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  getProject() {
    return new Task((reject, resolve) => Request.get(`http://localhost:3000/projects/${this.id}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json')
        .then((res) => {
          if (res) {
            Token.setToken(res.req.header.Authorization);
            return resolve(res.body);
          }

          return reject('Body was empty');
        })
        .catch((err) => {
          console.log(err.message);
          Page('/#/login'); /* eslint new-cap:0 */
        }));
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
    this.render();
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
