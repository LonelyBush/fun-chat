import { BaseComponents } from '../../../base_components/base_components';
import { div, p } from '../../../base_components/tags';
import { DialogStructure } from '../../../interfaces/interface';
import { formattedDate } from '../../../utils/utils';

type OnItemClicked = (e: Event) => void;
export class DialogComponent extends BaseComponents {
  constructor(dialog: DialogStructure, onItemEvent: OnItemClicked = () => {}) {
    super({ tag: 'div', className: `style-message ${dialog.className}`, idPage: dialog.idPage });
    this.addListener('contextmenu', onItemEvent);
    let footerMessage = p('text-footer', '', 'text-footer');
    if (dialog.date) {
      if (dialog.status === true) {
        footerMessage = p('text-footer', 'Delivered', 'text-footer');
      }
      if (dialog.status === false) {
        footerMessage = p('text-footer', 'Sended', 'text-footer');
      }
      const getDate = formattedDate(dialog.date);
      const nameLabel = p('name-label', `${dialog.login}`, 'name-label');
      const dateLabel = p('date-label', getDate, 'date-label');
      const textMessage = p('text-message', dialog.text, 'text-message');
      const messageHeader = div('message-header', 'message-header', nameLabel, dateLabel);
      const messageContent = div('message-content', 'message-content', textMessage);
      const messageFooter = div('message-footer', 'message-footer', footerMessage);
      this.appendChildren([messageHeader, messageContent, messageFooter]);
    }
  }
}
