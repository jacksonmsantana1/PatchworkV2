import Request from 'superagent';
import Page from 'page';
import Token from '../../../lib/Token/Token';
import H from '../../../lib/Helper/Helper';
import './pw-block/pw-block';

/* eslint new-cap:0 */
export default class PwProjectBlocks extends HTMLElement {
  static get observedAttributes() {
    return ['session', 'max-columns', 'max-rows'];
  }

  createdCallback() {
    // Initializing attributes
    this._session = this.getAttribute('session') || '';
    this._maxColumns = this.getAttribute('max-columns') || '';
    this._maxRows = this.getAttribute('max-rows') || '';
    this._blocks = [];

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });

    this.addEventListener('change-svg-image', this.onChangeSvgImage.bind(this), false);

    this.getOldProject(Token.getPayload().get().email, this.session)
      .then((res) => {
        this._blocks = this._blocks.concat(res.body.svg);

        this.render();
        this.addListenersToPolygons();

        Token.setToken(res.req.header.Authorization);
      })
      .catch(() => {
        // Render initial Block Builder
        this.render();
      });

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  onChangeSvgImage(evt) {
    // Send a event to the block <change-block-image>
    const pwBlock = this.getBlock(evt.detail.row, evt.detail.column).get();
    H.emitEvent(true, true, evt.detail, 'change-block-image', pwBlock);
    evt.stopPropagation();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  getBlocks() {
    return H.getShadowRoot(this)
      .chain(H.childNodes);
  }

  getBlock(row, column) {
    return this.getBlocks()
      .map(nodes =>
        Array.prototype.slice.call(nodes)
          .filter(node => (node &&
              node.tagName === 'PW-BLOCK' &&
                node.getAttribute('row') === row &&
                node.getAttribute('column') === column)))
      .chain(H.nth(0));
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

  get maxRows() {
    return this._maxRows;
  }

  get maxColumns() {
    return this._maxColumns;
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
    /* eslint quotes:0 class-methods-use-this:0 */
   // return `${this._blocks.map(block =>
    // `<div class="col4">${this.projectToSVG(block)}</div>`).join('')}`;
    return `${this._blocks.map(block =>
      `<pw-block column="${block.column}" row="${block.row}">${this.projectToSVG(block)}</pw-block>`).join('')}`;
  }

  get style() {
    return `<style>
            pw-block {
              z-index:10;
            }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project-blocks')) {
  document.registerElement('pw-project-blocks', PwProjectBlocks);
}
