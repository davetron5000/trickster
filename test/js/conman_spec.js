describe("conman",function() {
  beforeEach(function() {
    document.location.hash = "";
    jqueryMock = function() {
      var keyupCalled = false;
      var fadeInArgs = null;
      return {
        jquery: function(args) {
          if (args == "section") {
            return {
              length: 3,
              each: function(args) {
              },
              eq: function(index) {
                return {
                  fadeIn: function(args) {
                    fadeInArgs = args;
                  }
                };
              }
            };
          }
          else if (args == window) {
            return {
              keyup: function(args) {
                keyupCalled = true
              },
              width: function() {
                return 10;
              },
              height: function() {
                return 20;
              }
            };
          }
          else {
            return null;
          }
        },
        keyupCalled: function() {
          return keyupCalled;
        },
        fadeInArgs: function() {
          return fadeInArgs;
        }
      };
    }();

    hljs = function() {
      var initHighlightingOnLoadCalled = false;
      return {
        initHighlightingOnLoad: function() {
          initHighlightingOnLoadCalled = true;
        },
        initHighlightingOnLoadCalled: function() {
          return initHighlightingOnLoadCalled;
        }
      };
    }();
    Conman = ConmanLoader(jqueryMock.jquery,hljs,ConmanDefaultConfig);
  });
  it("has a reasonable initial state", function() {
    expect(Conman.currentSlide).toBe(0);
    expect(Conman.currentBullet).toBe(0);
    expect(Conman.totalSlides).toBe(1);
  });

  it("does proper setup on load",function() {

    document.location.hash = "#5";

    Conman.load();
    expect(Conman.totalSlides).toBe(3);
    expect(Conman.currentSlide).toBe(5);
    expect(hljs.initHighlightingOnLoadCalled()).toBe(true);
    expect(jqueryMock.keyupCalled()).toBe(true);
    expect(jqueryMock.fadeInArgs()).toBe(ConmanDefaultConfig.transitionTime / 2);
  });
});
