describe("API Tests", () => {
  const apiKey = Cypress.env("apiKey");
  const apiToken = Cypress.env("apiToken");
  const apiUrl = "https://api.trello.com/1";
  let boardId;
  let listId;
  let cardId;

  it("Creates a new board", () => {
    const boardName = "APITestBoard";
    cy.request(
      "POST",
      `${apiUrl}/boards/?name=${boardName}&key=${apiKey}&token=${apiToken}`
    ).then((response) => {
      expect(response.status).to.eq(200);
      // Asserts that ID is present
      expect(response.body).to.have.property("id");
      // Asserts that the board name is correctly configured
      expect(response.body).to.have.property("name", boardName);
      // Asserts that the board is not closed when created
      expect(response.body.closed).to.be.false;
      boardId = response.body.id;
    });
  });

  it("Creates a new list on the board", () => {
    const listName = "TestList";
    cy.request(
      "POST",
      `${apiUrl}/lists?name=${listName}&idBoard=${boardId}&key=${apiKey}&token=${apiToken}`
    ).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id");
      listId = response.body.id;
    });
  });

  it("Gets lists from the board", () => {
    cy.request(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${apiToken}`
    ).then((response) => {
      // Assert the status code
      expect(response.status).to.eq(200);
      // Assert the number of lists: 3 created by default + 1 created in the previous test
      expect(response.body).to.have.lengthOf(4);
      // Print the data
      console.log(response);
    });
  });

  it("Creates a new card on the list", () => {
    const cardName = "API Test Card";
    const dueDate = "12/12/2024";
    cy.request(
      "POST",
      `${apiUrl}/cards?idList=${listId}&key=${apiKey}&token=${apiToken}`,
      {
        name: cardName,
        due: dueDate,
      }
    ).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id");
      // Asserts that the card name is correctly configured
      expect(response.body).to.have.property("name", "API Test Card");
      // Asserts the due date
      expect(response.body.due).to.include("2024-12-12");
      cardId = response.body.id;
    });
  });

  it("Updates the previous card with Name and Start date", () => {
    let todayDate = new Date();
    let formattedDate = todayDate.toISOString().split("T")[0];
    cy.request(
      "PUT",
      `${apiUrl}/cards/${cardId}?key=${apiKey}&token=${apiToken}`,
      {
        name: "Updated API Test Card",
        start: formattedDate,
      }
    ).then((response) => {
      expect(response.status).to.eq(200);
      // Asserts the updated name
      expect(response.body).to.have.property("name", "Updated API Test Card");
      // Asserts the start date to be today
      expect(response.body.start).to.include(formattedDate);
    });
  });

  it("Adds a Comment to a card", () => {
    const comment = "API comment inserted";
    cy.request(
      "POST",
      `${apiUrl}/cards/${cardId}/actions/comments?key=${apiKey}&token=${apiToken}`,
      {
        text: comment,
      }
    ).then((response) => {
      expect(response.status).to.eq(200);
      // Asserts the comment
      expect(response.body.data).to.have.property("text", comment);
    });
  });

  it("Deletes the card and gets the list of 0 cards for that board", () => {
    // Deletes the card
    cy.request(
      "DELETE",
      `${apiUrl}/cards/${cardId}?key=${apiKey}&token=${apiToken}`
    ).then((response) => {
      expect(response.status).to.eq(200);
    });
    // Verifies that there aren't any cards in the board
    cy.request(
      `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${apiToken}`
    ).then((response) => {
      // Assert the status code
      expect(response.status).to.eq(200);
      // Verifies that there is 0 cards in the board after deletion
      expect(response.body).to.have.lengthOf(0);
    });
  });

  it("Deletes the board", () => {
    cy.request(
      "DELETE",
      `${apiUrl}/boards/${boardId}?key=${apiKey}&token=${apiToken}`
    ).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
