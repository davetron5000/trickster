var Sizer = function() {
  function isCodeSlide(element)  { return (element.hasClass("CODE") || element.hasClass("COMMANDLINE")); }
  function scrollWidth(element)  { return element[0].scrollWidth;  }
  function scrollHeight(element) { return element[0].scrollHeight; }

  function linesNotAllSameHeight(element) {
    var heights = {};
    var selector = ".line";
    if (element.find(selector).length == 0) {
      selector = ".cli-element";
    }
    element.find(selector).each(function(index,thisElement) {
      heights[$(thisElement).height()] = true;
    });
    return Object.keys(heights).length > 1;
  }

  /**
   * @param element JQueryElement element to shrink
   * @param maxTries int max attempts at shrinking (controls for infinite loops)
   * @param shouldShrink function given the element, returns true if the element should be shrunken more
   */
  function shrinkElement(element,maxTries,shouldShrink) {
    var fontSize = parseInt(element.css("font-size"));
    var count = 0;
    var STEP = 10;
    while (shouldShrink(element) && (count < maxTries)) {
      fontSize -= STEP;
      element.css("font-size",fontSize);
      if (isCodeSlide(element)) {
        element.css("margin-top",-1 * fontSize);
      }
      count += 1;
    }
    return count == maxTries;
  }

  function shrinkToPreventWrapping(element) {
    if (!isCodeSlide(element)) { return false; }
    return shrinkElement(element,20,linesNotAllSameHeight);
  }

  function shrinkToFitWidth(element,maxWidth) {
    if (isCodeSlide(element)) { return false; }
    var shouldShrink = function(elem) {
      return (scrollWidth(element) > maxWidth);
    };
    return shrinkElement(element,10,shouldShrink);
  }
  function shrinkToFitHeight(element,maxHeight) {
    if (isCodeSlide(element)) { return false; }
    var shouldShrink = function(elem) {
      return (scrollHeight(element) > maxHeight);
    };
    return shrinkElement(element,10,shouldShrink);
  }

  function resizeImageSlide(slide,maxWidth,maxHeight) {
    var img    = slide.find("img");
    var width  = maxWidth;
    var height = maxHeight;
    var widthDiff = img.width() - width;
    var heightDiff = img.height() - height;
    if ((widthDiff > 0) || (heightDiff > 0)) {
      if (widthDiff > heightDiff) {
        img.width(width);
      }
      else {
        img.height(height);
      }
    }
  }

  function increaseSize(element,fontSize) {
    if (element.hasClass("COMMANDLINE")) {
      element.find(".cli-element").each(function(index,thisElement) {
        $(thisElement).css("display","inline")
      });
    }

    element.css("font-size",fontSize);
    var results = [scrollWidth(element),element.height()];

    if (element.hasClass("COMMANDLINE")) {
      element.find(".cli-element").each(function(index,thisElement) {
        $(thisElement).css("display","none")
      });
    }
    return results;
  }

  function resizeNonImageSlide(element,maxWidth,maxHeight) {
    var currentFontSize = parseInt(element.css("font-size"));
    var currentSize     = increaseSize(element,currentFontSize);
    var newFontSize     = currentFontSize + 10;

    for(var i=0;i<3;i = i + 1) {
      if (newFontSize > currentFontSize) {
        newSize   = increaseSize(element,newFontSize);
        rise      = newFontSize - currentFontSize;
        runWidth  = newSize[0]  - currentSize[0];
        runHeight = newSize[1]  - currentSize[1];

        currentFontSize = newFontSize;
        currentSize = newSize;
        if (isCodeSlide(element)) {
          element.css("margin-top",-1 * newFontSize);
          newFontSize = Math.floor(rise * maxHeight / runHeight);
        }
        else if (element.hasClass("BULLETS")) {
          newFontSize = Math.floor(rise * maxHeight / runHeight);
        }
        else {
          newFontSize = Math.floor((rise * maxWidth / runWidth, rise * maxHeight / runHeight) / 2);
        }
      }
    }
    shrinkToPreventWrapping(element);
    shrinkToFitWidth(element,maxWidth);
    shrinkToFitHeight(element,maxHeight);
  }

  return {
    sizeFunction: function(maxWidth,maxHeight) {
      return function(element) {
        if (element.hasClass("IMAGE")) {
          resizeImageSlide(element,maxWidth,maxHeight);
        }
        else {
          resizeNonImageSlide(element,maxWidth,maxHeight);
        }
      };
    }
  };
}();
