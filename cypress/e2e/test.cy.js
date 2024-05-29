/// <reference types="cypress" />
import selectors from "../fixtures/selectors.json";

const userName = "franciscodiegonobre@gmail.com";
const password = "automationpwd123";

describe("First test suite", () => {

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

  it("Creates a Card in a List, adds a Description and a color Label", () => {
    cy.visit('/')
    cy.reload(true)
    cy.selectBoard('Test board 1')
    cy.wait(500)
    cy.createCard('Doing', 'Card name 2')
    cy.wait(500)
    cy.addCardDescription('Card name 2', 'Testing card description')
    // Closes the card dialog
    cy.get(selectors.card.closeDialog).click()
    // Adds a predefined color Label to a Card
    cy.addCardLabel('Card name 2', 'purple')
  }); 

  it("Adds a link as an Attachment and asserts the link", () => {
    cy.visit('/')
    cy.selectBoard('Test board 1')
    cy.addCardLink('Card name 2', 'https://www.netcentric.biz/', 'NC link title')
    cy.wait(500)
    // Asserts the attached link
    cy.get(selectors.card.attachedLink).should('have.attr', 'href', 'https://www.netcentric.biz/')
  }); 

  after('Close all boards', () => {
    cy.clearCookies()
    cy.loginToTrelloUi(userName, password)
    cy.visit('/')
    cy.get(selectors.board.boardsPageButton).contains('Boards').click()
    cy.get(selectors.board.boardsList).last().find(selectors.board.boardItem).each( (button) => {
    cy.wrap(button).find('button').click({force: true})
    cy.get(selectors.board.closeBoard).click()
    cy.get(selectors.board.closeBoardFinal).click()
    })
  });

}); 


