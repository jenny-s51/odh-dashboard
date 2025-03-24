import { Contextual } from './Contextual';

export class DashboardCodeEditor extends Contextual<HTMLElement> {
  findInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.find().find('.view-lines.monaco-mouse-cursor-text');
  }

  findUpload(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.find().find('input[type="file"]');
  }


  findUploadFilesButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('button[aria-label="Upload code"]');
  }
}
