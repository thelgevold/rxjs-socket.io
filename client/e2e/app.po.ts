export class ClientPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('client-app h1')).getText();
  }
}
