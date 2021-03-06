import H from '../../lib/Helper/Helper';
import Measurement from '../../lib/Measurement/Measurement';
import './pw-add-block-button/pw-add-block-button';
import './pw-blocks-list/pw-blocks-list';
import './pw-project-blocks/pw-project-blocks';
import './pw-change-block-buttons/pw-change-block-buttons';
import './pw-zoom-buttons/pw-zoom-buttons'; // Should Be Central component
import './pw-initial-image/pw-initial-image';
import './pw-helper-buttons/pw-helper-buttons'; // Should be Central component
import '../../components/pw-measurements-modal/pw-measurements-modal';
import './pw-helper-buttons/pw-add-column-button/pw-add-column-button'; // Should be Central component
import './pw-helper-buttons/pw-remove-column-button/pw-remove-column-button'; // Should be Central component
import './pw-helper-buttons/pw-show-measurements-button/pw-show-measurements-button'; // Should be Central component
import './pw-helper-buttons/pw-show-layout-button/pw-show-layout-button'; // Should be Central component

export default class PwBlockBuilderBody extends HTMLElement {
  static get observedAttributes() {
    return ['session'];
  }

  createdCallback() {
    // Initializing attributes
    this._session = this.getAttribute('session') || '';
    this._lastChange = {};

    // FIXME
    this._blockToBeChanged = {};
    this._isToChangeBlock = false;

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    // Event Listeners
    this.addEventListener('show-blocks', this.onShowBlocks.bind(this), false);
    this.addEventListener('show-fabrics', this.onShowFabrics.bind(this), false);
    this.addEventListener('svg-image-choosed', this.onSvgImageChoosed.bind(this), false);
    this.addEventListener('svg-block-choosed', this.onSvgBlockChoosed.bind(this), false);
    this.addEventListener('click', this.onClick.bind(this), false);
    this.addEventListener('show-change-buttons', this.onShowChangeButtons.bind(this), false);
    this.addEventListener('hide-change-buttons', this.onHideChangeButtons.bind(this), false);
    this.addEventListener('rotate-block-up', this.onRotateBlockUp.bind(this), false);
    this.addEventListener('change-block-up', this.onChangeBlockUp.bind(this), false);
    this.addEventListener('remove-block-up', this.onRemoveBlockUp.bind(this), false);
    this.addEventListener('zoom-in-block-up', this.onZoomInUp.bind(this), false);
    this.addEventListener('zoom-out-block-up', this.onZoomOutUp.bind(this), false);
    this.addEventListener('show-initial-image', this.onShowInitialImage.bind(this), false);
    this.addEventListener('hide-initial-image', this.onHideInitialImage.bind(this), false);
    this.addEventListener('save-project', this.onSaveProject.bind(this), false);
    this.addEventListener('remove-project', this.onRemoveProject.bind(this), false);
    this.addEventListener('add-column-up', this.onAddColumnUp.bind(this), false);
    this.addEventListener('remove-column-up', this.onRemoveColumnUp.bind(this), false);
    this.addEventListener('show-measurements-modal-up', this.onShowMeasurementsModalUp.bind(this), false);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this[name] !== newVal) {
      this[name] = newVal;
    }
  }

  onShowMeasurementsModalUp(evt) {
    const blocks = this.getPwProjectBlocks().get()._blocks; // TODO Think a better way
    const detail = Measurement.groupMeasurements(blocks);

    this.getPwMeasurementsModal().map((pwMeasurementsModal) => {
      H.emitEvent(true, true, detail, 'show-measurements-modal-down', pwMeasurementsModal);
    });

    evt.stopPropagation();
  }

  onRemoveColumnUp(evt) {
    this.getPwProjectBlocks().map((pwProjectBlocks) => {
      H.emitEvent(true, true, '', 'remove-column-down', pwProjectBlocks);
    });

    evt.stopPropagation();
  }

  onAddColumnUp(evt) {
    this.getPwProjectBlocks().map((pwProjectBlocks) => {
      H.emitEvent(true, true, '', 'add-column-down', pwProjectBlocks);
    });

    evt.stopPropagation();
  }

  onRemoveProject(evt) {
    const detail = evt.detail;

    this.getPwProjectBlocks().map((pwProjectBlocks) => {
      H.emitEvent(true, true, detail, 'remove-project', pwProjectBlocks);
    });

    evt.stopPropagation();
  }

  onSaveProject(evt) {
    const detail = evt.detail;

    this.getPwProjectBlocks().map((pwProjectBlocks) => {
      H.emitEvent(true, true, detail, 'save-project', pwProjectBlocks);
    });

    evt.stopPropagation();
  }

  onHideInitialImage(evt) {
    this.getPwInitialImage().map((pwInitialImage) => {
      pwInitialImage.visible = '';
    });

    evt.stopPropagation();
  }

  onShowInitialImage(evt) {
    this.getPwInitialImage().map((pwInitialImage) => {
      pwInitialImage.visible = 'true';
    });

    evt.stopPropagation();
  }

  onZoomOutUp(evt) {
    const detail = evt.detail;

    this.getPwProjectBlocks().map((pwProjectBlocks) => {
      H.emitEvent(true, true, detail, 'zoom-out-down', pwProjectBlocks);
    });

    evt.stopPropagation();
  }

  onZoomInUp(evt) {
    const detail = evt.detail;

    this.getPwProjectBlocks().map((pwProjectBlocks) => {
      H.emitEvent(true, true, detail, 'zoom-in-down', pwProjectBlocks);
    });

    evt.stopPropagation();
  }

  onRemoveBlockUp(evt) {
    const detail = evt.detail;

    this.getPwProjectBlocks().map((pwProjectBlocks) => {
      H.emitEvent(true, true, detail, 'remove-block-down', pwProjectBlocks);
    });

    evt.stopPropagation();
  }

  onChangeBlockUp(evt) {
    this._isToChangeBlock = true;
    this._blockToBeChanged = evt.detail;

    this.getPwBlockList().map((list) => {
      if (!list.visible) {
        /* eslint no-param-reassign:0 */
        list.visible = 'true';
      }
    });

    evt.stopPropagation();
  }

  onRotateBlockUp(evt) {
    const detail = evt.detail;

    this.getPwProjectBlocks().map((pwProjectBlocks) => {
      H.emitEvent(true, true, detail, 'rotate-block-down', pwProjectBlocks);
    });

    evt.stopPropagation();
  }

  onShowChangeButtons(evt) {
    const detail = evt.detail;

    this.getPwChangeBlockButtons()
      .chain((elem) => {
        elem.row = detail.row;
        elem.column = detail.column;
        elem.x = detail.x;
        elem.y = detail.y;
        elem.visible = 'true';
      });

    evt.stopPropagation();
  }

  onHideChangeButtons(evt) {
    this.getPwChangeBlockButtons()
      .chain((elem) => {
        elem.visible = '';
      });

    evt.stopPropagation();
  }

  onShowBlocks(evt) {
    this._isToChangeBlock = false;

    this.getPwBlockList().map((list) => {
      if (!list.visible) {
        /* eslint no-param-reassign:0 */
        list.visible = 'true';
      }
    });

    evt.stopPropagation();
  }

  onClick(evt) {
    this.getPwFabricList().map((list) => {
      if (list.visible) {
        /* eslint no-param-reassign:0 */
        list.visible = '';
      }
    });

    this.getPwBlockList().map((list) => {
      if (list.visible) {
        /* eslint no-param-reassign:0 */
        list.visible = '';
      }
    });

    evt.stopPropagation();
  }

  onSvgImageChoosed(evt) {
    /* eslint array-callback-return:0 */
    const detail = {
      id: evt.detail.id,
      image: evt.detail.image,
      row: this._lastChange.row,
      column: this._lastChange.column,
    };

    this.getPwProjectBlocks().map((pwProjectBlocks) => {
      H.emitEvent(true, true, detail, 'change-svg-image', pwProjectBlocks);
    });

    evt.stopPropagation();
  }

  onSvgBlockChoosed(evt) {
    const block = evt.detail[0];

    if (this._isToChangeBlock) {
      const detail = {
        row: this._blockToBeChanged.row,
        column: this._blockToBeChanged.column,
        block,
      };

      this.getPwProjectBlocks().map((pwProjectBlocks) => {
        H.emitEvent(true, true, detail, 'change-svg-block', pwProjectBlocks);
      });
    } else {
      this.getPwProjectBlocks().map((pwProjectBlocks) => {
        H.emitEvent(true, true, block, 'add-svg-block', pwProjectBlocks);
      });
    }

    evt.stopPropagation();
  }

  onShowFabrics(evt) {
    this._lastChange = {
      row: evt.detail.row,
      column: evt.detail.column,
    };

    this.getPwFabricList().map((pwProjectList) => {
      /* eslint array-callback-return:0 */
      H.emitEvent(true, true, evt.detail, 'show-fabrics-down', pwProjectList);
    });

    evt.stopPropagation();
  }

  getPwMeasurementsModal() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-measurements-modal'));
  }

  getPwProjectBlocks() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-project-blocks'));
  }

  getPwFabricList() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-fabrics-list'));
  }

  getPwBlockList() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-blocks-list'));
  }

  getPwChangeBlockButtons() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-change-block-buttons'));
  }

  getPwInitialImage() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-initial-image'));
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
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
    return `<main>
              <pw-project-blocks session="${this.session}" maxRows="3" maxColumns="3"></pw-project-blocks>
              <pw-fabrics-list visible=""></pw-fabrics-list>
              <pw-blocks-list visible=""></pw-blocks-list>
              <pw-add-block-button></pw-add-block-button>
              <pw-zoom-buttons scale="1"></pw-zoom-buttons>
              <pw-helper-buttons>
                <pw-add-column-button active="${this.active ? 'true' : ''}"></pw-add-column-button>
                <pw-remove-column-button active="${this.active ? 'true' : ''}"></pw-remove-column-button>
                <pw-show-measurements-button active="${this.active ? 'true' : ''}"></pw-show-measurements-button>
              </pw-helper-buttons>
              <pw-change-block-buttons row="" column="" x="8" y="94" visible=""></pw-change-block-buttons>
              <pw-initial-image visible="" src="http://localhost:3000/images/add.svg">Start adding your first block</pw-initial-image>
              <pw-measurements-modal visible="true" type="blocks"></pw-measurements-modal>
            </main>`;
  }

  get style() {
    return `<style>
              initial {
                width: 500px;
                height: 500px;
              }

              main {
                background: #f9dae0;
                font-family: "Open Sans", Helvetica Neue, Helvetica, Arial, sans-serif;
                color: #fff;
                padding: 6em 0 6em 0;
                min-height: 500px;
              }

              main .helper {
                background: rgba(0, 0, 0, 0.2);
                color: #d6c5ea;
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate3d(-50%, -50%, 0);
                padding: 1.2em 2em;
                text-align: center;
                border-radius: 20px;
                font-size: 2em;
                font-weight: bold;
                display: inline-block;
              }

             main .helper span {
               color: rgba(0, 0, 0, 0.2);
               font-size: 0.4em;
               display: block;
              }

              pw-project-blocks {
                display: inline-block;
              }


              @media screen and (max-width: 750px) {
                main {
                  padding: 6em;
                }
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-block-builder-body')) {
  document.registerElement('pw-block-builder-body', PwBlockBuilderBody);
}
