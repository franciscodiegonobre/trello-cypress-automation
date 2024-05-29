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

Cypress.Commands.add("createBoard", (boardName) => {
  cy.get(selectors.header.navHeader).find("p", "Create").click();
  cy.wait(500)
  cy.get(selectors.header.createBoardButton).click();
  cy.get(selectors.header.createBoardTitleInput).type(boardName);
  cy.get(selectors.header.createBoardSubmitButton).click();
  cy.get(selectors.board.nameDisplay).should("have.text", boardName);
});

Cypress.Commands.add("selectBoard", (boardName) => {
    cy.get(`[title='${boardName}']`).click()
    cy.wait(500)
    cy.get(selectors.board.nameDisplay).should("have.text", boardName);
});

Cypress.Commands.add("createList", (listName) => {
    cy.get('[data-testid="list-composer-button-container"]').find('button').click()
    cy.get('[name="Enter list title…"]').type(listName)
    cy.contains('Add list').click()
    cy.wait(500)
    cy.get(`[aria-label='${listName}']`).should('exist')
    cy.reload(true)
});

Cypress.Commands.add("createCard", (listName, cardName) => {
    cy.contains('li', listName).find('[data-testid="list-add-card-button"]').then(cardList => {
        cy.wrap(cardList).click()
        cy.get('form').find('textarea').type(cardName)
        cy.contains('Add card').click()
      }
    )
    cy.contains('li', listName).find('[data-testid="card-name"]').should('have.text', cardName)
});

Cypress.Commands.add("editCard", (cardName) => {
    cy.contains('[data-testid="card-name"]', cardName).click()
    cy.wait(500)
    cy.get('#js-dialog-title').should('have.text', cardName)
    //cy.get('.window-title').find('h2').should('have.text', cardName)
});

Cypress.Commands.add("addCardDescription", (cardName, cardDescription) => {
  cy.editCard(cardName)
  cy.get('.editable').find('#ak-editor-textarea').then( input => {
  cy.wrap(input).click({force: true})
  cy.wrap(input).type(cardDescription)
  cy.get('.confirm').click()
  cy.get('[attr="desc"]').find('p').should('contain', cardDescription)
  })
});

// Selects a predefined color Label among: 'green', 'yellow', 'orange', 'red', 'purple', 'blue'
Cypress.Commands.add("addCardLabel", (cardName, cardLabelColor) => {
  cy.editCard(cardName)
    cy.get('[title="Labels"]').click()
    cy.get(`[data-color='${cardLabelColor}']`).then( labelColor => {
      cy.wrap(labelColor).click()
      cy.wrap(labelColor).parent().find('button').click()
      cy.get('[data-testid="popover-close"]').click()
      cy.get('[data-testid="card-back-labels-container"]').find('span').should('have.attr', 'data-color', cardLabelColor)
    })
});

// Adds a link as an Attachment: pass the link url and the link title
Cypress.Commands.add("addCardLink", (cardName, cardLink, cardLinkTitle) => {
  cy.editCard(cardName)
  cy.get('[data-testid="card-back-attachment-button"]').click()
  cy.wait(500)
  cy.get('[data-testid="link-picker"]').find('input').first().type(cardLink, { delay: 200 })
  cy.get('[data-testid="link-picker"]').find('input').last().type(cardLinkTitle)
  cy.get('[data-testid="link-picker"]').submit()
  cy.get('.attachment-thumbnail').then( attachment => {
    expect(attachment).to.be.visible
  })
});

  Cypress.Commands.add("moveList", (listName, newBoard) => {
    // Selects the right list
    cy.contains(listName).parent().siblings().click()
    cy.get('[data-testid="list-actions-move-list-button"]').click()
    cy.wait(1000)
    // Types and selects the new list
    cy.get('[data-testid="list-actions-move-list-popover"]').find('input').first().type(`${newBoard}{enter}`)
    cy.get('[data-testid="list-actions-move-list-popover"]').contains('button', 'Move').click()
    // Asserts that the list is not in the current board anymore
    cy.get('[data-testid="lists"]').should('not.contain', listName)
    // Asserts that the list exists (has been moved) to another board
    // cy.get('[data-testid="boards-list-show-more-button"]').click()
    cy.get(`[aria-label='${newBoard}']`).click()
    cy.get('[data-testid="lists"]').should('contain', listName)
  })

// cy.wrap('[data-testid="card-name"]').should('have.text', cardName)

// Cypress.Commands.add("loginToTrelloApi", () => {
//   cy.request({
//     method: "GET",
//     url: "https://api.trello.com/1/members/me",
//     qs: {
//       key: "b0ca80be29645698f9fea4abf367c349",
//       token:
//         "ATTA242c79bdfc9ea8b0e9d97a7f92f05760951c6dc84bfa98a8e6101746c12a0a9590F7D629",
//     },
//   }).then((response) => {
//     expect(response.status).to.eq(200);
//     cy.log("Logged in as: " + response.body.fullName);
//   });
// });

//   Cypress.Commands.add("loginToTrelloHeadless", () => {
//     cy.request({
//         method: 'GET',
//         url: 'https://api.trello.com/1/authorize/',
//         body: {
//           key: 'b0ca80be29645698f9fea4abf367c349',
//           token: 'ATTA242c79bdfc9ea8b0e9d97a7f92f05760951c6dc84bfa98a8e6101746c12a0a9590F7D629',
//           response_type: 'token'
//         }
//       }).then((response) => {
//         const { apiKey, token } = response.body;
//         cy.setCookie('token', token);
//         cy.setCookie('apiKey', apiKey);
//       });
//   });
