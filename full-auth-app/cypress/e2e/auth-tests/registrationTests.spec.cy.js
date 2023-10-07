import { generateRandomTestData } from '../../support/randomData';
let apiActivationURL;
let uiActivationURL;

describe('Register User API', () => {
    it('should register a new user', () => {
        // Generate random test data
        const testData = generateRandomTestData();
        // Send a POST request to the register endpoint
        // Here we can add more tests to test the APIs responses in different scenarios
        cy.request('POST', 'http://localhost:5000/api/users/register', testData)
            .then((response) => {
                // Assertions
                expect(response.status).to.eq(201);
                expect(response.body.activationURL).to.exist;
                apiActivationURL = response.body.activationURL;
            });
        it('should activate a new user', () => {
            // Visit the activation URL intercepted by the API post request
            cy.visit(apiActivationURL);
            cy.url().should('contain', '/home');
            cy.get('.MuiTypography-root').should('contain.text', 'You are logged in!');
        })
    });
});

describe('Register user via UI', () => {
    it('should register a new user via the UI', () => {
        const testData = generateRandomTestData();
        // Intercepting the post request from the BE
        cy.intercept('POST', 'http://127.0.0.1:5000/api/users/register',).as('registerUser');
        // Visiting the UI and complete registration with dummy data
        cy.visit('http://localhost:3000/sign-up');
        cy.get('#name').type(testData.name);
        cy.get('#username').type(testData.username);
        cy.get('#email').type(testData.email);
        cy.get('#password').type(testData.password);
        cy.get('[type="submit"]').click();
        // Waiting for the response from server and storing the activation URL for the next test
        cy.wait('@registerUser').then((interception) => {
            expect(interception.response.statusCode).to.eq(201);
            expect(interception.response.body.activationURL).to.exist;
            uiActivationURL = interception.response.body.activationURL;
        })
    });

    it('should activate a new user and login', () => {
        // Visit the activation URL created for the registered user to assert login page
        cy.visit(uiActivationURL);
        cy.url().should('contain', '/home');
        cy.get('.MuiTypography-root').should('contain.text', 'You are logged in!');
        cy.get('[type="button"]').contains('Logout').should('be.visible');
    })
});