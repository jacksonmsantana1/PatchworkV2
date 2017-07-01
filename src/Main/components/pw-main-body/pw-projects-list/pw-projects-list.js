import R from 'ramda';
import H from '../../../../lib/Helper/Helper';

export default class PwProjectsList extends HTMLElement {
  createdCallback() {
    // setting the inner dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    this.addEventListener('project-selected', this.onProjectSelected.bind(this), false);
    this.addEventListener('project-deselected', this.onProjectDeselected.bind(this), false);

    if (super.createdcallback) {
      super.createdcallback();
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  onProjectSelected(evt) {
    const id = evt.detail;

    this.getSlot()
      .chain(H.assignedNodes)
      .map(R.filter(project => H.equals('pw-project-item', project.localName)))
      .map(H.splat(this.setProjectActive(id)));

    evt.stopPropagation();
  }

  onProjectDeselected(evt) {
    const id = evt.detail;

    this.getSlot()
      .chain(H.assignedNodes)
      .map(R.filter(project => H.equals('pw-project-item', project.localName)))
      .map(H.splat(this.setAllProjectsActive(id)));

    evt.stopPropagation();
  }

  setProjectActive(id) {
    return (project) => {
      if (project.id !== id) {
        H.changeProps('active', '', project);
      } else {
        H.changeProps('active', 'true', project);
      }
    };
  }

  setAllProjectsActive(id) {
    return (project) => {
      if (project.id !== id) {
        H.changeProps('active', 'true', project);
      }
    };
  }

  getSlot() {
    return H.getShadowRoot(this)
      .chain(H.querySelector('slot'));
  }

  get style() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<style>
              @font-face{
                font-family:'Calluna';
                src:url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/callunasansregular-webfont.woff') format('woff');
              }

              #columns {
                column-width: 320px;
                column-gap: 15px;
              }

              div#columns:hover div#columns::slotted(pw-project-item):not(:hover) {
                opacity: 0.4;
              }

              @media screen and (max-width: 750px) {
                #columns { column-gap: 0px; }
              }
            </style>`;
  }

  get html() {
    return `<div id="columns">
              <slot></slot>
            </div>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-projects-list')) {
  document.registerElement('pw-projects-list', PwProjectsList);
}
