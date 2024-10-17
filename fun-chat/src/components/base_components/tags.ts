import { BaseComponents } from './base_components';

export const div = (className: string, idPage: string, ...children: BaseComponents[]) => new BaseComponents({ tag: 'div', className, idPage }, ...children);
export const p = (
  className: string,
  text: string | undefined,
  idPage: string,
) => new BaseComponents({
  tag: 'p', className, text, idPage,
});

export const h1 = (className: string, text: string, idPage: string) => new BaseComponents({
  tag: 'h1', className, text, idPage,
});

export const span = (className: string, text: string, idPage: string) => new BaseComponents({
  tag: 'span', className, text, idPage,
});
export const button = (className: string, text: string, idPage: string, onClick: EventListener) => {
  const call = new BaseComponents({
    tag: 'button', className, text, idPage,
  });
  call.addListener('click', onClick);
  return call;
};
export const a = (className: string, text: string, href: string) => {
  const call = new BaseComponents({ tag: 'a', className, text });
  call.setAttribute('href', href);
  return call;
};

export const img = (className: string, path: string) => {
  const call = new BaseComponents({ tag: 'img', className });
  call.setAttribute('src', `${path}`);
  return call;
};
