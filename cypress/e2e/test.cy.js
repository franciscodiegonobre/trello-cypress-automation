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

  it.only("Creates a Card in a List", () => {
    cy.visit('/')
    cy.selectBoard('Test board 1')
    cy.createCard('Done', 'Card name 1')
    cy.wait(500)
    cy.editCard('Card name 1')
    })
  }); 

  // cy.get('.editable').find('#ak-editor-textarea').then( input => {
  //   cy.wrap(input).click({force: true})
  //   cy.wrap(input).type('Card description')
  //   cy.get('.confirm').click()
  // })

// Create an After test to delete all boards
// cy.contains('[data-testid="collapsible-list"]', 'Your boards ').find('[data-testid="OverflowMenuHorizontalIcon"]')

