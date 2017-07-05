/* eslint quotes:0 */
import Request from 'superagent';
import Page from 'page';
import Task from 'data.task';
import Token from './lib/Token/Token';
import './Login/login';
import './Main/main';
import './Project/project';

/* Helper Functions */

/* eslint new-cap:0 */
const isLogged = token => new Task((reject, resolve) => {
  Request.put('http://localhost:3000/isLogged')
    .set('Content-Type', 'application/json')
    .set('Authorization', `${token}`)
    .send(`{ "token": "${token}" }`)
    .then((res) => {
      if (res.status !== 200 || !res.body) {
        resolve(false);
      }

      Token.setToken(res.req.header.Authorization);
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

// FIXME When the page is called using Page('/#/') this function
// is called twice
Page('/', () => {
  const token = Token.getToken().getOrElse('');

  isLogged(token).fork((err) => {
    backToLogin(err.response.body.message);
  }, (res) => {
    if (res) {
      const main = document.createElement('main-page');
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

Page('/projects/:id', (ctx) => {
  const token = Token.getToken().getOrElse('');
  const id = ctx.params.id;

  isLogged(token).fork((err) => {
    backToLogin(err.response.body.message);
  }, (res) => {
    if (res) {
      const project = document.createElement('project-page');
      project.id = id;
      loadPage(project);
    } else {
      backToLogin('User must be logged in...');
    }
  });
});

Page();

export default Page;
