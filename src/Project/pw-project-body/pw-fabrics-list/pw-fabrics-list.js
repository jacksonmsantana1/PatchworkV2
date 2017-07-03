import H from '../../../lib/Helper/Helper';

export default class PwFabricsList extends HTMLElement {
  static get observedAttributes() {
    return ['visible'];
  }

  createdCallback() {
    // Initilizing attributes
    this._visible = this.getAttribute('visible') || '';

    // setting the inner dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();
    this.hideList();

    this.addListenersToFabrics();
    this.addEventListener('show-fabrics-down', this.onShowFabrics.bind(this), false);

    if (super.createdcallback) {
      super.createdcallback();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  onShowFabrics(evt) {
    this._id = evt.detail;
    this.showList();
    evt.stopPropagation();
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  showList() {
    this.list
      .chain(H.props('style'))
      .chain(H.changeProps('display', 'block'));
  }

  hideList() {
    this.list
      .chain(H.props('style'))
      .chain(H.changeProps('display', 'none'));
  }

  addListenersToFabrics() {
    /* eslint array-callback-return:0 */
    this.list.map((node) => {
      node.addEventListener('click', this.onClick.bind(this), false);
    });
  }

  onClick(evt) {
    const detail = {
      id: this._id,
      image: evt.target.src,
    };

    this.hideList();
    H.emitEvent(true, true, detail, 'svg-image-choosed', this);
    evt.stopPropagation();
  }

  getFabrics() {
    return this.list
      .chain(H.firstElementChild)
      .chain(H.firstElementChild)
      .chain(H.childNodes)
      .map(nodes =>
        Array.prototype.slice.call(nodes).filter(node => (node && node.tagName === 'DIV')));
  }

  get list() {
    return H.getShadowRoot(this)
      .chain(H.childNodes)
      .chain(H.nth(1));
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    this._visible = value;
    this.setAttribute('visible', value);

    if (!value) {
      this.hideList();
    } else {
      this.showList();
    }
  }

  get style() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<style>
              .page-scroll {
                 position: fixed;
                 bottom: 0;
                 width:96.5%;
               }

               .gallery {
                float: left;
                width: 100%;
                padding: 1em;
               }

              .slides {
                display: flex;
                flex-direction: row;
                padding: 32px;
                overflow: auto;
                position: relative;
                background: gray;
                border-radius: 10px;
              }

              .gallery .slides .slide {
                margin: 0 16px;
                transition: .3s;
                cursor: pointer;
                border-radius: 3px;
              }

              .gallery .slides .slide img {
                border-radius: 3px;
                display: block;
                height: 100%;
                width: auto;
              }

              .gallery .slides .slide:hover {
                box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                transform: scale(1.04);
              }

              @media screen and (max-width: 750px) {
                .slides .slide {
                  height: 90px;
                }
              }
            </style>`;
  }

  get html() {
    return `<div class="page-scroll">
              <div class="gallery">
                <div class="slides">
                  <div class='slide z-depth-1 hoverable'><img src="http://placehold.it/320x180/3F51B5/FFC107"/></div>
                  <div class='slide z-depth-1 hoverable'><img src="http://placehold.it/320x180/3F51B5/FFC107"/></div>
                  <div class='slide z-depth-1 hoverable'><img src="http://placehold.it/320x180/3F51B5/FFC107"/></div>
                  <div class='slide z-depth-1 hoverable'><img src="http://placehold.it/320x180/3F51B5/FFC107"/></div>
                  <div class='slide z-depth-1 hoverable'><img src="http://placehold.it/320x180/3F51B5/FFC107"/></div>
                  <div class='slide z-depth-1 hoverable'><img src="http://placehold.it/320x180/3F51B5/FFC107"/></div>
                </div>
              </div>
            </div>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-fabrics-list')) {
  document.registerElement('pw-fabrics-list', PwFabricsList);
}
