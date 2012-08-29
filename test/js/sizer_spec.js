describe("Sizer",function() {
  var makeObject = function(maxWidth,maxHeight,cssFunc) {
    return {
      _width:  10,
      _height: 10,
      width:   function() { return this._width; },
      height:  function() { return this._height; },
      css:     cssFunc,
      text:    function() { return "foo bar"; },
      hasClass: function() { return false; }
    };
  };
  it("resizes a wide object",function() {
    var maxWidth        = 2000;
    var maxHeight       = 1500;
    var object = makeObject(maxWidth,maxHeight,function(attribute,value) {
      if (attribute == "font-size") {
        // Grows larger in width than in height
        this._width  = 4 * value;
        this._height = 2 * value;
      }
    });
    var initialFontSize = 12;
    var sizeToFit = Sizer.sizeFunction(maxWidth,maxHeight,initialFontSize,0);

    sizeToFit(object);

    expect(object.width()).toBeLessThan(maxWidth + 1);
    expect(object.height()).toBeLessThan(maxHeight + 1);
    expect(object.width()).toBeGreaterThan(maxWidth - 100);
  });
  it("resizes a narrow object",function() {
    var maxWidth        = 2000;
    var maxHeight       = 1500;
    var object = makeObject(maxWidth,maxHeight,function(attribute,value) {
      if (attribute == "font-size") {
        // Grows larger in height than in width
        this._width  = 2 * value;
        this._height = 4 * value;
      }
    });
    var initialFontSize = 12;
    var sizeToFit = Sizer.sizeFunction(maxWidth,maxHeight,initialFontSize,0);

    sizeToFit(object);

    expect(object.width()).toBeLessThan(maxWidth + 1);
    expect(object.height()).toBeLessThan(maxHeight + 1);
  });
  it("resizes an object that quickly gets wide enough and slowly gets tall enough",function() {
    var maxWidth        = 2000;
    var maxHeight       = 1500;
    var object = makeObject(maxWidth,maxHeight,function(attribute,value) {
      if (attribute == "font-size") {
        // Grows quickly and closely in width, slowly in height
        this._width  = (Math.round(maxWidth - Math.log(maxWidth) + Math.log(value)));
        this._height = 2 * value;
      }
    });
    var initialFontSize = 12;
    var sizeToFit = Sizer.sizeFunction(maxWidth,maxHeight,initialFontSize,0);

    sizeToFit(object);

    expect(object.width()).toBeLessThan(maxWidth + 1);
    expect(object.height()).toBeLessThan(maxHeight + 1);
    expect(object.width()).toBeGreaterThan(maxWidth - 20);
    expect(object.height()).toBeGreaterThan(maxHeight - 20);
  });
  it("resizes an object that quickly gets tall enough and slowly gets wide enough",function() {
    var maxWidth        = 2000;
    var maxHeight       = 1500;
    var object = makeObject(maxWidth,maxHeight,function(attribute,value) {
      if (attribute == "font-size") {
        // Grows quickly and closely in height, slowly in width
        this._width = 2 * value;
        this._height  = (Math.round(maxHeight - Math.log(maxHeight) + Math.log(value)));
      }
    });
    var initialFontSize = 12;
    var sizeToFit = Sizer.sizeFunction(maxWidth,maxHeight,initialFontSize,0);

    sizeToFit(object);

    expect(object.width()).toBeLessThan(maxWidth + 1);
    expect(object.height()).toBeLessThan(maxHeight + 1);
    expect(object.width()).toBeGreaterThan(maxWidth - 200);
    expect(object.height()).toBeGreaterThan(maxHeight - 20);
  });
});
