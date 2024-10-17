export class BaseComponents <T extends HTMLElement = HTMLElement> {
  protected node: T | SVGElement;

  #children: (SVGElement | HTMLElement | null)[] = [];

  constructor({
    tag = 'div', className = '', text = '', idPage = '',
  }, ...children: BaseComponents[]) {
    const node = document.createElement(tag) as T;
    node.className = className;
    node.textContent = text;
    node.id = idPage;
    this.node = node;
    if (children) {
      this.appendChildren(children);
    }
  }

  append(child: BaseComponents | HTMLElement | SVGElement) {
    if (child instanceof BaseComponents) {
      if (child instanceof HTMLElement) this.#children.push(child);
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  appendChildren(children: (BaseComponents | HTMLElement | null)[]) {
    children.forEach((element) => {
      if (element !== null) this.append(element);
    });
  }

  getNode() {
    return this.node;
  }

  getChildren() {
    return this.node.childNodes;
  }

  setTextContent(content: string) {
    if (this.node !== null) this.node.textContent = content;
  }

  setAttribute(attribute:string, value: string) {
    if (this.node !== null) this.node.setAttribute(attribute, value);
  }

  removeAttribute(attribute:string) {
    if (this.node !== null) this.node.removeAttribute(attribute);
  }

  toggleClass(className: string) {
    if (this.node !== null) this.node.classList.toggle(className);
  }

  addListener(event: string, listener: EventListener, options = false) {
    if (this.node !== null) this.node.addEventListener(event, listener, options);
  }

  removeListener(event: string, listener: EventListener, options = false) {
    if (this.node !== null) this.node.removeEventListener(event, listener, options);
  }

  destroyChildren() {
    this.#children.forEach((child) => {
      if (child !== null && child instanceof BaseComponents) child.destroy();
    });
    this.#children.length = 0;
  }

  destroy() {
    this.destroyChildren();
    if (this.node !== null) this.node.remove();
  }
}
