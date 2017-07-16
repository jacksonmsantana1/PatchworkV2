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
    this._maxColumns = this.getAttribute('maxcolumns') || '';
    this._maxRows = this.getAttribute('maxrows') || '';
    this._blocks = [];

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });

    this.addEventListener('change-svg-image', this.onChangeSvgImage.bind(this), false);
    this.addEventListener('change-svg-block', this.onChangeSvgBlock.bind(this), false);
    this.addEventListener('rotate-block-down', this.onRotateBlock.bind(this), false);

    if (this.session) {
      this.getOldProject(Token.getPayload().get().email, this.session)
        .then((res) => {
          this._blocks = this._blocks.concat(res.body.svg);
          this.render();

          Token.setToken(res.req.header.Authorization);
        }, (err) => {
          if (err === 'Project Not Found') {
            return this.saveNewProject();
          }
        })
        .then((res) => {
          Token.setToken(res.req.header.Authorization);
          console.log('New Project Saved');
        });
    }

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  detachedCallback() {
    const token = Token.getToken().get();
    const retVal = confirm("Do you want to save this project ?");

    if (retVal !== true) {
      this.removeProject(token);
    }
  }

  getNextBlockCoord() {
    const coord = {};

    if (this._blocks.length) {
      this._blocks.map((block) => {
        if (block.column === parseInt(this.maxColumns, 10)) {
          coord.nextBlockColumn = 1;
          coord.nextBlockRow = block.row + 1;
        } else {
          coord.nextBlockColumn = block.column + 1;
          coord.nextBlockRow = block.row;
        }
      });
    } else {
      coord.nextBlockColumn = 1;
      coord.nextBlockRow = 1;
    }

    return coord;
  }

  updateNewBlock(block, nextBlockRow, nextBlockColumn) {
    const newBlock = Object.assign({}, block);

    newBlock.row = nextBlockRow;
    newBlock.column = nextBlockColumn;

    newBlock.patterns = block.patterns.map((pattern, index) => {
      const newPattern = Object.assign({}, pattern);
      newPattern.id = `img_${nextBlockRow}_${nextBlockColumn}_${index + 1}`;
      return newPattern;
    });

    newBlock.polygons = block.polygons.map((polygon, index) => {
      const newPolygon = Object.assign({}, polygon);
      newPolygon.id = `img_${nextBlockRow}_${nextBlockColumn}_${index + 1}`;
      return newPolygon;
    });

    return newBlock;
  }

  onRotateBlock(evt) {
    const row = evt.detail.row;
    const column = evt.detail.column;
    const rotate = this.updateSvgObjectRotate(row, column, 90);

    this.getBlock(row, column)
      .chain(H.props('svg'))
      .chain((svg) => {
        svg.get().setAttribute('transform', `rotate(${rotate})`);
      });

    this.saveProjectSvg().then((res) => {
      console.log('Project Updated');
      // this.render();
      Token.setToken(res.req.header.Authorization);
    });

    evt.stopPropagation();
  }

  onChangeSvgBlock(evt) {
    const { nextBlockRow, nextBlockColumn } = this.getNextBlockCoord();
    const newBlock = this.updateNewBlock(evt.detail.svg, nextBlockRow, nextBlockColumn);

    this._blocks.push(newBlock);

    this.saveProjectSvg().then((res) => {
      console.log('Project Updated');
      this.render();
      Token.setToken(res.req.header.Authorization);
    });

    evt.stopPropagation();
  }

  onChangeSvgImage(evt) {
    // Send a event to the block <change-block-image>
    const pwBlock = this.getBlock(evt.detail.row, evt.detail.column).get();
    const id = evt.detail.id;
    const image = evt.detail.image;
    const row = evt.detail.row;
    const column = evt.detail.column;

    this.updateSvgObject(row, column, id, image);
    this.saveProjectSvg().then((res) => {
      console.log('Project Updated');
      H.emitEvent(true, true, evt.detail, 'change-block-image', pwBlock);
      Token.setToken(res.req.header.Authorization);
    });

    evt.stopPropagation();
  }

  removeProject(token) {
    return Request.delete(`http://localhost:3000/user/projects/${this.session}`)
     .set('Authorization', token)
     .set('Content-Type', 'application/json')
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          Page('/#/login');
        }

        return Promise.reject(err);
      });
  }

  saveProjectSvg() {
    const email = Token.getPayload().get().email;
    const sessionId = this.session;

    return Request.put(`http://localhost:3000/user/${email}/projects/${sessionId}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json')
     .send({ svg: this._blocks })
     .catch((err) => {
       /* eslint consistent-return:0 */
       if (err.message === 'Unauthorized') {
         Page('/#/login');
       } else if (err.message === 'Bad Request') {
         return Promise.reject('Project Not Updated');
       } else {
         return Promise.reject('Something occured...');
       }
     });
  }


  updateSvgObject(row, column, id, image) {
    /* eslint array-callback-return:0 */
    const _blocks = [...this._blocks];
    _blocks.map((block) => {
      if (block.column === parseInt(column, 10) && block.row === parseInt(row, 10)) {
        block.patterns.map((pattern) => {
          if (pattern.id === id) {
            pattern.image.href = image; /* eslint no-param-reassign:0 */
          }
        });
      }
    });

    this._blocks = _blocks;
  }

  updateSvgObjectRotate(row, column, rotate) {
    let result;

    this._blocks.map((block) => {
      if (block.column === parseInt(column, 10) && block.row === parseInt(row, 10)) {
        if (block.rotate) {
          block.rotate += rotate;
        } else {
          block.rotate = rotate;
        }

        result = block.rotate;
      }
    });

    return result;
  }

  saveNewProject() {
    return Request.post(`http://localhost:3000/user/save/project`)
      .set('Authorization', Token.getToken().get())
      .set('Content-Type', 'application/json')
      .send({
        projectId: '//TODO see hoe to do thisBlock-Builder',
        sessionId: this.session,
        name: '//TODO See how to do this',
        svg: [],
      })
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          Page('/#/login');
        } else if (err.message === 'Bad Request') {
          return Promise.reject('Project Not Saved');
        } else {
          return Promise.reject('Something occured...');
        }
      });
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
       } else if (err.message === 'Bad Request') {
         return Promise.reject('Project Not Found');
       } else {
         return Promise.reject('Something occured...');
       }
     });
  }

  projectToSVG(project) {
    return `<svg width="${project.width}" height="${project.height}" viewBox="${project.viewBox}" transform="rotate(${project.rotate})" xmlns="http://www.w3.org/2000/svg">
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

  set maxRows(value) {
    this._maxRows = value;
    this.setAttribute('maxRows', value);
  }

  get maxColumns() {
    return this._maxColumns;
  }

  set maxColumns(value) {
    this._maxColumns = value;
    this.setAttribute('maxColumns', value);
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
