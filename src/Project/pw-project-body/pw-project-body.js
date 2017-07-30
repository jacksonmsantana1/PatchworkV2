import H from '../../lib/Helper/Helper';
import Measurement from '../../lib/Measurement/Measurement';
import './pw-project/pw-project';
import './pw-fabrics-list/pw-fabrics-list';

export default class PwProjectBody extends HTMLElement {
  static get observedAttributes() {
    return ['id', 'session'];
  }

  createdCallback() {
    // Initializing attributes
    this._id = this.getAttribute('id') || '';
    this._session = this.getAttribute('session') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    this.addEventListener('svg-image-choosed', this.onSvgImageChoosed.bind(this), false);
    this.addEventListener('show-fabrics', this.onShowFabrics.bind(this), false);
    this.addEventListener('click', this.onClick.bind(this), false);
    this.addEventListener('zoom-in-block-up', this.onZoomInUp.bind(this), false);
    this.addEventListener('zoom-out-block-up', this.onZoomOutUp.bind(this), false);
    this.addEventListener('save-project', this.onSaveProject.bind(this), false);
    this.addEventListener('remove-project', this.onRemoveProject.bind(this), false);
    this.addEventListener('show-measurements-modal-up', this.onShowMeasurementsModalUp.bind(this), false);
    this.addEventListener('show-layout-modal-up', this.onShowLayoutModalUp.bind(this), false);

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
    const svg = this.getPwProject().get()._svg; // TODO Think a better way
    const detail = Measurement.getProjectMeasurement(svg);

    this.getPwMeasurementsModal().map((pwMeasurementsModal) => {
      H.emitEvent(true, true, detail, 'show-measurements-modal-down', pwMeasurementsModal);
    });

    evt.stopPropagation();
  }

  onShowLayoutModalUp() {
    this.getPwProjectModal().map((pwProjectModal) => {
      pwProjectModal.id = this.id;
      pwProjectModal.visible = true;
    });
  }

  onRemoveProject(evt) {
    const detail = evt.detail;

    this.getPwProject().map((pwProject) => {
      H.emitEvent(true, true, detail, 'remove-project', pwProject);
    });

    evt.stopPropagation();
  }

  onSaveProject(evt) {
    const detail = evt.detail;

    this.getPwProject().map((pwProject) => {
      H.emitEvent(true, true, detail, 'save-project', pwProject);
    });

    evt.stopPropagation();
  }

  onClick() {
    this.getPwFabricList().map((list) => {
      if (list.visible) {
        /* eslint no-param-reassign:0 */
        list.visible = '';
      }
    });
  }

  onShowFabrics(evt) {
    const detail = evt.detail;

    this.getPwFabricList().map((pwProjectList) => {
      H.emitEvent(true, true, detail, 'show-fabrics-down', pwProjectList);
    });

    evt.stopPropagation();
  }

  onSvgImageChoosed(evt) {
    /* eslint array-callback-return:0 */
    const detail = evt.detail;

    this.getPwProject().map((pwProject) => {
      H.emitEvent(true, true, detail, 'change-svg-image', pwProject);
    });

    evt.stopPropagation();
  }

  onZoomOutUp(evt) {
    const detail = evt.detail;

    this.getPwProject().map((pwProject) => {
      H.emitEvent(true, true, detail, 'zoom-out-down', pwProject);
    });

    evt.stopPropagation();
  }

  onZoomInUp(evt) {
    const detail = evt.detail;

    this.getPwProject().map((pwProject) => {
      H.emitEvent(true, true, detail, 'zoom-in-down', pwProject);
    });

    evt.stopPropagation();
  }

  getPwMeasurementsModal() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-measurements-modal'));
  }

  getPwProject() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-project'));
  }

  getPwFabricList() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-fabrics-list'));
  }

  getPwProjectModal() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('pw-project-modal'));
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('id', value);
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
    return `<main>
              <pw-project id="${this.id}" session="${this.session}"></pw-project>
              <pw-fabrics-list visible=""></pw-fabrics-list>
              <pw-zoom-buttons scale="10"></pw-zoom-buttons>
              <pw-helper-buttons>
                <pw-show-measurements-button active="${this.active ? 'true' : ''}"></pw-show-measurements-button>
                <pw-show-layout-button active="${this.active ? 'true' : ''}"></pw-show-layout-button>
              </pw-helper-buttons>
              <pw-measurements-modal visible="true" type="project"></pw-measurements-modal>
              <pw-project-modal visible="" buttonvisible=""></pw-project-modal>
            </main>`;
  }

  get style() {
    return `<style>
              main {
                background: #f9dae0;
                font-family: "Open Sans", Helvetica Neue, Helvetica, Arial, sans-serif;
                color: #fff;
                padding: 6em 0 6em 0;
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

              @media screen and (max-width: 750px) {
                main {
                  padding: 6em;
                }
              }
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project-body')) {
  document.registerElement('pw-project-body', PwProjectBody);
}
