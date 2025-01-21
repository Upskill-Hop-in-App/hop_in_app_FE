declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in a user
     * @param email - The user's email
     * @param password - The user's password
     */
    login(email: string, password: string): Chainable<void>;
    /**
     * Custom command to log in a user
     * @param email - The user's email
     * @param name - The user's name
     * @param username - The user's username
     * @param contact - The user's contact
     * @param password - The user's password
     */
    register(
      email: string,
      name: string,
      username: string,
      contact: string,
      password: string,
    ): Chainable<void>;
  }
}
