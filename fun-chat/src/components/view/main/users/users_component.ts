import { BaseComponents } from '../../../base_components/base_components';
import { div, p } from '../../../base_components/tags';

type OnItemClicked = (e: Event) => void;
export class UsersComponent extends BaseComponents {
  constructor(
    idPage: string,
    login: string,
    status: string,
    onItemEvent: OnItemClicked = () => {},
  ) {
    super({ tag: 'div', className: 'user-contact', idPage: `user-${idPage}` });
    this.addListener('click', onItemEvent);
    const createStatusEl = div(`user-status ${status}`, `status-${login}`);
    const createUserLogin = p('user-login', `${login}`, `login-${login}`);
    this.appendChildren([createStatusEl, createUserLogin]);
  }
}
