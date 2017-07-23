import Request from 'superagent';
import Page from 'page';
import L from 'lodash';
import Token from '../../../lib/Token/Token';
import H from '../../../lib/Helper/Helper';
import './pw-block/pw-block';

const MAX_ZOOM = 100;
const MIN_ZOOM = 50;

/* eslint new-cap:0 array-callback-return:0 */
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
    this._zoomScale = 100;

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });

    this.addEventListener('change-svg-image', this.onChangeSvgImage.bind(this), false);
    this.addEventListener('add-svg-block', this.onAddSvgBlock.bind(this), false);
    this.addEventListener('change-svg-block', this.onChangeSvgBlock.bind(this), false);
    this.addEventListener('rotate-block-down', this.onRotateBlock.bind(this), false);
    this.addEventListener('remove-block-down', this.onRemoveBlock.bind(this), false);
    this.addEventListener('zoom-in-down', this.onZoomIn.bind(this), false);
    this.addEventListener('zoom-out-down', this.onZoomOut.bind(this), false);
    this.addEventListener('save-project', this.onSaveProject.bind(this), false);
    this.addEventListener('remove-project', this.onRemoveProject.bind(this), false);

    if (this.session) {
      this.getOldProject(Token.getPayload().get().email, this.session)
        .then((res) => {
          this._blocks = this._blocks.concat(res.body.svg);
          if (!this._blocks.length) {
            H.emitEvent(true, true, '', 'show-initial-image', this);
          }
          this.render();

          Token.setToken(res.req.header.Authorization);
        }, (err) => {
          if (err === 'Project Not Found') {
            H.emitEvent(true, true, '', 'show-initial-image', this);
            return this.saveNewProject();
          }
        })
        .then((res) => {
          if (res) {
            Token.setToken(res.req.header.Authorization);
            console.log('New Project Saved');
          }
        });
    }

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  onSaveProject(evt) {
    this.saveProjectSvg().then((res) => {
      if (res) {
        console.log('Project Saved');
        Token.setToken(res.req.header.Authorization);
      }
    });

    evt.stopPropagation();
  }

  onRemoveProject(evt) {
    this.removeProject().then((res) => {
      if (res) {
        console.log('Project Removed');
        Token.setToken(res.req.header.Authorization);
      }
    });

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

  detachedCallback() {
    /* const token = Token.getToken().get();
    const retVal = confirm("Do you want to save this project ?");

    if (retVal !== true) {
      this.removeProject(token);
    } */
  }

  // FIXME
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

  updateSvgObjectImage(row, column, id, image) {
    const index = this.getIndexBlockObject(row, column);
    const block = this._blocks[index];
    const newBlock = L.cloneDeep(block);

    newBlock.patterns.forEach((pattern, i, arr) => {
      if (pattern.id === id) {
        arr[i].image.href = image; /* eslint no-param-reassign:0 */
      }
    });

    return newBlock;
  }

  updateNewBlock(block, nextBlockRow, nextBlockColumn) {
    const newBlock = L.cloneDeep(block);

    newBlock.row = nextBlockRow;
    newBlock.column = nextBlockColumn;
    newBlock.rotate = newBlock.rotate || 0;

    newBlock.patterns.forEach((pattern, index, arr) => {
      arr[index].id = `img_${nextBlockRow}_${nextBlockColumn}_${index + 1}`;
    });

    newBlock.polygons.map((polygon, index, arr) => {
      arr[index].id = `img_${nextBlockRow}_${nextBlockColumn}_${index + 1}`;
    });

    return newBlock;
  }

  updateSvgObjectRotate(row, column, rotate) {
    let result;

    this._blocks.map((block) => {
      if (block.column === column && block.row === row) {
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

  updateSvgObjectRemove(row, column, index) {
    let _row = 1;
    let _column = 0;

    this._blocks.splice(index, 1);
    this._blocks = this._blocks.map((block) => {
      if (_column === parseInt(this.maxColumns, 10)) {
        _column = 1;
        _row += 1;
        return this.updateNewBlock(block, _row, _column);
      }

      _column += 1;
      return this.updateNewBlock(block, _row, _column);
    });
  }

  onRemoveBlock(evt) {
    const row = parseInt(evt.detail.row, 10);
    const column = parseInt(evt.detail.column, 10);
    const index = this.getIndexBlockObject(row, column);

    this.updateSvgObjectRemove(row, column, index);
    this.saveProjectSvg().then((res) => {
      console.log('Project Updated');
      this.render();
      Token.setToken(res.req.header.Authorization);
    });

    if (!this._blocks.length) {
      H.emitEvent(true, true, '', 'show-initial-image', this);
    }

    evt.stopPropagation();
  }

  onRotateBlock(evt) {
    const row = parseInt(evt.detail.row, 10);
    const column = parseInt(evt.detail.column, 10);
    const rotate = this.updateSvgObjectRotate(row, column, 90);

    this.getBlock(row, column)
      .chain(H.props('svg'))
      .chain((svg) => {
        svg.get().setAttribute('transform', `rotate(${rotate})`);
      });

    this.saveProjectSvg().then((res) => {
      console.log('Project Updated');
      this.render();
      Token.setToken(res.req.header.Authorization);
    });

    evt.stopPropagation();
  }

  onChangeSvgBlock(evt) {
    const row = parseInt(evt.detail.row, 10);
    const column = parseInt(evt.detail.column, 10);
    const blockSvg = evt.detail.block.svg;
    const index = this.getIndexBlockObject(row, column);
    const newBlock = this.updateNewBlock(blockSvg, row, column);

    this.saveProjectSvg().then((res) => {
      console.log('Project Updated');
      this._blocks.splice(index, 1, newBlock);
      this.render();
      Token.setToken(res.req.header.Authorization);
    });

    evt.stopPropagation();
  }

  onAddSvgBlock(evt) {
    const { nextBlockRow, nextBlockColumn } = this.getNextBlockCoord();
    const newBlock = this.updateNewBlock(evt.detail.svg, nextBlockRow, nextBlockColumn);

    this._blocks.push(newBlock);

    this.saveProjectSvg().then((res) => {
      console.log('Project Updated');
      this.render();
      Token.setToken(res.req.header.Authorization);
    });

    H.emitEvent(true, true, '', 'hide-initial-image', this);
    evt.stopPropagation();
  }

  onChangeSvgImage(evt) {
    // Send a event to the block <change-block-image>
    const pwBlock = this.getBlock(evt.detail.row, evt.detail.column).get();
    const id = evt.detail.id;
    const image = evt.detail.image;
    const row = parseInt(evt.detail.row, 10);
    const column = parseInt(evt.detail.column, 10);
    const index = this.getIndexBlockObject(row, column);
    const newBlock = this.updateSvgObjectImage(row, column, id, image);

    this._blocks.splice(index, 1, newBlock);
    this.saveProjectSvg().then((res) => {
      console.log('Project Updated');
      H.emitEvent(true, true, evt.detail, 'change-block-image', pwBlock);
      Token.setToken(res.req.header.Authorization);
    });

    evt.stopPropagation();
  }

  removeProject() {
    return Request.delete(`http://localhost:3000/user/projects/${this.session}`)
     .set('Authorization', Token.getToken().get())
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

  getIndexBlockObject(row, column) {
    let result = 1;

    this._blocks.map((block, index) => {
      if (block.row === row && block.column === column) {
        result = index;
      }
    });

    return result;
  }

  getBlocks() {
    return H.getShadowRoot(this)
      .chain(H.childNodes);
  }

  getBlock(row, column) {
    return this.getBlocks()
      .chain(H.nth(1))
      .chain(H.childNodes)
      .map(nodes => Array.prototype.slice.call(nodes)
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
    return `<div class="wrapper">${this._blocks.map(block =>
      `<pw-block column="${block.column}" row="${block.row}">${this.projectToSVG(block)}</pw-block>`).join('')}</div>`;
  }

  get style() {
    return `<style>
            .wrapper {
              display: block;
              width: ${this._zoomScale}%;
              margin:auto;
            }

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
