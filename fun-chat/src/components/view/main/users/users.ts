import { BaseComponents } from '../../../base_components/base_components';
import { Connection } from '../../../connection/connect';
import { Router } from '../../../router/router';
import { LoginFormItems } from '../../login/login_components';
import { div, p } from '../../../base_components/tags';
import './users.css';
import { UsersComponent } from './users_component';
import { CheckInfo, RequestData } from '../../../interfaces/interface';
import { DialogComponent } from '../messages/dialog-component';

export class UsersView extends BaseComponents {
  private route: Router;

  private socket: Connection;

  constructor(route: Router, socket: Connection) {
    super({ tag: 'div', className: 'users-sections', idPage: 'users-section' });
    this.route = route;
    this.socket = socket;
    const textArea = new LoginFormItems({
      tag: 'input', placeholder: 'Search', type: 'text', id: 'search-input', className: 'search-input', onInput: (e) => { this.searchFunction(e); },
    });
    const searchSection = div('search-block', 'search-block', textArea);
    const usersSection = div('users-block', 'users-block');
    this.appendChildren([searchSection, usersSection]);
    setTimeout(() => { this.userFromServer(); }, 500);
  }

  searchFunction(e: Event) {
    const targ = e.target;
    if (targ instanceof HTMLInputElement) {
      const getUsersBlock = document.getElementById('users-block');
      if (getUsersBlock !== null) {
        Array.from(getUsersBlock.children).forEach((user) => {
          const username = user.id.slice(5);
          const isVisible = username.includes(targ.value);
          user.classList.toggle('hide', !isVisible);
        });
      }
    }
  }

  userFromServer() {
    const id = Math.floor(Date.now() / 1000).toString();
    const createCallActive = {
      id,
      type: 'USER_ACTIVE',
      payload: null,
    };
    const createCallInactive = {
      id,
      type: 'USER_INACTIVE',
      payload: null,
    };
    setTimeout(() => {
      this.socket.sendMessage(createCallActive, (response) => {
        const getUsersArr = response.payload?.users;
        const getUserFromStorage = sessionStorage.getItem('user');
        getUsersArr?.forEach((elem) => {
          if (getUserFromStorage !== null) {
            const getSessionUser = JSON.parse(getUserFromStorage);
            if (getSessionUser.login !== elem.login) {
              this.createUser('active', `${elem.login}`);
            }
          }
        });
      });
    }, 400);

    setTimeout(() => {
      this.socket.sendMessage(createCallInactive, (response) => {
        const getUsersArr = response.payload?.users;
        const getUserFromStorage = sessionStorage.getItem('user');
        getUsersArr?.forEach((elem) => {
          if (getUserFromStorage !== null) {
            const getSessionUser = JSON.parse(getUserFromStorage);
            if (getSessionUser.login !== elem.login) {
              this.createUser('inactive', `${elem.login}`);
            }
          }
        });
      });
    }, 500);
  }

  createUser(status: string, login: string) {
    const createContact = new UsersComponent(
      login,
      login,
      status,
      (e) => { this.setDialogInv(e); },
    );
    const getUsersSection = document.getElementById('users-block');
    getUsersSection?.append(createContact.getNode());
  }

  setDialogInv(e: Event) {
    const userInformation: CheckInfo = {};
    const targ = e.currentTarget;
    if (targ instanceof HTMLElement) {
      Array.from(targ.children).forEach((element) => {
        if (element.classList.contains('active')) {
          userInformation.status = 'active';
        } else if (element.classList.contains('inactive')) {
          userInformation.status = 'inactive';
        }
      });
      const getLogin = targ.id.slice(5);
      userInformation.login = getLogin;
      this.getUserMessageStory(getLogin);
    }
    const getDialogHeader = document.getElementById('dialog-header');
    const getDialogContent = document.getElementById('dialog-content');
    const getMessageInput = document.getElementById('message-input');
    if (getDialogHeader && getDialogContent && getMessageInput) {
      getDialogHeader.innerHTML = '';
      getDialogContent.innerHTML = '';
      const createStartMessage = p('dialog-element', 'Write your first message...', 'dialog-element');
      const createUserLabel = p('user-label', `${userInformation.login}`, `recipient-${userInformation.login}`);
      const createStatusLabel = p(`status ${userInformation.status}`, userInformation.status, `rec-status-${userInformation.status}`);
      getMessageInput.removeAttribute('disabled');
      getDialogHeader.append(createUserLabel.getNode(), createStatusLabel.getNode());
      getDialogContent.append(createStartMessage.getNode());
    }
  }

  externalLoginLogout(response: RequestData) {
    if (response.type === 'USER_EXTERNAL_LOGIN') {
      const getLogin = response.payload?.user?.login;
      const getSameElement = document.getElementById(`user-${getLogin}`);
      if (getLogin !== undefined && getSameElement === null) {
        this.createUser('active', getLogin);
      } if (getLogin !== undefined && getSameElement !== null) {
        const getStatus = document.getElementById(`status-${getLogin}`);
        getStatus?.classList.remove('inactive');
        getStatus?.classList.add('active');
        const getDialogStatus = document.getElementById('rec-status-inactive');
        if (getDialogStatus !== null) {
          getDialogStatus.textContent = 'active';
          getDialogStatus.classList.remove('inactive');
          getDialogStatus.classList.add('active');
          getDialogStatus.id = 'rec-status-active';
        }
      }
    }
    if (response.type === 'USER_EXTERNAL_LOGOUT') {
      const getLogin = response.payload?.user?.login;
      const getSameElement = document.getElementById(`user-${getLogin}`);
      if (getLogin !== undefined && getSameElement !== null) {
        const getStatus = document.getElementById(`status-${getLogin}`);
        getStatus?.classList.remove('active');
        getStatus?.classList.add('inactive');
        const getDialogStatus = document.getElementById('rec-status-active');
        if (getDialogStatus !== null) {
          getDialogStatus.textContent = 'inactive';
          getDialogStatus.classList.remove('active');
          getDialogStatus.classList.add('inactive');
          getDialogStatus.id = 'rec-status-inactive';
        }
      }
    }
  }

  getUserMessageStory(login: string) {
    const id = Math.floor(Date.now() / 1000).toString();
    const createCall = {
      id,
      type: 'MSG_FROM_USER',
      payload: {
        user: {
          login,
        },
      },
    };
    this.socket.sendMessage(createCall, (response) => {
      const messages = response?.payload?.messages;
      const dialogContent = document.getElementById('dialog-content');
      if (dialogContent
         && (messages !== undefined && messages.length > 0)) dialogContent.innerHTML = '';
      messages?.forEach((elem) => {
        if (elem?.from === login) {
          const createMessageFrom = new DialogComponent({
            idPage: `from-${elem.from}`, className: 'from', login: elem.from, text: elem?.text, date: elem?.datetime,
          });
          dialogContent?.append(createMessageFrom.getNode());
          dialogContent?.scrollTo(0, dialogContent.scrollHeight);
        } else {
          // console.log(elem?.status?.isDelivered);
          const createMessageTo = new DialogComponent({
            idPage: `to-${elem.to}`, className: 'to', login: 'You', text: elem?.text, date: elem?.datetime, status: elem?.status?.isDelivered,
          });
          dialogContent?.append(createMessageTo.getNode());
          dialogContent?.scrollTo(0, dialogContent.scrollHeight);
        }
      });
    });
  }
}
