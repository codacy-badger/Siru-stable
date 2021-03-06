const { BaseEvent } = require('../structures')

class Event {
  constructor (client) {
    this.client = client
    this.name = 'debug'
    this.listener = (...args) => this.run(...args)
  }

  /**
   * Run Event
   * @param message {String} - Debug Message of Client
   */
  async run (message) {
    this.client.logger.debug(message)
  }
}
module.exports = Event
