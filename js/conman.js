var ConmanDefaultConfig = {
  /** Padding between max width and max font size */
  padding:          128,
  /** Don't make fonts bigger than this */
  maxFontSize:      500,
  /** Don't make fonts smaller than this */
  minFontSize:      30,
  /** Time, in ms, to transition between slides */
  transitionTime:   200,
  /** Time, in ms, that it should take to type each command */
  typingTime:       1000,
  /** Keycodes that advance to the next slide */
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
        hljs.lineNodes = true;
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
      bindKeys([189],Conman.shrink);
      bindKeys([187],Conman.embiggen);
      Conman._sizeAllToFit();
      Conman._slide().fadeIn(config.transitionTime / 2);
      syntaxHighlighter().highlight();
    },

    /** Reduce the font-size of the current slide slightly */
    shrink: function() {
      var currentSize = parseInt(Conman._slide().css("font-size"));
      Conman._slide().css("font-size",currentSize - 4);
    },
    /** Increase the font-size of the current slide slightly */
    embiggen: function() {
      var currentSize = parseInt(Conman._slide().css("font-size"));
      Conman._slide().css("font-size",currentSize + 4);
    },

    /** Move forward one slide */
    advance: function() {
      if (Conman._hasBulletsToAdvanceFirst()) {
        Conman._advanceToNextBullet();
      }
      else {
        var nextSlide = Conman.currentSlide + 1;
        if (nextSlide >= Conman.totalSlides) {
          nextSlide = 0;
        }
        Conman._changeSlides(nextSlide, Conman._rehideBullets());
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

    BULLET_SELECTORS: ["li",".cli-element"],

    /** Private functions **/
    _hasBulletsToAdvanceFirst: function() {
      return Conman._hasBullets() && Conman.currentBullet < Conman._numBullets();
    },

    _bulletsSelectedBy: function(selector) {
      return Conman._slide().children().find(selector).size() > 0;
    },

    _numBullets: function() {
      return Conman._bullets().size();
    },

    _hasBullets: function() {
      return _.any(Conman.BULLET_SELECTORS,Conman._bulletsSelectedBy);
    },

    _bullets: function() {
      return Conman._slide().children().find(_.find(Conman.BULLET_SELECTORS,Conman._bulletsSelectedBy));
    },

    _nextBullet: function() {
      return Conman._bullets().eq(Conman.currentBullet);
    },

    _advanceToNextBullet: function() {
      var nextBullet = Conman._nextBullet();
      if (nextBullet[0].tagName == "LI") {
        nextBullet.css("visibility","visible");
      }
      else if (nextBullet.hasClass("cli-element")) {
        if (nextBullet.hasClass("cli-command")) {
          var delay = Math.round(config.typingTime / nextBullet.text().length);
          if (delay < 20) {
            delay = 20;
          }
          nextBullet.typewrite({ 
            delay: delay,
            callback: function() {
              if (Conman._hasBulletsToAdvanceFirst()) {
                Conman._advanceToNextBullet();
              }
            }
          });
        }
        else {
          nextBullet.fadeIn(config.transitionTime);
        }
      }
      Conman.currentBullet = Conman.currentBullet + 1;
    },

    _rehideBullets: function() {
      Conman._bullets().each(function(index,element) {
        if (element.tagName == "LI") {
          $(element).css("visibility","hidden");
        }
        else if ($(element).hasClass("cli-element")) {
          $(element).css("display","none");
        }
      });
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
