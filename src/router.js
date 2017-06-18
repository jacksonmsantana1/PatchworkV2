/* eslint quotes:0 */
import Request from 'superagent';
import Page from 'page';
import Task from 'data.task';
import Token from './lib/Token/Token';
import './Login/login';
import './Main/main';

/* Helper Functions */

/* eslint new-cap:0 */
const isLogged = token => new Task((reject, resolve) => {
  Request.put('http://localhost:3000/isLogged')
    .set('Content-Type', 'application/json')
    .send(`{ "token": "${token}" }`)
    .then((res) => {
      if (res.status !== 200) {
        resolve(false);
      }

      resolve(true);
    })
    .catch((err) => {
      reject(err);
    });
});

const backToLogin = (errMessage) => {
  console.log(errMessage);
  Page('/#/login');
};

const loadPage = (page) => {
  document.body.innerHTML = '';
  document.body.appendChild(page);
  console.log(`${page.toString()} page loaded...`);
};

/* Routing */

Page.base('/#');

Page('/', () => {
  const token = Token.getToken().getOrElse('');
  const main = document.createElement('main-page');

  isLogged(token).fork((err) => {
    backToLogin(err.response.body.message);
  }, (res) => {
    if (res) {
      loadPage(main);
    } else {
      backToLogin('User must be logged in...');
    }
  });
});

Page('/login', () => {
  Token.deleteToken();
  const login = document.createElement('login-page');

  loadPage(login);
});

Page();

export default Page;