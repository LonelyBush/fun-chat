import { BaseComponents } from '../../base_components/base_components';
import { HeaderView } from './header/header';
import { Connection } from '../../connection/connect';
import { Router } from '../../router/router';
import { UsersView } from './users/users';
import { div } from '../../base_components/tags';
import { DialogContainer } from './messages/dialog-container';
import './main.css';

export class MainPage extends BaseComponents {
  private socket: Connection;

  private route: Router;

  constructor(idPage: string, route: Router, socket: Connection) {
    super({ tag: 'div', className: 'main-page', idPage });
    this.route = route;
    this.socket = socket;
    const mainSection = div('main-section', 'main-section');
    const header = new HeaderView(this.socket, this.route);
    const users = new UsersView(this.route, this.socket);
    const dialog = new DialogContainer(this.route, this.socket);
    mainSection.appendChildren([users, dialog]);
    this.appendChildren([header, mainSection]);
    this.socket.addEventListener('open', () => { this.socket.connect(); });
    this.socket.addEventListener(null, (message) => {
      users.externalLoginLogout(JSON.parse(message));
      dialog.receiveMessage(JSON.parse(message));
      dialog.checkForDelivered(JSON.parse(message));
    });
  }
}
