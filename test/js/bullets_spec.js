describe("Bullets",function() {
  var originalJQuery = $;
  afterEach(function() {
    $ = originalJQuery;
  });
  function makeCurrentSlideFunction(size) {
    return function() {
      return {
        children: function() {
          return {
            find: function() {
              return {
                size: function() { return size; }
              };
            }
          };
        }
      };
    };
  }
  it("initially has bullets to advance if there is at least one bulleted item",function() {
    var bullets = TricksterBullets(makeCurrentSlideFunction(1),{});

    expect(bullets.hasBulletsToAdvanceFirst()).toBe(true);
  });
  it("initially has NO bullets to advance if there are no bulleted items",function() {
    var bullets = TricksterBullets(makeCurrentSlideFunction(0),{});

    expect(bullets.hasBulletsToAdvanceFirst()).toBe(false);
  });

  describe("LI bullets",function() {
    it("sets the next LI to be visible when we advance",function() {
      var visible = "none";
      var advanced = false;
      var currentSlide = function() {
        return {
          children: function() {
            return {
              find: function(selector) {
                return {
                  eq: function(index) {
                    if (index == 0) {
                      return {
                        0: {
                          tagName: "LI"
                        },
                        css: function(cssAttribute,value) {
                          if ( (cssAttribute == "visibility")  && value ) {
                            visible = value;
                            advanced = visible == "visible";
                          }
                        }
                      };
                    }
                    else {
                      return {};
                    }
                  },
                  size: function() {
                    if (advanced) {
                      return 0;
                    }
                    else {
                      return 1;
                    }
                  }
                };
              },
            };
          }
        };
      };
      var bullets = TricksterBullets(currentSlide,{});

      bullets.advanceToNextBullet();

      expect(bullets.hasBulletsToAdvanceFirst()).toBe(false);
      expect(visible).toBe("visible");
    });
  });
});
