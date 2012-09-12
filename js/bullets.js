/**
 * Creates the bullets module.
 *
 * @param currentSlide function returns the current slide the presenter is showing
 * @param config Object configuration, should respond to typingTime and transitionTime
 *
 * @return Object an object containing functions for checking if there are bullets, advancing bullets, and hiding bullets.
 */
var TricksterBullets = function(currentSlide,config) {
  var BULLET_SELECTORS = ["li",".cli-element"];
  var currentBullet = 0;

  function bulletSelector(selector) {
    return currentSlide().children().find(selector).size() > 0;
  };

  function bullets() {
    return currentSlide().children().find(_.find(BULLET_SELECTORS,bulletSelector));
  };

  function nextBullet() {
    return bullets().eq(currentBullet);
  };

  function hasBulletsToAdvanceFirst() {
    return _.any(BULLET_SELECTORS,bulletSelector) && currentBullet < bullets().size();
  };

  function delayForContent(content) {
    var delay = Math.round(config.typingTime / content.length);
    if (delay < 20) {
      delay = 20;
    }
    return delay;
  }

  function advanceIfNext() {
    if (hasBulletsToAdvanceFirst()) {
      advanceToNextBullet();
    }
  }

  function advanceToNextBullet() {
    var next = nextBullet();
    if (next[0].tagName == "LI") {
      next.css("visibility","visible");
    }
    else if (next.hasClass("cli-element")) {
      if (next.hasClass("cli-command")) {
        next.typewrite({ 
          delay: delayForContent(next.text()),
          trim: true,
          callback: advanceIfNext
        });
      }
      else {
        next.fadeIn(config.transitionTime);
      }
    }
    currentBullet = currentBullet + 1;
  };

  return {
    /** True if this slide has bullets that should be advanced
     * before advancing to the next slide
     */
    hasBulletsToAdvanceFirst: hasBulletsToAdvanceFirst,
    /** Advanced to the next bullet if there is one */
    advanceToNextBullet: advanceToNextBullet,
    /** Re-hides any bullets that were advanced/shown on this slide */
    rehideBullets: function() {
      currentBullet = 0;
      bullets().each(function(index,element) {
        if (element.tagName == "LI") {
          $(element).css("visibility","hidden");
        }
        else if ($(element).hasClass("cli-element")) {
          $(element).css("display","none");
        }
      });
    }
  };
};
