declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in a user
     * @param email - The user's email
     * @param password - The user's password
     */
    login(email: string, password: string): Chainable<void>

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
      password: string
    ): Chainable<void>

    /**
     * Custom command get by data-cy
     * @param selector - The selector name inside data-cy prop
     * @param arg - The args
     */
    getByDataCy(
      selector: string,
      ...args: any[]
    ): Chainable<JQuery<HTMLElement>>

    /**
     * Command to logout
     */
    logout(): void

    /**
     * Custom command to wait for a specific time
     * @param time - The time to wait in milliseconds (default is 2000ms)
     */
    demoWait(time?: number): Chainable<void>

    /**
     * Custom command highlight element by data-cy
     * @param selector - The selector name inside data-cy prop
     */
    highlight(selector: string): Chainable<void>
  }
}
