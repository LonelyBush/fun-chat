import { BaseComponents } from '../../base_components/base_components';

export class LoginFormItems extends BaseComponents {
  private onClick: EventListener | undefined;

  private onInput: EventListener | undefined;

  constructor({
    tag = '', className = '', placeholder = '', type = '', value = '', id = '',
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    textContent = '', disabled = '', required = '', onClick = (e:Event) => {}, onInput = (e:Event) => {},
  }, ...children: BaseComponents[]) {
    super({ tag, className }, ...children);
    this.onClick = onClick;
    this.onInput = onInput;
    this.setAttribute('type', type);
    if (onClick) {
      this.onClick = onClick;
      this.addListener('click', this.onClick);
    }
    if (onInput) {
      this.onInput = onInput;
      this.addListener('input', this.onInput);
    }
    if (value) {
      this.setAttribute('value', value);
    }
    if (placeholder) {
      this.setAttribute('placeholder', placeholder);
    }
    if (id) {
      this.setAttribute('id', id);
    }
    if (textContent) {
      this.setTextContent(textContent);
    }
    if (disabled) {
      this.setAttribute('disabled', '');
    }
    if (required) {
      this.setAttribute('required', '');
    }
  }
}
