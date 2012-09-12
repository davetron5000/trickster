var TricksterDefaultConfig = {
  /** Padding between max width and max font size */
  padding:          128,
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
                    8],  // delete
  startOverKeycodes: [66], // Kensington presenter down/stop
  /** These keycodes, if encountered, will not be sent along
      to the browser.  Useful if there might be some vertical
      scrolling and 32/33/34 would otherwise scroll */
  keyCodesPreventingDefault: [ 34, 32, 33 ]
};
/** Loads Trickster.
 * config: configuration, or TricksterDefaultConfig to get the defaults
 * functions: override helper functions
 */
var TricksterLoader = function(config,functions) {
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

  var strikeThroughCode = Utils.fOr(functions.strikeThroughCode,function() {
    $("code").each(function() {
      if ($(this).attr("data-strikeouts")) {
        var strikes = $(this).attr("data-strikeouts").split(",");
        for(var index in strikes) {
          var line = parseInt(strikes[index]) - 1;
          $(this).find(".line-" + line).css("text-decoration","line-through");
        }
      }
    });
  });

  var syntaxHighlighter = Utils.fOr(functions.syntaxHighlighter,function() {
    return {
      highlight: function() {
        hljs.lineNodes = true;
        hljs.initHighlighting();
        strikeThroughCode();
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
  var preventDefaultKeyCodeAction = Utils.fOr(functions.preventDefaultKeyCodeAction,function(keyCodes) {
    $(window).keydown(function(event) {
      if (keyCodes.indexOf(event.which) != -1) {
        event.preventDefault();
      }
    });
  });

  function currentSlide(whichSlide) {
    if (typeof whichSlide === "undefined") {
      whichSlide = Trickster.currentSlide;
    }
    return slides().eq(whichSlide);
  };

  function initCurrentSlide() {
    var slideNumber = 0;
    if (document.location.hash !== "") {
      slideNumber = parseInt(document.location.hash.replace("#",""));
      Trickster.currentSlide = slideNumber;
    }
    applySlideClassToBody(currentSlide(slideNumber));
  };

  function applySlideClassToBody(slide) {
    $("body").attr("class",slide.attr("class"));
    if (slide.attr("data-background")) {
      $("body").css("background","#" + slide.attr("data-background"));
    }
    else {
      $("body").css("background","");
    }
  }

  function changeSlides(nextSlide,afterChanges) {
    if ((nextSlide != 0) && (nextSlide != Trickster.previousSlide)){
      Trickster.previousSlide = Trickster.currentSlide;
    }
    afterChanges = Utils.f(afterChanges);
    var transitionTime = config.transitionTime / 2;
    if (currentSlide().attr("data-transition")) {
      transitionTime = parseInt(currentSlide().attr("data-transitionTime"));
    }
    currentSlide().fadeOut(transitionTime, function() {
      applySlideClassToBody(currentSlide(nextSlide));
      currentSlide(nextSlide).fadeIn(transitionTime, function() {
        Trickster.currentSlide = nextSlide;
        window.history.replaceState({},"",document.URL.replace(/#.*$/,"") + "#" + Trickster.currentSlide);
        afterChanges();
      });
    });
  };

  function sizeAllToFit() {
    slides().each(function(index,element) {
      // Order matters here
      var sizeToFit = Sizer.sizeFunction(browserWindow().width,browserWindow().height);
      sizeToFit($(element));
    });
  }

  function setupKeyBindings() {
    bindKeys(config.advanceKeycodes,Trickster.advance);
    bindKeys(config.backKeycodes,Trickster.back);
    bindKeys(config.startOverKeycodes,Trickster.startOver);
    preventDefaultKeyCodeAction(config.keyCodesPreventingDefault);
    bindKeys([189],Trickster.shrink);   // -
    bindKeys([187],Trickster.embiggen); // +
  }

  function hideAllSlides() {
    $("section").css("display","none");
    $("li").css("visibility","hidden");
    $("section.COMMANDLINE .cli-element").css("display","none");
  }

  var Bullets = TricksterBullets(currentSlide,config);
  return {
    /** State */
    currentSlide:  0,
    totalSlides:   1,
    previousSlide: 0,

    /** Set everything up for the slideshow */
    load: function() {
      // Order matters here
      Trickster.totalSlides = slides().length;
      initCurrentSlide();
      setupKeyBindings();
      syntaxHighlighter().highlight();
      sizeAllToFit();
      hideAllSlides();
      currentSlide().fadeIn(config.transitionTime / 2);
    },

    /** Reduce the font-size of the current slide slightly */
    shrink: function() {
      var currentSize = parseInt(currentSlide().css("font-size"));
      currentSlide().css("font-size",currentSize - 4);
      if (currentSlide().hasClass("CODE") || currentSlide().hasClass("COMMANDLINE")) {
        currentSlide().css("margin-top",-1 * (currentSize - 4));
      }
    },
    /** Increase the font-size of the current slide slightly */
    embiggen: function() {
      var currentSize = parseInt(currentSlide().css("font-size"));
      currentSlide().css("font-size",currentSize + 4);
      if (currentSlide().hasClass("CODE") || currentSlide().hasClass("COMMANDLINE")) {
        currentSlide().css("margin-top",-1 * (currentSize - 4));
      }
    },

    startOver: function() {
      if (Trickster.currentSlide == 0)  {
        changeSlides(Trickster.previousSlide, Bullets.rehideBullets());
      }
      else {
        changeSlides(0,Bullets.rehideBullets());
      }
    },

    /** Move forward one slide */
    advance: function() {
      if (Bullets.hasBulletsToAdvanceFirst()) {
        Bullets.advanceToNextBullet();
      }
      else {
        var nextSlide = Trickster.currentSlide + 1;
        if (nextSlide >= Trickster.totalSlides) {
          nextSlide = 0;
        }
        changeSlides(nextSlide, Bullets.rehideBullets());
      }
    },

    /** Move back one slide */
    back: function() {
      var nextSlide = Trickster.currentSlide - 1;
      if (nextSlide < 0) {
        nextSlide = Trickster.totalSlides - 1;
      }
      changeSlides(nextSlide, Bullets.rehideBullets());
    }
  };
};
// 66 - Kensington down/stop
// 116 - Kensington up/laser
