import { BaseComponents } from '../../base_components/base_components';
import {
  h1, button, p, a,
} from '../../base_components/tags';
import { Router } from '../../router/router';
import './about.css';

export class AboutView extends BaseComponents {
  private router: Router;

  constructor(idPage: string, router: Router) {
    super({ tag: 'div', className: 'about', idPage });
    this.router = router;
    const aboutTitle = h1('about-title', 'Fun-chat', 'about-title');
    const textDescription = '"Fun-Chat" is an interactive web application for exchanging messages between users. It provides users with the ability to communicate in real time and send text messages. The application has a simple and intuitive interface, supports user registration, authorization and the ability to create profiles.';
    const aboutDescription = p('about-text', textDescription, 'text-description');
    const author = a('about-author', 'Author: lonelybush', 'https://github.com/LonelyBush');
    const getBackBtn = button('back-btn', 'Go back', 'back-btn', () => {
      window.history.back();
    });

    const collectComponents = [aboutTitle, aboutDescription, author, getBackBtn];
    this.appendChildren(collectComponents);
  }
}
