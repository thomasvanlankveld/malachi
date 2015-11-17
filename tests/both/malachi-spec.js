describe('Malachi', () => {

  let dispatcher;

  beforeEach(() => {
    dispatcher = malachi();
  });

  it('should create a dispatcher', () => {
    expect(dispatcher).toBeDefined();
  });

  describe('dispatcher', () => {

    it('should only expose the properties "fire" and "on"', () => {
      const keys = [];
      for (const key in dispatcher) keys.push(key);

      expect(keys).toContain('fire');
      expect(keys).toContain('on');
      expect(keys.length).toBe(2);
    });

    it('after registering, should still only expose the properties "fire" and "on"', () => {
      function signature() {}
      function handler() {}

      dispatcher.on(signature, handler);

      const keys = [];
      for (const key in dispatcher) keys.push(key);

      expect(keys).toContain('fire');
      expect(keys).toContain('on');
      expect(keys.length).toBe(2);
    });

    it('after firing, should still only expose the properties "fire" and "on"', () => {
      function signature() {}
      function handler() {}

      dispatcher.on(signature, handler);
      dispatcher.fire(signature, {});

      const keys = [];
      for (const key in dispatcher) keys.push(key);

      expect(keys).toContain('fire');
      expect(keys).toContain('on');
      expect(keys.length).toBe(2);
    });

    describe('on()', () => {

      it('should throw an error if the first argument is not a function', () => {
        const withoutArguments = () => {
          dispatcher.on();
        };
        const withString = () => {
          dispatcher.on("signature");
        };
        const withObject = () => {
          dispatcher.on({});
        };
        const withArray = () => {
          dispatcher.on([]);
        };

        expect(withoutArguments).toThrow();
        expect(withString).toThrow();
        expect(withObject).toThrow();
        expect(withArray).toThrow();
      });

      it('should throw an error if the first argument is not a named function', () => {
        const withUnnamedFunction = () => {
          const fun = () => {};
          dispatcher.on(fun);
        };

        expect(withUnnamedFunction).toThrow();
      });

      it('should throw an error if the second argument is not a function', () => {
        function fun() {}

        const withoutArguments = () => {
          dispatcher.on(fun);
        };
        const withString = () => {
          dispatcher.on(fun, "text");
        };
        const withObject = () => {
          dispatcher.on(fun, {});
        };
        const withArray = () => {
          dispatcher.on(fun, []);
        };

        expect(withoutArguments).toThrow();
        expect(withString).toThrow();
        expect(withObject).toThrow();
        expect(withArray).toThrow();
      });

      it('should not call the functions on registering', () => {
        const signatures = {
          first: function first() { fail() },
          second: function second() { fail() }
        };

        const handlers = {
          first() { fail() },
          second() { fail() },
          third() { fail() }
        };

        dispatcher.on(signatures.first, handlers.first);
        dispatcher.on(signatures.second, handlers.second);
        dispatcher.on(signatures.second, handlers.third);
      });

      it('should return the dispatcher instance (for chaining)', () => {
        function signature() {}
        function handler() {}

        const returned = dispatcher.on(signature, handler);

        expect(returned).toBe(dispatcher);
      });

    });

    describe('fire()', () => {

      it('should throw an error if the first argument is not a function', () => {
        const withoutArguments = () => {
          dispatcher.fire();
        };
        const withString = () => {
          dispatcher.fire("signature");
        };
        const withObject = () => {
          dispatcher.fire({});
        };
        const withArray = () => {
          dispatcher.fire([]);
        };

        expect(withoutArguments).toThrow();
        expect(withString).toThrow();
        expect(withObject).toThrow();
        expect(withArray).toThrow();
      });

      it('should throw an error if the first argument is not a named function', () => {
        const withUnnamedFunction = () => {
          const fun = () => {};
          dispatcher.fire(fun);
        };

        expect(withUnnamedFunction).toThrow();
      });

      it('should throw an error if no handlers are registered for the signature', () => {
        function signature() {}

        const fireUnhandled = () => {
          dispatcher.fire(signature);
        };

        expect(fireUnhandled).toThrow();
      });

      it('should call a handler registered for the given signature', () => {
        function signature() {}

        const obj = {
          handler() {}
        };

        spyOn(obj, 'handler');

        dispatcher.on(signature, obj.handler);
        dispatcher.fire(signature);

        expect(obj.handler).toHaveBeenCalled();
      });

      it('should call multiple handlers registered for the given signature', () => {
        function signature() {}

        const handlers = {
          first() {},
          second() {},
          third() {}
        };

        spyOn(handlers, 'first');
        spyOn(handlers, 'second');
        spyOn(handlers, 'third');

        dispatcher.on(signature, handlers.first);
        dispatcher.on(signature, handlers.second);
        dispatcher.on(signature, handlers.third);

        dispatcher.fire(signature);

        expect(handlers.first).toHaveBeenCalled();
        expect(handlers.second).toHaveBeenCalled();
        expect(handlers.third).toHaveBeenCalled();
      });

      it('should only call handlers registered for the given signature', () => {
        const signatures = {
          first: function first() {},
          second: function second() {}
        };

        const handlers = {
          first() { fail() },
          second() { fail() },
          third() {},
          fourth() {}
        };

        dispatcher.on(signatures.first, handlers.first);
        dispatcher.on(signatures.first, handlers.second);
        dispatcher.on(signatures.first, handlers.third);
        dispatcher.on(signatures.second, handlers.third);
        dispatcher.on(signatures.second, handlers.fourth);

        dispatcher.fire(signatures.second);
      });

      it('should pass the event data to all called handlers', () => {
        function signature() {}

        const handlers = {
          first() {},
          second() {},
          third() {}
        };

        spyOn(handlers, 'first');
        spyOn(handlers, 'second');
        spyOn(handlers, 'third');

        dispatcher.on(signature, handlers.first);
        dispatcher.on(signature, handlers.second);
        dispatcher.on(signature, handlers.third);

        const event = {
          time: new Date(),
          comment: 'This is happening'
        };

        dispatcher.fire(signature, event);

        expect(handlers.first).toHaveBeenCalledWith(event);
        expect(handlers.second).toHaveBeenCalledWith(event);
        expect(handlers.third).toHaveBeenCalledWith(event);
      });

    });

  });
});
