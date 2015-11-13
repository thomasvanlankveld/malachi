
/**
 * Event dispatcher factory
 *
 * Although you should generally avoid multiple dispatchers in the same
 * project, it may be useful in case there are multiple bounded contexts
 * within the same project.
 *
 * @returns {function} The dispatcher factory
 */
malachi = (function(_){

  /**
   * Get the name of an event signature
   *
   * @param {function} signature
   * @returns {string}
   */
  function nameOf(signature) {
    if(typeof signature !== "function") {
      throw new TypeError("Event signature must be a function");
    }
    let name = signature.toString();
    name = name.substr('function '.length);
    name = name.substr(0, name.indexOf('('));
    if(name === "") {
      throw new Error("Event signature must be a named function");
    }
    return name;
  }

  /**
   * Factory returning a dispatcher instance
   *
   * @returns {object}
   */
  return function() {

    /**
     * A map of event signatures and their registered handlers
     *
     * @type {object}
     */
    const handlers = {};

    return {

      /**
       * Register a handler to an event signature
       *
       * Multiple handlers can be registered to the same signature. Returns
       * the dispatcher instance for chaining.
       *
       * @param signature
       * @param handler
       * @returns {object}
       */
      on(signature, handler) {
        type = nameOf(signature);
        if(typeof handlers[type] === "undefined") {
          handlers[type] = [];
        }
        handlers[type].push(handler);
        return this;
      },

      /**
       * Fire an event
       *
       * Calls all handlers registered to the event signature with this event's
       * data.
       *
       * @param signature
       * @param event
       */
      fire(signature, event) {
        const type = nameOf(signature);
        for (const handler of handlers[type]) {
          handler(event);
        }
      }
    };
  }
}(_));
