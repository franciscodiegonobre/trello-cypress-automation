import selectors from "../fixtures/selectors.json";

Cypress.Commands.add("loginToTrelloUi", (username, password) => {
  //cy.session() is a Cypress command used to manage and reuse browser sessions across multiple tests. This feature helps to speed up tests by avoiding repetitive login actions
  cy.session([username, password], () => {
    const usernameFieldSelector = selectors.login.usernameField;
    const passwordFieldSelector = selectors.login.passwordField;
    const loginSubmitButtonSelector = selectors.login.loginSubmitButton;

    cy.visit("/");
    cy.get(selectors.login.loginHeaderButton).contains("Log in").click();
    // The cy.origin() command is used in Cypress to execute code in the context of a different origin (i.e., a different domain, subdomain, or protocol).
    // This is useful when dealing with cross-origin iframes or links. However, due to the nature of cross-origin policies, variables from the outer scope are not directly accessible inside the cy.origin() block.
    // They need to be explicitly passed.
    cy.origin(
      "https://id.atlassian.com",
      {
        args: {
          usernameFieldSelector,
          passwordFieldSelector,
          loginSubmitButtonSelector,
          username,
          password,
        },
      },
      ({
        usernameFieldSelector,
        passwordFieldSelector,
        loginSubmitButtonSelector,
        username,
        password,
      }) => {
        cy.get(usernameFieldSelector).type(username);
        cy.get(loginSubmitButtonSelector).click();
        cy.get(passwordFieldSelector).type(password);
        cy.get(loginSubmitButtonSelector).click();

        cy.wait(1000);
      }
    );
  });
});

// Creates a board with a board name as param
Cypress.Commands.add("createBoard", (boardName) => {
  cy.get(selectors.header.navHeader).find("p", "Create").click();
  cy.wait(500)
  cy.get(selectors.header.createBoardButton).click();
  cy.get(selectors.header.createBoardTitleInput).type(boardName);
  cy.get(selectors.header.createBoardSubmitButton).click();
  cy.get(selectors.board.nameDisplay).should("have.text", boardName);
});

// Selects a Board by Board name as param
Cypress.Commands.add("selectBoard", (boardName) => {
    cy.get(`[title='${boardName}']`).click()
    cy.wait(500)
    cy.get(selectors.board.nameDisplay).should("have.text", boardName);
});

// Creates a List with a list name as param
Cypress.Commands.add("createList", (listName) => {
    cy.get(selectors.list.listContainer).find('button').click()
    cy.get(selectors.list.listTitleInput).type(listName)
    cy.contains('Add list').click()
    cy.wait(500)
    cy.get(`[aria-label='${listName}']`).should('exist')
});

// Creates a Card with a Card name by selecting a List
Cypress.Commands.add("createCard", (listName, cardName) => {
    cy.contains('li', listName).find(selectors.card.addCardButton).then(cardList => {
        cy.wrap(cardList).click()
        cy.get('form').find('textarea').type(cardName)
        cy.contains('Add card').click()
      }
    )
    cy.contains('li', listName).find(selectors.card.cardName).should('have.text', cardName)
});

// Selects a card by Card name and opens its dialog
Cypress.Commands.add("editCard", (cardName) => {
    cy.contains(selectors.card.cardName, cardName).click()
    cy.wait(500)
    cy.get(selectors.card.cardNameDialog).should('have.text', cardName)
});

// Adds a Description to a Card
Cypress.Commands.add("addCardDescription", (cardName, cardDescription) => {
  cy.editCard(cardName)
  cy.get('.editable').find(selectors.card.cardDescription).then( input => {
  cy.wrap(input).click({force: true})
  cy.wrap(input).type(cardDescription)
  cy.get('.confirm').click()
  cy.get(selectors.card.cardDescriptionText).find('p').should('contain', cardDescription)
  })
});

// Selects a predefined color Label among: 'green', 'yellow', 'orange', 'red', 'purple', 'blue'
Cypress.Commands.add("addCardLabel", (cardName, cardLabelColor) => {
  cy.editCard(cardName)
    cy.get(selectors.card.cardLabelsButton).click()
    cy.get(`[data-color='${cardLabelColor}']`).then( labelColor => {
      cy.wrap(labelColor).click()
      cy.wrap(labelColor).parent().find('button').click()
      cy.get(selectors.card.cardLabelClose).click()
      cy.get(selectors.card.cardLabelIcon).find('span').should('have.attr', 'data-color', cardLabelColor)
    })
});

// Adds a link as an Attachment: pass the link url and the link title
Cypress.Commands.add("addCardLink", (cardName, cardLink, cardLinkTitle) => {
  cy.editCard(cardName)
  cy.get(selectors.card.cardAttachmentButton).click()
  cy.wait(500)
  cy.get(selectors.card.cardLinkPicker).find('input').first().type(cardLink, { delay: 100 })
  cy.get(selectors.card.cardLinkPicker).find('input').last().type(cardLinkTitle)
  cy.get(selectors.card.cardLinkPicker).submit()
  cy.get(selectors.card.cardAttachmentThumbnail).then( attachment => {
    expect(attachment).to.be.visible
  })
});

// Selects a list in a Board and moves it to another Board
  Cypress.Commands.add("moveList", (listName, newBoard) => {
    // Selects the right list
    cy.contains(listName).parent().siblings().click()
    cy.get(selectors.list.listMoveButton).click()
    cy.wait(1000)
    // Types and selects the new list
    cy.get(selectors.list.listMovePopover).find('input').first().type(`${newBoard}{enter}`)
    cy.get(selectors.list.listMovePopover).contains('button', 'Move').click()
    // Asserts that the list is not in the current board anymore
    cy.get(selectors.list.allLists).should('not.contain', listName)
    // Asserts that the list exists (has been moved) to another board
    cy.get(`[aria-label='${newBoard}']`).click()
    cy.get(selectors.list.allLists).should('contain', listName)
  })

