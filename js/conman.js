var ConmanDefaultConfig = {
  /** Padding between max width and max font size */
  padding:          128,
  /** Don't make fonts bigger than this */
  maxFontSize:      500,
  /** Don't make fonts smaller than this */
  minFontSize:      30,
  /** Time, in ms, to transition between slides */
  transitionTime:   200,
  /** Keycodes that advacne to the next slide */
  advanceKeycodes: [74,  // j
                    39,  // right arrow
                    34,  // Kensington presenter right arrow
                    32], // space bar
  /** Keycodes that go back to the previous slide */
  backKeycodes:    [75,  // k
                    37,  // left arrow
                    33,  // Kensington presenter left arrow
                    8]   // delete
};
/** Loads Conman.
 * config: configuration, or ConmanDefaultConfig to get the defaults
 * functions: override helper functions
 */
var ConmanLoader = function(config,functions) {
  var slides = Utils.fOr(functions.slides,function() {
    return $("section");
  });
  var browserWindow = Utils.fOr(functions.browserWindow,function() {
    return {
      width: $(window).width(),
      height: $(window).height()
    };
  });
  var keyboardBindings = Utils.fOr(functions.keyboardBindings,function() {
    return $(window);
  });
  var syntaxHighlighter = Utils.fOr(functions.syntaxHighlighter,function() {
    return {
      highlight: function() {
        hljs.initHighlightingOnLoad();
      }
    }
  });
  var bindKeys = Utils.fOr(functions.bindKeys,function(keyCodes,f) {
    $(window).keyup(function(event) {
      if (keyCodes.indexOf(event.which) != -1) {
        f();
      }
    });
  });
  return {
    /** State */
    currentSlide:  0,
    totalSlides:   1,
    currentBullet: 0,

    /** Set everything up for the slideshow */
    load: function() {
      Conman.totalSlides = slides().length;
      Conman._initCurrentSlide();
      bindKeys(config.advanceKeycodes,Conman.advance);
      bindKeys(config.backKeycodes,Conman.back);
      Conman._sizeAllToFit();
      Conman._slide().fadeIn(config.transitionTime / 2);
      syntaxHighlighter().highlight();
    },

    /** Move forward one slide */
    advance: function() {
      var currentSlide = Conman._slide();
      if (Conman._advanceBullet()) {
        Conman._nextBullet().css("visibility","visible");
        Conman.currentBullet = Conman.currentBullet + 1;
      }
      else {
        var nextSlide = Conman.currentSlide + 1;
        if (nextSlide >= Conman.totalSlides) {
          nextSlide = 0;
        }
        Conman._changeSlides(nextSlide, function() {
          currentSlide.find("li").each(function(index,element) {
            $(element).css("visibility","hidden");
          });
        })
      }
    },

    /** Move back one slide */
    back: function() {
      var nextSlide = Conman.currentSlide - 1;
      if (nextSlide < 0) {
        nextSlide = Conman.totalSlides - 1;
      }
      Conman._changeSlides(nextSlide);
    },

    /** Private functions **/
    _advanceBullet: function() {
      return Conman._bulletList() && Conman.currentBullet < Conman._slide().find("li").size()
    },

    _nextBullet: function() {
      return Conman._slide().find("li").eq(Conman.currentBullet);
    },
    _initCurrentSlide: function() {
      if (document.location.hash !== "") {
        Conman.currentSlide = parseInt(document.location.hash.replace("#",""));
      }
    },

    _slide: function(whichSlide) {
      if (typeof whichSlide === "undefined") {
        whichSlide = Conman.currentSlide;
      }
      return slides().eq(whichSlide);
    },

    _bulletList: function() {
      return Conman._slide().children().find("li").size() > 0;
    },

    _changeSlides: function(nextSlide,afterChanges) {
      afterChanges = Utils.f(afterChanges);
      Conman._slide().fadeOut(config.transitionTime / 2, function() {
        Conman._slide(nextSlide).fadeIn(config.transitionTime / 2, function() {
          Conman.currentSlide = nextSlide;
          window.history.replaceState({},"",document.URL.replace(/#.*$/,"") + "#" + Conman.currentSlide);
          Conman.currentBullet = 0;
          if (Conman._slide().attr("class").indexOf("IMAGE") != -1) {
            var img    = Conman._slide().find("img");
            var width  = browserWindow().width  - config.padding;
            var height = browserWindow().height - config.padding;
            if (img.height > height) { img.height(height); }
            if (img.width > width) { img.width(width); }
          }
          afterChanges();
        });
      });
    },

    _sizeAllToFit: function() {
      var sizableElement = function(slide) {
        // setting the size on the PRE or DIV creates a big top margin for some reason
        if (slide.children().first()[0].tagName == "PRE") {
          //return slide.children().first().children().first();
          return slide;
        }
        else {
          return slide;
        }
      };

      var shouldResize = function(slide) {
        return !(slide.attr("class").indexOf("IMAGE") != -1);
      };

      var sizeToFit = Sizer.sizeFunction(browserWindow().width,browserWindow().height,config.minFontSize,config.padding);
      slides().select(shouldResize).each(function(index,element) {
        sizeToFit(sizableElement($(element)));
      });
    }
  }
};
// 66 - Kensington down/stop
// 116 - Kensington up/laser
