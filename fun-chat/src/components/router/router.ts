import { Route } from '../interfaces/interface';

export class Router {
  routes: Route[];

  constructor(routes: Route[]) {
    this.routes = routes;
  }

  initRouter() {
    window.addEventListener('DOMContentLoaded', this.navigate.bind(this));
    window.addEventListener('popstate', this.navigate.bind(this));
  }

  navigate() {
    const path = window.location.pathname;
    console.log(path);
    const route = this.routes.find((routes) => routes.path === path);
    if (route) {
      route.component();
    } else {
      console.log('Маршрут не найден');
    }
  }

  navigateTo(path: string) {
    const route = this.routes.find((routes) => routes.path === path);
    if (route) {
      route.component();
      window.history.pushState(null, '', `${path}`);
    } else {
      console.log('Страница не найдена');
    }
  }
}
