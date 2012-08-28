describe("Conman",function() {
  beforeEach(function() {
    document.location.hash = "";
  });
  it("has a reasonable initial state", function() {
    Conman = ConmanLoader(ConmanDefaultConfig,{});
    expect(Conman.currentSlide).toBe(0);
    expect(Conman.currentBullet).toBe(0);
    expect(Conman.totalSlides).toBe(1);
  });

  it("does proper setup on load",function() {
    var numSlides = 5;
    var initialSlide = 3;
    document.location.hash = "#" + initialSlide;

    var functions = function() {
      var calls = {}
      return {
        calls: calls,
        bindKeys: function(keyCodes,f) {
          if (!calls.bindKeys) {
            calls["bindKeys"] = [];
            calls["bindFuncs"] = [];
          }
          calls["bindKeys"].push(keyCodes);
          calls["bindFuncs"].push(f);
        },
        browserWindow: function() {
          return {
            width: 100,
            height: 200
          };
        },
        slides: function() {
          return {
            length: numSlides,
            eq: function() {
              return {
                fadeIn: function(args) { calls.fadeIn = args; }
              };
            },
            each: function(args) {}
          };
        },
        syntaxHighlighter: function () {
          return {
            highlight: function() {
              calls.highlight = true;
            }
          };
        }
      };
    }();

    Conman = ConmanLoader(ConmanDefaultConfig,functions);

    Conman.load();

    expect(Conman.totalSlides).toBe(numSlides);
    expect(Conman.currentSlide).toBe(initialSlide);
    expect(functions.calls.highlight).toBe(true);

    var advanceIndex = functions.calls.bindKeys.indexOf(ConmanDefaultConfig.advanceKeycodes);
    expect(advanceIndex).toNotBe(-1);
    expect(functions.calls.bindFuncs[advanceIndex]).toBe(Conman.advance);

    var backIndex = functions.calls.bindKeys.indexOf(ConmanDefaultConfig.backKeycodes);
    expect(backIndex).toNotBe(-1);
    expect(functions.calls.bindFuncs[backIndex]).toBe(Conman.back);

    expect(functions.calls.fadeIn).toBe(ConmanDefaultConfig.transitionTime / 2);
  });
});
