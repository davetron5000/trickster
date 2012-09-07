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

  function currentSlide(whichSlide) {
    if (typeof whichSlide === "undefined") {
      whichSlide = Conman.currentSlide;
    }
    return slides().eq(whichSlide);
  };

  function initCurrentSlide() {
    if (document.location.hash !== "") {
      Conman.currentSlide = parseInt(document.location.hash.replace("#",""));
    }
  };

  function changeSlides(nextSlide,afterChanges) {
    afterChanges = Utils.f(afterChanges);
    currentSlide().fadeOut(config.transitionTime / 2, function() {
      currentSlide(nextSlide).fadeIn(config.transitionTime / 2, function() {
        Conman.currentSlide = nextSlide;
        window.history.replaceState({},"",document.URL.replace(/#.*$/,"") + "#" + Conman.currentSlide);
        if (currentSlide().attr("class").indexOf("IMAGE") != -1) {
          var img    = currentSlide().find("img");
          var width  = browserWindow().width  - config.padding;
          var height = browserWindow().height - config.padding;
          if (img.height > height) { img.height(height); }
          if (img.width > width) { img.width(width); }
        }
        afterChanges();
      });
    });
  };

  function sizeAllToFit() {
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


  var bullets = ConmanBullets(currentSlide,config);
  return {
    /** State */
    currentSlide:  0,
    totalSlides:   1,

    /** Set everything up for the slideshow */
    load: function() {
      Conman.totalSlides = slides().length;
      initCurrentSlide();
      bindKeys(config.advanceKeycodes,Conman.advance);
      bindKeys(config.backKeycodes,Conman.back);
      bindKeys([189],Conman.shrink);
      bindKeys([187],Conman.embiggen);
      sizeAllToFit();
      currentSlide().fadeIn(config.transitionTime / 2);
      syntaxHighlighter().highlight();
    },

    /** Reduce the font-size of the current slide slightly */
    shrink: function() {
      var currentSize = parseInt(currentSlide().css("font-size"));
      currentSlide().css("font-size",currentSize - 4);
    },
    /** Increase the font-size of the current slide slightly */
    embiggen: function() {
      var currentSize = parseInt(currentSlide().css("font-size"));
      currentSlide().css("font-size",currentSize + 4);
    },

    /** Move forward one slide */
    advance: function() {
      if (bullets.hasBulletsToAdvanceFirst()) {
        bullets.advanceToNextBullet();
      }
      else {
        var nextSlide = Conman.currentSlide + 1;
        if (nextSlide >= Conman.totalSlides) {
          nextSlide = 0;
        }
        changeSlides(nextSlide, bullets.rehideBullets());
      }
    },

    /** Move back one slide */
    back: function() {
      var nextSlide = Conman.currentSlide - 1;
      if (nextSlide < 0) {
        nextSlide = Conman.totalSlides - 1;
      }
      changeSlides(nextSlide, bullets.rehideBullets());
    }
  };
};
// 66 - Kensington down/stop
// 116 - Kensington up/laser
