/// <reference types="cypress" />
const userName = "franciscodiegonobre@gmail.com";
const password = "automationpwd123";

describe("First test suite", () => {
  beforeEach('Login', () => {
    cy.loginToTrelloUi(userName, password)
  })
  it("Creates several Boards", () => {
    cy.visit("/");
    cy.createBoard('Test board 1')
    cy.createBoard('Test board 2')
  });

  it("Selects a Board and creates a List", () => {
    cy.visit('/')
    cy.selectBoard('Test board 1')
    cy.createList('List title')
  });

  it("Creates a Card in a List and adds a Description", () => {
    cy.visit('/')
    cy.selectBoard('Test board 1')
    cy.createCard('Doing', 'Card name 2')
    cy.wait(500)
    cy.addCardDescription('Card name 2', 'Testing card description')
  }); 

  it("Adds a predefined color Label to a Card", () => {
    cy.visit('/')
    cy.selectBoard('Test board 1')
    cy.addCardLabel('Card name 2', 'purple')
  }); 

  it.only("Adds a link as an Attachment and asserts the link", () => {
    cy.visit('/')
    cy.selectBoard('Test board 1')
    cy.addCardLink('Card name 1', 'https://www.netcentric.biz/', 'Google link title')
    cy.wait(500)
    cy.get('.attachment-thumbnail-details-title-action').should('have.attr', 'href', 'https://www.netcentric.biz/')
  }); 
});

// Create an After test to delete all boards
// cy.contains('[data-testid="collapsible-list"]', 'Your boards ').find('[data-testid="OverflowMenuHorizontalIcon"]')

