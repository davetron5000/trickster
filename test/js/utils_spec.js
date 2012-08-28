describe("Utils",function() {
  describe("fOr",function() {
    it("uses the first function if it's defined",function() {
      // Given
      var called = false;
      var realFunction = function() {
        called = true;
      };
      var otherCalled = false;
      var otherFunction = function() {
        otherCalled = true;
      };

      // When
      Utils.fOr(realFunction,otherFunction)();

      expect(called).toBe(true);
      expect(otherCalled).toBe(false);
    });
    it("uses the other function if the first one is not defined",function() {
      // Given
      var otherCalled = false;
      var otherFunction = function() {
        otherCalled = true;
      };

      // When
      Utils.fOr(undefined,otherFunction)();

      expect(otherCalled).toBe(true);
    });
  });
  describe("f",function() {
    it("uses the real funciton passed",function() {
      // Given
      var returnValue = 42;
      var realFunction = function() {
        return returnValue;
      };

      // When
      var func = Utils.f(realFunction);

      // Then
      expect(func()).toBe(returnValue);
    });

    it("uses a no-op function if none passed",function() {
      // When
      var func = Utils.f();

      // Then
      expect(func()).toBe(undefined);
    });
  });
}); 
