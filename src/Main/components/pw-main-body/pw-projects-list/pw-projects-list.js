export default class PwProjectsList extends HTMLElement {
  createdCallback() {
    // setting the inner dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    if (super.createdcallback) {
      super.createdcallback();
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
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
