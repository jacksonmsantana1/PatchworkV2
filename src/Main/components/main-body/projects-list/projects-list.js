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
              @font-face{
                font-family:'Calluna';
                src:url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/callunasansregular-webfont.woff') format('woff');
              }

              body {
                background: url(//subtlepatterns.com/patterns/scribble_light.png);
                font-family: Calluna, Arial, sans-serif;
                min-height: 1000px;
              }

              #columns {
                column-width: 320px;
                column-gap: 15px;
              }

              div#columns figure {
                background: #fefefe;
                border: 2px solid #fcfcfc;
                box-shadow: 0 1px 2px rgba(34, 25, 25, 0.4);
                margin: 0 2px 15px;
                padding: 15px;
                padding-bottom: 10px;
                transition: opacity .4s ease-in-out;
                display: inline-block;
                column-break-inside: avoid;
              }

              div#columns figure img {
                width: 100%; height: auto;
                border-bottom: 1px solid #ccc;
                padding-bottom: 15px;
                margin-bottom: 5px;
              }

              div#columns figure figcaption {
                font-size: .9rem;
                color: #444;
                line-height: 1.5;
              }

              div#columns small {
                font-size: 1rem;
                float: right;
                text-transform: uppercase;
                color: #aaa;
              }

              div#columns small a {
                color: #666;
                text-decoration: none;
                transition: .4s color;
              }

              div#columns:hover figure:not(:hover) {
                opacity: 0.4;
              }

              @media screen and (max-width: 750px) {
                #columns { column-gap: 0px; }
                #columns figure { width: 100%; }
                div#columns figure {
                  padding: 0.25em;
                }
              }
            </style>`;
  }

  get html() {
    return `<div id="columns">
              <figure>
                <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/cinderella.jpg">
                <figcaption>Cinderella wearing European fashion of the mid-1860’s</figcaption>
              </figure>

              <figure>
                <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/rapunzel.jpg">
                <figcaption>Rapunzel, clothed in 1820’s period fashion</figcaption>
              </figure>

              <figure>
                <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/belle.jpg">
                <figcaption>Belle, based on 1770’s French court fashion</figcaption>
              </figure>

              <figure>
                <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/mulan_2.jpg">
                <figcaption>Mulan, based on the Ming Dynasty period</figcaption>
              </figure>

              <figure>
                <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/sleeping-beauty.jpg">
                <figcaption>Sleeping Beauty, based on European fashions in 1485</figcaption>
              </figure>

              <figure>
                <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/pocahontas_2.jpg">
                <figcaption>Pocahontas based on 17th century Powhatan costume</figcaption>
              </figure>

              <figure>
                <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/snow-white.jpg">
                <figcaption>Snow White, based on 16th century German fashion</figcaption>
              </figure>

              <figure>
                <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/ariel.jpg">
                <figcaption>Ariel wearing an evening gown of the 1890’s</figcaption>
              </figure>

              <figure>
                <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/tiana.jpg">
                <figcaption>Tiana wearing the <i>robe de style</i> of the 1920’s</figcaption>
              </figure>
            </div>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('projects-list')) {
  document.registerElement('projects-list', ProjectsList);
}