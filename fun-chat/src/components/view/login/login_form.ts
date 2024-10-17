import { BaseComponents } from '../../base_components/base_components';
import {
  h1, div, span, button, p,
} from '../../base_components/tags';
import { LoginFormItems } from './login_components';
import { User } from '../../interfaces/interface';
import './login-style.css';
import { Router } from '../../router/router';
import { Connection } from '../../connection/connect';

export class LoginForm extends BaseComponents {
  private route: Router;

  private socket: Connection;

  constructor(idPage: string, route: Router, socket: Connection) {
    super({ tag: 'form', className: 'login-form', idPage });
    this.socket = socket;
    this.route = route;
    const title = h1('login-title', 'Login in', 'login-title');
    const inputLogin = new LoginFormItems({
      tag: 'input', className: 'text-input', placeholder: 'Enter your login', type: 'text', id: 'login-input', onInput: (e) => this.inputChecks(e),
    });
    const inputPassword = new LoginFormItems({
      tag: 'input', className: 'text-input', placeholder: 'Enter your password', type: 'password', id: 'pass-input', onInput: (e) => this.inputChecks(e),
    });
    const labelLogin = new LoginFormItems({
      tag: 'label', className: 'text-label', textContent: 'Login:',
    });
    const labelPassword = new LoginFormItems({
      tag: 'label', className: 'text-label', textContent: 'Password:',
    });
    const inputSubmit = new LoginFormItems({
      tag: 'input', className: 'sub-input', type: 'submit', value: 'Submit', id: 'sub-input', disabled: ' ', onClick: (e) => this.getInputValues(e),
    });
    const infoBtn = button('info-btn', 'Info', 'info-btn', (e) => {
      e.preventDefault();
      this.route.navigateTo('/about');
    });
    const inputLoginCon = div('input-content', 'input-login', inputLogin);
    const inputPassCon = div('input-content', 'input-pass', inputPassword);
    const textAreaLogin = div('text-area', 'text-login', labelLogin, inputLoginCon);
    const textAreaPass = div('text-area', 'text-pass', labelPassword, inputPassCon);
    const getItems = [title, textAreaLogin, textAreaPass, inputSubmit, infoBtn];
    this.appendChildren(getItems);
    setTimeout(() => { this.initiateExit(); }, 100);
  }

  getInputValues(e: Event) {
    e.preventDefault();
    const user : User = {
      login: '',
      password: '',
    };
    const getLogin = document.getElementById('login-input');
    const getPass = document.getElementById('pass-input');
    const getSubmit = document.getElementById('sub-input');
    if (getLogin instanceof HTMLInputElement && getPass instanceof HTMLInputElement) {
      user.login = getLogin?.value;
      user.password = getPass?.value;
    }
    this.authUser(user);
    getSubmit?.setAttribute('disabled', '');
  }

  authUser = (user: User) => {
    const id = Math.floor(Date.now() / 1000).toString();
    const createCall = {
      id,
      type: 'USER_LOGIN',
      payload: {
        user,
      },
    };
    this.socket.sendMessage(createCall, (response) => {
      if (response.type === 'ERROR') {
        const createError = p('error-response', `Error: ${response.payload?.error}`, 'error-mes');
        document.body.append(createError.getNode());
        setTimeout(() => {
          createError.getNode().remove();
        }, 1000);
      } else {
        sessionStorage.setItem('user', JSON.stringify(user));
        this.route.navigateTo('/main');
      }
    });
  };

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
      sessionStorage.clear();
    }
  }

  inputChecks(e: Event) {
    const targ = e.target;
    if (targ instanceof HTMLInputElement) {
      if (targ?.classList.contains('text-input')) {
        const childCol = targ?.parentElement?.children;
        if (childCol !== undefined) {
          const getSpan = Array.from(childCol).find((elem) => {
            let result;
            if (elem.id === 'length-err') {
              result = elem;
            }
            return result;
          });
          if (targ?.value.length <= 4) {
            if (getSpan === undefined) {
              const createLabel = span('error-mes', 'Length must be more than 4 characters', 'error-mes');
              createLabel.setAttribute('id', 'length-err');
              targ?.parentElement?.append(createLabel.getNode());
            }
          } else {
            getSpan?.remove();
          }
        }
      }
      if (targ?.id === 'pass-input') {
        const regEx = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
        const childCol = targ?.parentElement?.children;
        if (childCol !== undefined) {
          const getSpan = Array.from(childCol).find((elem) => {
            let result;
            if (elem.id === 'pass-err') {
              result = elem;
            }
            return result;
          });
          if (!regEx.test(targ?.value)) {
            if (getSpan === undefined) {
              const createLabel = span('error-mes', 'Use uppercase and lowercase letters and at least one number', 'error-mes');
              createLabel.setAttribute('id', 'pass-err');
              targ?.parentElement?.append(createLabel.getNode());
            }
          } else {
            getSpan?.remove();
          }
        }
      }
    }
    this.toggleSubmit();
  }

  toggleSubmit() {
    const getLogin = document.getElementById('login-input');
    const getPass = document.getElementById('pass-input');
    const getSubmit = document.getElementById('sub-input');
    const getLogCounts = getLogin?.parentElement?.childElementCount;
    const getPassCounts = getPass?.parentElement?.childElementCount;
    if (getLogCounts !== undefined && getPassCounts !== undefined
      && getPass instanceof HTMLInputElement && getLogin instanceof HTMLInputElement
    ) {
      if (getLogin.value.length > 0 && getPass?.value.length > 0) {
        if (getLogCounts === 1 && getPassCounts === 1) {
          getSubmit?.removeAttribute('disabled');
        } else {
          getSubmit?.setAttribute('disabled', '');
        }
      }
    }
  }
}
