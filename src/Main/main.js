import './components/main-body/main-body';
import './components/nav-bar/nav-bar';
import './components/nav-bar/nav-bar-tab/nav-bar-tab';

class MainPage extends HTMLElement {
  createdCallback() {
    if (super.createdCallback) {
      super.createdCallback();
    }


    // Setting the Inner Dom and the styles
    this.innerHTML = this.html;
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<nav-bar logo="Patchwork Project">
              <nav-bar-tab class="active" href="/#/" slot="tabsSlot">Main</nav-bar-tab>
              <nav-bar-tab class="active" href="/#/login" slot="tabsSlot">Logout</nav-bar-tab>
            </nav-bar>
            <main-body></main-body>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('main-page')) {
  document.registerElement('main-page', MainPage);
}
