/// <reference types="cypress" />
const userName = "franciscodiegonobre@gmail.com";
const password = "automationpwd123";

describe("First test suite", () => {
  // before('Clear cookies', () => {
  //   cy.clearCookies()
  // })
  
  beforeEach('Login', () => {
    cy.loginToTrelloUi(userName, password)
  })

  it("Creates several Boards", () => {
    cy.visit("/");
    cy.createBoard('Test board 1')
    cy.wait(500)
    cy.createBoard('Test board 2')
  });

  it("Selects a Board and creates a List", () => {
    cy.visit('/')
    cy.reload(true)
    cy.selectBoard('Test board 1')
    cy.wait(500)
    cy.createList('List title')
  });

  it("Moves a list to another board", () => {
    cy.visit('/')
    cy.reload(true)
    cy.selectBoard('Test board 1')
    cy.wait(500)
    cy.moveList('List title', 'Test board 2')
  }); 

  it.skip("Creates a Card in a List and adds a Description", () => {
    cy.visit('/')
    cy.selectBoard('Test board 1')
    cy.wait(500)
    cy.createCard('Doing', 'Card name 2')
    cy.wait(500)
    cy.addCardDescription('Card name 2', 'Testing card description')
  }); 

  it.skip("Adds a predefined color Label to a Card", () => {
    cy.visit('/')
    cy.selectBoard('Test board 1')
    cy.addCardLabel('Card name 2', 'purple')
  }); 

  it.skip("Adds a link as an Attachment and asserts the link", () => {
    cy.visit('/')
    cy.selectBoard('Test board 1')
    cy.addCardLink('Card name 2', 'https://www.netcentric.biz/', 'NC link title')
    cy.wait(500)
    // Asserts the attached link
    cy.get('.attachment-thumbnail-details-title-action').should('have.attr', 'href', 'https://www.netcentric.biz/')
  }); 

  after('Close all boards', () => {
    cy.clearCookies()
    cy.loginToTrelloUi(userName, password)
    cy.visit('/')
    cy.get('.boards-page-board-section-header-options').contains('Boards').click()
    cy.get('[data-testid="collapsible-list-items"]').last().find('[role="menu"]').each( (button) => {
    cy.wrap(button).find('button').click({force: true})
    cy.get('[title="Close board"]').click()
    cy.get('[title="Close"]').click()
    })
  });

}); 


