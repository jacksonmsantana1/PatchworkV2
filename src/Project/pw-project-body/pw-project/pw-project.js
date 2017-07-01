import Task from 'data.task';
import Page from 'page';
import Token from '../../../lib/Token/Token';

export default class PwProject extends HTMLElement {
  static get observedAttributes() {
    return ['id'];
  }

  createdCallback() {
    // Initializing attributes
    this._id = this.getAttribute('id') || '';

    // Setting the Inner Dom and the styles
    this.attachShadow({ mode: 'open' });
    this.render();

    if (super.createdCallback) {
      super.createdCallback();
    }

    this.svg = {
      width: 1000,
      height: 1000,
      viewBox: '0 0 100 100',
      patterns: [
        {
          id: 'img1',
          width: '100',
          height: '100',
          image: {
            href: 'https://img1.etsystatic.com/164/0/10708234/il_570xN.1207611407_dhao.jpg',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          },
        }, {
          id: 'img2',
          width: '100',
          height: '100',
          image: {
            href: 'https://img1.etsystatic.com/155/0/10708234/il_570xN.1207608269_jzwz.jpg',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          },
        },
      ],
      polygons: [
        {
          id: 'img1',
          points: [[0, 0], [20, 0], [0, 20]],
        }, {
          id: 'img2',
          points: [[20, 0], [20, 20], [0, 20]],
        }, {
          id: 'img2',
          points: [[20, 0], [20, 20], [40, 20]],
        }, {
          id: 'img1',
          points: [[20, 0], [40, 20], [40, 20]],
        }, {
          id: 'img2',
          points: [[0, 20], [20, 20], [20, 40]],
        }, {
          id: 'img1',
          points: [[0, 40], [20, 40], [0, 20]],
        }, {
          id: 'img2',
          points: [[20, 20], [40, 20], [20, 40]],
        }, {
          id: 'img1',
          points: [[40, 20], [40, 40], [20, 40]],
        },
      ],
    };
  }

  render() {
    this.shadowRoot.innerHTML = this.style + this.html;
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return this.projectSVG(this.svg);
  }

  getProjectSvg() {
    return new Task((resolve, reject) => Request.get(`http://localhost:3000/projects/${this.id}`)
     .set('Authorization', Token.getToken().get())
     .set('Content-Type', 'application/json')
        .then((res) => {
          if (res) {
            return resolve(res.body);
          }

          return reject('Body was empty');
        })
        .catch((err) => {
          console.log(err.message);
          Page('/#/login'); /* eslint new-cap:0 */
        }));
  }

  projectToSVG(project) {
    return `<svg width="${project.width}" height="${project.height}" viewBox="${project.viewBox}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${project.patterns.reduce((val, pattern) => val + this.patternSVG(pattern))}
      </defs>
      ${project.polygons.reduce((val, polygon) => val + this.polygonSVG(polygon))}
    </svg>`;
  }

  // EX: pattern = {
  //   id: "PATERN_ID",
  //   width: "PATTERN_WIDTH",
  //   height: "PATTERN_HEIGHT",
  //   image: {
  //     href: "http://blablac.com.br",
  //     x: 150,
  //     y: 150,
  //     width: 100,
  //     height: 100
  //   }
  // }
  patternSVG(pattern) {
    return `<pattern id="${pattern.id}" patternUnits="userSpaceOnUse" width="${pattern.width}" height="${pattern.height}">
              <image xlink:href="${pattern.image.href}" x="${pattern.x}" y="${pattern.y}" width="${pattern.image.width}" height="${pattern.image.height}" />
            </pattern>`;
  }

  // EX: polygon = { points: [[x1, y1], [x2, y2], ... , [xn, yn]], id: "POLYGON ID" }
  polygonSVG(polygon) {
    const points = polygon.points.reduce((val, point) => `${val} ${point[0]},${point[1]}`);
    return `<polygon points="${points}" fill="url(#${polygon.id})">`;
  }

  // EX: path = { d: "M 100 100 L 300 100 L 200 300 z", id: "PATH_ID" }
  pathSVG(path) {
    return `<path d="${path.d}"
            fill="url(#${path.id})"/>`;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('id', value);
    this.render();
  }

  get style() {
    return `<style>
            </style>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('pw-project')) {
  document.registerElement('pw-project', PwProject);
}
