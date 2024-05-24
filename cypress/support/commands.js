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
    cy.get(selectors.board.nameDisplay).should("have.text", boardName);
});

Cypress.Commands.add("createList", (listName) => {
    cy.get('[data-testid="list-composer-button-container"]').find('button').click()
    cy.get('[name="Enter list title…"]').type(listName)
    cy.contains('Add list').click()
    cy.get(`[aria-label='${listName}']`).should('exist')
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
});

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
