import './components/main-body/main-body';
import './components/main-body/pw-projects-list/pw-projects-list';
import './components/main-body/pw-project/pw-project';
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
            <main-body>
              <pw-projects-list>
                <pw-project active="true" image="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/cinderella.jpg" id="1">Cinderella wearing European fashion of the mid-1860’s</pw-project>
                <pw-project active="true" image="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/rapunzel.jpg" id="2">Rapunzel, clothed in 1820’s period fashion</pw-project>
                <pw-project active="true" image="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/belle.jpg" id="3">Belle, based on 1770’s French court fashion</pw-project>
                <pw-project active="true" image="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/mulan_2.jpg" id="4">Mulan, based on the Ming Dynasty period</pw-project>
                <pw-project active="true" image="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/sleeping-beauty.jpg" id="5">Sleeping Beauty, based on European fashions in 1485</pw-project>
                <pw-project active="true" image="//s3-us-west-2.amazonaws.com/s.cdpn.io/4273/pocahontas_2.jpg" id="6">Pocahontas based on 17th century Powhatan costume</pw-project>
              </pw-projects-list>
            </main-body>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('main-page')) {
  document.registerElement('main-page', MainPage);
}
