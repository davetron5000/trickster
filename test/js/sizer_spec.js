describe("Sizer",function() {
  var originalJQuery = $;
  afterEach(function() {
    $ = originalJQuery;
  });
  /** Returns an element that will behavior more or less like the jquery element
   * that we'd use in the browser */
  function makeElement(initialWidth,initialHeight,cssClass) {
    return {
      w           : initialWidth,
      h           : initialHeight,
      0           : {
        scrollWidth: this.w,
        scrollHeight: this.h,
      },
      findInternal: function() {
        return {
          length: 0,
          each: function() {}
        };
      },
      find        : function() { return this.findInternal(); },
      fontSizes   : [16],
      marginTops  : [0],
      hasClass    : function(classToCheck) {
        if (cssClass) {
          return classToCheck == cssClass;
        }
        else {
          return false;
        }
      },
      cssInternal : function(cssAttribute,value) {
        if (cssAttribute == "font-size") {
          if (value) {
            this.fontSizes.push(value);
            this.w = initialWidth * parseInt(value);
            this.h = initialHeight * parseInt(value);
          }
          else {
            return this.fontSizes[this.fontSizes.length - 1] + "px";
          }
        }
        else if ( (cssAttribute == "margin-top") && value) {
          this.marginTops.push(value);
        }
      },
      css         : function(cssAttribute, value) { return this.cssInternal(cssAttribute,value); },
      width       : function() { return this.w; },
      height      : function() { return this.h; }
    };
  }
  var sizeFunction = Sizer.sizeFunction(1024,768);

  describe("non code/commandline slide",function() {
    it("resizes a square object",function() {
      var element = makeElement(10,10);

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(4);
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(38);
    });

    it("resizes a tall object",function() {
      var element = makeElement(10,100);

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(3); // hits max early
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(26);
    });

    it("resizes a wide object",function() {
      var element = makeElement(100,10);

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(4);
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(38);
    });
  });
  describe("BULLETS slide",function() {
    it("resizes a square object",function() {
      var element = makeElement(10,10,"BULLETS");

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(4);
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(76);
    });

    it("resizes a tall object",function() {
      var element = makeElement(10,100,"BULLETS");

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(3); // hits max early
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(26);
    });

    it("resizes a wide object",function() {
      var element = makeElement(100,10,"BULLETS");

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(4);
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(76);
    });
  });
  describe("CODE slide",function() {
    it("shrinks if it there was word-wrapping",function() {
      $ = function(element) {
        if (typeof(element) == "number") {
          return {
            height: function() { return element; }
          };
        }
        else {
          return {};
        }
      };

      var element = makeElement(200,80,"CODE");

      var calls = 0;
      var callsUntilWrappingStops = 10;
      element["find"] = function(selector) {
        if (selector == ".line") {
          return {
            length: 4,
            each: function(f) {
              if (calls < callsUntilWrappingStops) {
                f(0,12);
                f(1,12);
                f(2,24);
                f(3,12);
              }
              else {
                f(0,12);
                f(1,12);
                f(2,12);
                f(3,12);
              }
              calls = calls + 1;
            }
          };
        }
        else {
          return this.findInternal();
        }
      };
      element["css"] = function(cssAttribute,value) {
        if ((cssAttribute == "font-size") && value) {
          this.fontSizes.push(value);
          this.w = 10 * parseInt(value);
          this.h = parseInt(value) + this.fontSizes.length;
        }
        else {
          return this.cssInternal(cssAttribute,value);
        }
      }

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(25 - callsUntilWrappingStops);
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(666);
      expect(element.marginTops[element.marginTops.length - 1]).toBe(-666);
    });
    it("resizes a square object",function() {
      var element = makeElement(10,10,"CODE");

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(4);
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(76);
      expect(element.marginTops[element.marginTops.length - 1]).toBe(-76);
    });

    it("resizes a tall object",function() {
      var element = makeElement(10,100,"CODE");

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(3); // hits max early
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(26);
      expect(element.marginTops[element.marginTops.length - 1]).toBe(-26);
    });

    it("resizes a wide object",function() {
      var element = makeElement(100,10,"CODE");

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(4);
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(76);
      expect(element.marginTops[element.marginTops.length - 1]).toBe(-76);
    });
  });
  describe("COMMANDLINE slide",function() {
    it("resizes sets display inline before resizing, then restoring it back to display none",function() {
      var element = makeElement(10,10,"COMMANDLINE");
      element["displays"] = [];
      element["css"] = function(cssAttribute,value) {
        if ( (cssAttribute == "display") && value) {
          this.displays.push(value);
        }
        else {
          return this.cssInternal(cssAttribute,value);
        }
      };
      element["find"] = function(selector) {
        if (selector == ".cli-element") {
          return {
            length: 1,
            each: function(f) {
              f(0,element);
            }
          };
        }
        else {
          return this.findInternal();
        }
      };
      $ = function(elt) {
        if (elt == element) {
          return element;
        }
        else {
          return {};
        }
      };

      sizeFunction(element);

      expect(element.fontSizes.length).toBe(4);
      expect(element.displays.length).toBe(6);
      expect(element.displays[0]).toBe("inline");
      expect(element.displays[1]).toBe("none");
      expect(element.displays[5]).toBe("none");
      expect(element.fontSizes[element.fontSizes.length - 1]).toBe(76);
      expect(element.marginTops[element.marginTops.length - 1]).toBe(-76);
    });
  });
});
