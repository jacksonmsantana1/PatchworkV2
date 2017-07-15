import H from '../../../../lib/Helper/Helper';

export default class PwBlock extends HTMLElement {
  static get observedAttributes() {
    return ['column', 'row'];
  }

  createdCallback() {
    // Initializing attributes
    this._column = this.getAttribute('column') || '';
    this._row = this.getAttribute('row') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    // Event Listeners
    this.addListenersToPolygons();
    this.addEventListener('change-block-image', this.onChangeBlockImage.bind(this), false);
    this.addEventListener('mouseover', this.onMouseOver.bind(this), false);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  onMouseOver(evt) {
    const detail = {
      row: this._row,
      column: this._column,
      x: this.offsetLeft.get(),
      y: this.offsetTop.get(),
    };

    H.emitEvent(true, true, detail, 'show-change-buttons', this);

    evt.stopPropagation();
  }

  onChangeBlockImage(evt) {
    const id = evt.detail.id;
    const image = evt.detail.image;

    if (this._row === evt.detail.row && this._column === evt.detail.column) {
      this.setSvgPatternImage(id, image);
    }

    evt.stopPropagation();
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

  addListenersToPolygons() {
    /* eslint array-callback-return:0 */
    this.svg.map((elem) => {
      const row = this._row;
      const column = this._column;

      elem.addEventListener('click', function clicked(evt) {
        if (evt.target !== evt.currentTarget) {
          const detail = {
            id: evt.target.id,
            row,
            column,
          };

          H.emitEvent(true, true, detail, 'show-fabrics', this);
        }

        evt.stopPropagation();
      });
    });
  }

  get svg() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('slot'))
      .chain(H.assignedNodes)
      .chain(H.nth(0));
  }

  get offsetTop() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.props('offsetTop'));
  }

  get offsetLeft() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1))
      .chain(H.props('offsetLeft'));
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get row() {
    return this._maxRows;
  }

  set row(value) {
    this._row = value;
    this.setAttribute('row', value);
    this.render();
  }

  get column() {
    return this._maxColumns;
  }

  set column(value) {
    this._column = value;
    this.setAttribute('column', value);
    this.render();
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
    return `<div class="col4">
              <slot></slot>
            </div>`;
  }

  get style() {
    return `<style>
              .col4 {
                width: 33%;
                float: left;
                display: inline;
              }

              slot::slotted(svg) {
                display:inline;
                width: 100%;
                max-width: 560;
                height: 100%;
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-block')) {
  document.registerElement('pw-block', PwBlock);
}
