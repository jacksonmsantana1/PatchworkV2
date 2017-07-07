/* eslint quotes:0 new-cap:0 */
import Request from 'superagent';
import Page from 'page';
import Token from './lib/Token/Token';
import './Login/login';
import './Main/main';
import './Project/project';

/* Helper Functions */
const backToLogin = (errMessage) => {
  console.error(errMessage);
  Page('/#/login');
};

const isLog = (ctx, next) => {
  const token = Token.getToken().getOrElse('');

  if (!token) {
    Page('/#/login');
  }

  Request.put('http://localhost:3000/isLogged')
    .set('Content-Type', 'application/json')
    .set('Authorization', `${token}`)
    .send(`{ "token": "${token}" }`)
    .then((res) => {
      if (res.status === 200 || res.body) {
        Token.setToken(res.req.header.Authorization);
        next();
      } else {
        backToLogin(res.message);
      }
    })
    .catch((err) => {
      backToLogin(err.message);
    });
};

const loadPage = (page, name) => {
  document.body.innerHTML = '';
  document.body.appendChild(page);
  console.log(`${name} page loaded...`);
};

const getUser = (ctx, next) => {
  const token = Token.getToken().getOrElse('');
  const email = Token.getPayload().get().email;

  Request.get(`http://localhost:3000/users/${email}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `${token}`)
    .send(`{ "token": "${token}" }`)
    .then((res) => {
      if (res.status === 200 || res.body) {
        Token.setToken(res.req.header.Authorization);
        /* eslint no-param-reassign:0 */
        ctx.state.user = res.body;
        ctx.save();
        next();
      } else {
        backToLogin(res.message);
      }
    })
    .catch((err) => {
      backToLogin(err.message);
    });
};

const updateUserLastSession = (ctx, next) => {
  const token = Token.getToken().getOrElse('');
  const email = Token.getPayload().get().email;

  Request.put(`http://localhost:3000/user/${email}/lastSession`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `${token}`)
    .send(`{ "lastSession": "/#${ctx.path}" }`)
    .then((res) => {
      if (res.status === 200 || res.body) {
        Token.setToken(res.req.header.Authorization);
        next();
      } else {
        backToLogin(res.message);
      }
    })
    .catch((err) => {
      backToLogin(err.message);
    });
};

/* Routing */

Page.base('/#');

// Filter - works like a redirect page to the last visited one
Page('/', isLog, getUser, (ctx) => {
  const lastPage = ctx.state.user.lastSession;
  Page(lastPage);
});

// FIXME When the page is called using Page('/#/') this function
// is called twice
Page('/main', isLog, updateUserLastSession, () => {
  const main = document.createElement('main-page');
  loadPage(main, 'Main');
});

Page('/login', () => {
  Token.deleteToken();
  const login = document.createElement('login-page');
  loadPage(login, 'Login');
});

Page('/projects/:id', isLog, updateUserLastSession, (ctx) => {
  const project = document.createElement('project-page');
  const id = ctx.params.id;
  project.id = id;
  loadPage(project, 'Project');
});

Page('/projects/:id/:sessionId', isLog, updateUserLastSession, (ctx) => {
  const id = ctx.params.id;
  const sessionId = ctx.params.sessionId;
  const project = document.createElement('project-page');

  project.setAttribute('id', id); // The id must be changed before !
  project.setAttribute('session', sessionId);
  loadPage(project, 'Project');
});

Page('*', () => {
  backToLogin('Page Not Found');
});

Page();

export default Page;
