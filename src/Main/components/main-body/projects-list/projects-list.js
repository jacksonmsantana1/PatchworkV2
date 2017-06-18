export default class ProjectsList extends HTMLElement {
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
              #wrapper {
                width: 90%;
                max-width: 1100px;
                min-width: 800px;
              }

              #columns {
                -webkit-column-count: 3;
                -webkit-column-gap: 10px;
                -webkit-column-fill: auto;
                -moz-column-count: 3;
                -moz-column-gap: 10px;
                -moz-column-fill: auto;
                column-count: 3;
                column-gap: 15px;
                column-fill: auto;
              }

              .pin {
                display: inline-block;
                background: #FEFEFE;
                border: 2px solid #FAFAFA;
                box-shadow: 0 1px 2px rgba(34, 25, 25, 0.4);
                margin: 0 2px 15px;
                -webkit-column-break-inside: avoid;
                -moz-column-break-inside: avoid;
                column-break-inside: avoid;
                padding: 15px;
                padding-bottom: 5px;
                background: -webkit-linear-gradient(45deg, #FFF, #F9F9F9);
                opacity: 1;
                -webkit-transition: all .2s ease;
                -moz-transition: all .2s ease;
                -o-transition: all .2s ease;
                transition: all .2s ease;
              }

              .pin img {
                width: 100%;
                border-bottom: 1px solid #ccc;
                padding-bottom: 15px;
                margin-bottom: 5px;
              }

              .pin p {
                font: 12px/18px Arial, sans-serif;
                color: #333;
                margin: 0;
              }

              @media (min-width: 960px) {
                #columns {
                  -webkit-column-count: 4;
                  -moz-column-count: 4;
                  column-count: 4;
                }
              }

              @media (min-width: 1100px) {
                #columns {
                  -webkit-column-count: 5;
                  -moz-column-count: 5;
                  column-count: 5;
                }
              }
      </style>`;
  }

  get html() {
    return `
      <div id="wrapper">
        <div id="columns">
          <div class="pin">
            <img src="http://cssdeck.com/uploads/media/items/2/2v3VhAp.png" />
            <p>ANUS</p>
          </div>

          <div class="pin">
            <img src="http://cssdeck.com/uploads/media/items/1/1swi3Qy.png" />
            <p>XOXOTA</p>
          </div>

          <div class="pin">
            <img src="http://cssdeck.com/uploads/media/items/6/6f3nXse.png" />
            <p>ANUS</p>
          </div>

          <div class="pin">
            <img src="http://cssdeck.com/uploads/media/items/8/8kEc1hS.png" />
            <p>CU</p>
          </div>

          <div class="pin">
            <img src="http://cssdeck.com/uploads/media/items/1/1swi3Qy.png" />
            <p>BUCETA</p>
          </div>
        </div>
      </div>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('projects-list')) {
  document.registerElement('projects-list', ProjectsList);
}
