var ConmanDefaultConfig = {
  /** Padding between max width and max font size */
  padding:          164,
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
  backKeyCodes:    [75,  // k
                    37,  // left arrow
                    33,  // Kensington presenter left arrow
                    8]   // delete
};
var ConmanLoader = function($,hljs,config) {

  /** Turn possibly-undefined into a function */
  var f = function(possibleFunction) {
    if (typeof possibleFunction != "undefined") {
      return possibleFunction;
    }
    else {
      return function() {};
    }
  };

  return {
    /** State */
    currentSlide:  0,
    totalSlides:   1,
    currentBullet: 0,

    /** Set everything up for the slideshow */
    load: function() {
      Conman.totalSlides = $("section").length;
      Conman._initCurrentSlide();
      Conman._initKeyBindings();
      Conman._sizeAllToFit();
      Conman._slide().fadeIn(config.transitionTime / 2);
      hljs.initHighlightingOnLoad();
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
          currentSlide.find("li").each(function() {
            $(this).css("visibility","hidden");
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

    _initKeyBindings: function() {
      $(window).keyup(function(event) {
        if (config.advanceKeycodes.indexOf(event.which) != -1) {
          Conman.advance();
        }
        else if (config.backKeyCodes.indexOf(event.which) != -1) {
          Conman.back();
        }
      });
    },

    _slide: function(whichSlide) {
      if (typeof whichSlide === "undefined") {
        whichSlide = Conman.currentSlide;
      }
      return $("section").eq(whichSlide);
    },

    _bulletList: function() {
      return Conman._slide().children().find("li").size() > 0;
    },

    _changeSlides: function(nextSlide,afterChanges) {
      afterChanges = f(afterChanges);
      Conman._slide().fadeOut(config.transitionTime / 2, function() {
        Conman._slide(nextSlide).fadeIn(config.transitionTime / 2, function() {
          Conman.currentSlide = nextSlide;
          window.history.replaceState({},"",document.URL.replace(/#.*$/,"") + "#" + Conman.currentSlide);
          Conman.currentBullet = 0;
          if (Conman._slide().attr("class").indexOf("IMAGE") != -1) {
            var img    = Conman._slide().find("img");
            var width  = $(window).width()  - config.padding;
            var height = $(window).height() - config.padding;
            if (img.height() > height) { img.height(height); }
            if (img.width() > width) { img.width(width); }
          }
          afterChanges();
        });
      });
    },

    _sizeAllToFit: function() {

      var width  = $(window).width()  - config.padding;
      var height = $(window).height() - config.padding;

      $("section").each(function() {
        if ($(this).attr("class").indexOf("IMAGE") != -1) {
        }
        else {
        var fontSize = config.minFontSize;
        var slide    = $(this);

        slide.css("font-size",fontSize);

        while ((slide.width() < width) && (slide.height() < height)) {

          fontSize = fontSize + 4;

          // setting the size on the PRE or DIV creates a big top margin for some reason
          if (slide.children().first()[0].tagName == "PRE") {
            slide.children().first().children().first().css("font-size",fontSize);
            slide.children().first().css("font-size",0);
          }
          else {
            slide.css("font-size",fontSize);
          }

          if (fontSize > config.maxFontSize) { break; }
        }
        if ((slide.width() < width) || (slide.height() < height)) {
          slide.css("font-size",fontSize - 2);
        }
        }
      });
    }
  }
};
// 66 - Kensington down/stop
// 116 - Kensington up/laser
