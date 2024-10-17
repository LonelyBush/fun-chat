import { BaseComponents } from '../../../base_components/base_components';
import {
  button, div, p, h1,
} from '../../../base_components/tags';
import { Connection } from '../../../connection/connect';
import { Router } from '../../../router/router';
import { User } from '../../../interfaces/interface';

import './header.css';

export class HeaderView extends BaseComponents {
  private socket: Connection;

  private route: Router;

  constructor(socket: Connection, route: Router) {
    super({ tag: 'div', className: 'header-main' });
    this.socket = socket;
    this.route = route;
    const userTitle = p('user-title', 'User:', 'user-login');
    const appTitle = h1('main-title', 'Fun-Chat', 'main-title');
    const infoBtn = button('info-btn', 'Info', 'info-btn', () => {
      this.route.navigateTo('/about');
    });
    const exitBtn = button('exit-btn', 'Exit', 'exit-btn', () => { this.initiateExit(); });
    const titlesSection = div('title-block', 'title-section', userTitle, appTitle);
    const buttonSection = div('btn-block', 'btn-section', infoBtn, exitBtn);
    const getChilds = [titlesSection, buttonSection];
    this.appendChildren(getChilds);
    setTimeout(() => { this.userName(); }, 100);
  }

  userName() {
    const getSessionData = sessionStorage.getItem('user');
    if (getSessionData !== null) {
      const getUserName = document.getElementById('user-login');
      const user = JSON.parse(getSessionData);

      this.innerAuth(user);
      if (getUserName !== null) {
        getUserName.textContent = `User: ${user.login}`;
      }
    } else {
      this.route.navigateTo('/');
    }
  }

  innerAuth(user: User) {
    const id = Math.floor(Date.now() / 1000).toString();
    const createCall = {
      id,
      type: 'USER_LOGIN',
      payload: {
        user,
      },
    };
    this.socket.sendMessage(createCall, () => {
    });
  }

  initiateExit() {
    const getSessionData = sessionStorage.getItem('user');
    if (getSessionData !== null) {
      const user = JSON.parse(getSessionData);
      const id = Math.floor(Date.now() / 1000).toString();
      const createCall = {
        id,
        type: 'USER_LOGOUT',
        payload: {
          user,
        },
      };
      this.socket.sendMessage(createCall, () => {
      });
    }
    sessionStorage.clear();
    this.route.navigateTo('/');
  }
}
