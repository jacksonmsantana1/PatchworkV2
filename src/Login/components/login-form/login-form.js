import Request from 'superagent';
import Page from 'page';
import Token from '../../../lib/Token/Token';
import H from '../../../lib/Helper/Helper';

// TODO Show a message of error if the email is still incorrect,

/* eslint new-cap:0 */
class LoginForm extends HTMLElement {
  createdCallback() {
    this.email = '';
    this.password = '';

    // Setting the Inner Dom and the styles
    this.innerHTML = this.style + this.html;

    // Add event listeners
    this.addEventListener('password-typed', this.onPasswordTyped.bind(this), false);
    this.addEventListener('email-typed', this.onEmailTyped.bind(this), false);
    this.addEventListener('submitted', this.onSubmitted.bind(this), false);

    if (super.createdCallback) {
      super.createdCallback();
    }
  }

  onPasswordTyped(evt) {
    this.password = evt.detail;
  }

  onEmailTyped(evt) {
    this.email = evt.detail;
  }

  onSubmitted() {
    this.submitForm()
      .then((response) => {
        if (response.statusCode === 200) {
          Token.setToken(response.text);
          Page('/#/');
        }
      }).catch((res) => {
        if (res.status === 401 && res.response.body.message === 'User Not Found') {
          /* eslint no-return-assign:0 no-param-reassign:0 */
          this.getLoginError().fold(H.logError('login-error'), H.changeProps('message', 'User Not Found'));
        } else if (res.status === 401 && res.response.body.message === 'Invalid Password') {
          this.getLoginError().fold(H.logError('login-error'), H.changeProps('message', 'Invalid Password'));
        } else if (res && res.reponse && res.response.body && res.response.body.message) {
          H.logError('login-form', res.response.body.message);
        } else {
          this.getLoginError().fold(H.logError('login-error'), H.changeProps('message', res));
        }
      });
  }

  // FIXME - IT returns an promise not an task
  submitForm() {
    if (!this.email && !this.password) {
      return Promise.reject('Email and Passwords fields are empty');
    } else if (!this.getInputEmail().get().valid) {
      return Promise.reject('Invalid email address');
    } else if (!this.password && this.email) {
      return Promise.reject('Password field is empty');
    } else if (!this.email && this.password) {
      return Promise.reject('Email field is empty');
    }

    return Request.put('http://localhost:3000/login')
      .set('Content-Type', 'application/json')
      .send(`{ "email": "${this.email}", "password": "${this.password}"  }`);
  }

  getInputPassword() {
    return H.childNodes(this)
      .chain(H.nth(2))
      .chain(H.childNodes)
      .chain(H.nth(3))
      .map(H.log);
  }

  getInputEmail() {
    return H.childNodes(this)
      .chain(H.nth(2))
      .chain(H.childNodes)
      .chain(H.nth(1))
      .map(H.log);
  }

  getLoginError() {
    return H.childNodes(this)
      .chain(H.nth(2))
      .chain(H.childNodes)
      .chain(H.nth(5))
      .map(H.log);
  }

  get html() {
    return `     <form>
        <email-input valid="true" active="true"></email-input>
        <password-input active="true"></password-input>
        <login-error></login-error>
        <submit-button active="true"></submit-button>
      </form>`;
  }

  get style() {
    /* eslint quotes:0 class-methods-use-this:0 */
    return `<style>
      * { box-sizing:border-box; background: #f9dae0; }

      form {
        width: 380px;
        margin: 4em auto;
        padding: 3em 2em 2em 2em;
        background: #f9c3c3;
        border: 1px solid #ebebeb;
        border-radius: 2em;
        box-shadow: rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px;
    }

      </style>`;
  }
}

document.registerElement('login-form', LoginForm);
export default LoginForm;
