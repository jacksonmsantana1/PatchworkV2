import './components/login-form/email-input/email-input';
import './components/login-form/password-input/password-input';
import './components/login-form/submit-button/submit-button';
import './components/login-form/login-error/login-error';
import './components/project-title/project-title';
import './components/login-form/login-form';

class LoginPage extends HTMLElement {
  createdCallback() {
    if (super.createdCallback) {
      super.createdCallback();
    }

    // Setting the Inner Dom and the styles
    this.innerHTML = this.html;
  }

  get html() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<project-title>Patchwork</project-title>
            <login-form></login-form>`;
  }
}

// Check that the element hasn't already been registered
if (!window.customElements.get('login-page')) {
  document.registerElement('login-page', LoginPage);
}
