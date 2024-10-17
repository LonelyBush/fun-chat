import { Router } from './router/router';
import { AboutView } from './view/about/about';
import { LoginForm } from './view/login/login_form';
import { Connection } from './connection/connect';
import { MainPage } from './view/main/main';

export class App {
  private router: Router;

  private connect: Connection;

  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.connect = new Connection('ws://localhost:4000/');
  }

  createRoutes() {
    return [
      {
        path: '/',
        component: () => {
          document.body.innerHTML = '';
          const loginPage = new LoginForm('login', this.router, this.connect);
          document.body.append(loginPage.getNode());
        },
      },
      {
        path: '/about',
        component: () => {
          document.body.innerHTML = '';
          const aboutPage = new AboutView('about-page', this.router);
          document.body.append(aboutPage.getNode());
        },
      },
      {
        path: '/main',
        component: () => {
          document.body.innerHTML = '';
          const mainPage = new MainPage('main-page', this.router, this.connect);
          document.body.append(mainPage.getNode());
        },
      },
    ];
  }

  run() {
    this.connect.connect();
    this.router.initRouter();
  }
}
