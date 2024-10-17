import { BaseComponents } from '../../../base_components/base_components';
import { Connection } from '../../../connection/connect';
import { Router } from '../../../router/router';
import { div, p } from '../../../base_components/tags';
import { LoginFormItems } from '../../login/login_components';

import './dialog-container.css';
import { DialogComponent } from './dialog-component';
import { RequestData } from '../../../interfaces/interface';

export class DialogContainer extends BaseComponents {
  private route: Router;

  private socket: Connection;

  constructor(route: Router, socket: Connection) {
    super({ tag: 'div', className: 'dialog-container', idPage: 'dialog-container' });
    this.route = route;
    this.socket = socket;
    const dialogHeader = div('dialog-header', 'dialog-header');
    const dialogEmptyState = p('dialog-element', 'Select a user to send a message...', 'dialog-element');
    const dialogContent = div('dialog-content', 'dialog-content', dialogEmptyState);
    const textMessageInput = new LoginFormItems({
      tag: 'input', className: 'message-input', id: 'message-input', placeholder: 'Message...', type: 'text', disabled: ' ', onInput: (e) => { this.onInputCheck(e); },
    });
    const textMessageSubmit = new LoginFormItems({
      tag: 'input', className: 'message-submit', id: 'message-submit', type: 'submit', disabled: ' ', value: 'Send', onClick: (e) => { this.sendMessage(e); },
    });
    const inputForm = new LoginFormItems({ tag: 'form', className: 'message-form', id: 'message-form' }, textMessageInput, textMessageSubmit);
    inputForm.appendChildren([textMessageInput, textMessageSubmit]);
    this.appendChildren([dialogHeader, dialogContent, inputForm]);
  }

  sendMessage(e: Event) {
    e.preventDefault();
    const getMessageText = document.getElementById('message-input');
    const getMessageSub = document.getElementById('message-submit');
    const getUserRec = document.querySelector('.user-label');
    const dialogContent = document.getElementById('dialog-content');
    const dialogElement = document.getElementById('dialog-element');
    if (getMessageText instanceof HTMLInputElement
       && getUserRec !== null && dialogContent !== null) {
      dialogElement?.remove();
      const id = Math.floor(Date.now() / 1000).toString();
      const getRecLogin = getUserRec.textContent;

      if (getRecLogin !== null) {
        const createCall = {
          id,
          type: 'MSG_SEND',
          payload: {
            message: {
              to: getRecLogin,
              text: getMessageText.value,
            },
          },
        };

        this.socket.sendMessage(createCall, (response) => {
          const getResponse = response.payload?.message;
          const createSendMessage = new DialogComponent({
            idPage: `to-${getRecLogin}`, className: 'to', login: 'You', text: `${getResponse?.text}`, date: getResponse?.datetime, status: getResponse?.status?.isDelivered,
          });
          dialogContent.append(createSendMessage.getNode());
          dialogContent?.scrollTo(0, dialogContent.scrollHeight);
        });
        getMessageText.value = '';
        getMessageSub?.setAttribute('disabled', ' ');
      }
    }
  }

  receiveMessage(response: RequestData) {
    if (response.type === 'MSG_SEND' && response.id === null) {
      const dialogElement = document.getElementById('dialog-element');
      const message = {
        from: response.payload?.message?.from,
        to: response.payload?.message?.to,
        text: response.payload?.message?.text,
        date: response.payload?.message?.datetime,
        status: response.payload?.message?.status?.isDelivered,
      };
      const getRecipient = document.getElementById(`recipient-${message.from}`);
      if (getRecipient !== null) {
        dialogElement?.remove();
        const getDialogContent = document.getElementById('dialog-content');
        const createSendMessage = new DialogComponent({
          idPage: `from-${message.from}`, className: 'from', login: `${message.from}`, text: `${message.text}`, date: message.date,
        });
        getDialogContent?.append(createSendMessage.getNode());
        getDialogContent?.scrollTo(0, getDialogContent.scrollHeight);
      }
    }
  }

  checkForDelivered(response: RequestData) {
    if (response.type === 'MSG_DELIVER' && response.id === null) {
      const getMessageFooter = document.querySelectorAll('.text-footer');
      getMessageFooter.forEach((elem) => {
        const res = elem;
        if (res.textContent === 'Sended') {
          res.textContent = 'Delivered';
        }
      });
    }
  }

  onInputCheck(e: Event) {
    const targ = e.target;
    if (targ instanceof HTMLInputElement) {
      const getSendBtn = document.getElementById('message-submit');
      if (!targ?.value) {
        getSendBtn?.setAttribute('disabled', ' ');
      } else {
        getSendBtn?.removeAttribute('disabled');
      }
    }
  }
}
