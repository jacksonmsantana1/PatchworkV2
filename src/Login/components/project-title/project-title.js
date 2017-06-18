export default class ProjectTitle extends HTMLElement {
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

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<div class="type">
              <span><slot></slot></span>
            </div>`;
  }

  get style() {
    return `<style>
              .type span {
                display:block;
              }

              .type {
                margin:50px auto;
                text-align: center;
                color: #F5C4B6;
                line-height:0.85;
                font-family: Tahoma, Geneva, sans-serif;
                font-weight: bold;
              }

              .type span:nth-child(1) {
                font-size: 150px;
              }
      </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('project-title')) {
  document.registerElement('project-title', ProjectTitle);
}
