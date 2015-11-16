describe('Malachi', () => {

  let dispatcher;

  beforeAll(() => {
    dispatcher = malachi();
  });

  it('should create a dispatcher', () => {
    expect(dispatcher).toBeDefined();
  });

  describe('dispatcher', () => {

    //it('should expose a method fire()', () => {
    //  dispatcher.fire();
    //});
    //
    //it('should expose a method on()', () => {
    //  dispatcher.on();
    //});
  });
});
