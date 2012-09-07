var ConmanBullets = function(currentSlide,config) {
  var BULLET_SELECTORS = ["li",".cli-element"];
  var currentBullet = 0;

  var bulletsSelectedBy = function(selector) {
    return currentSlide().children().find(selector).size() > 0;
  };

  var numBullets = function() {
    return bullets().size();
  };

  var hasBullets = function() {
    return _.any(BULLET_SELECTORS,bulletsSelectedBy);
  };

  var bullets = function() {
    return currentSlide().children().find(_.find(BULLET_SELECTORS,bulletsSelectedBy));
  };

  var nextBullet = function() {
    return bullets().eq(currentBullet);
  };
  var hasBulletsToAdvanceFirst = function() {
    return hasBullets() && currentBullet < numBullets();
  };
  var advanceToNextBullet = function() {
    var next = nextBullet();
    if (next[0].tagName == "LI") {
      next.css("visibility","visible");
    }
    else if (next.hasClass("cli-element")) {
      if (next.hasClass("cli-command")) {
        var delay = Math.round(config.typingTime / next.text().length);
        if (delay < 20) {
          delay = 20;
        }
        next.typewrite({ 
          delay: delay,
          callback: function() {
            if (hasBulletsToAdvanceFirst()) {
              advanceToNextBullet();
            }
          }
        });
      }
      else {
        next.fadeIn(config.transitionTime);
      }
    }
    currentBullet = currentBullet + 1;
  };

  return {
    hasBulletsToAdvanceFirst: hasBulletsToAdvanceFirst,
    advanceToNextBullet: advanceToNextBullet,
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
