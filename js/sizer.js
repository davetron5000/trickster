var Sizer = function() {
  function isCodeSlide(element) {
    if (element.hasClass("CODE") || element.hasClass("COMMANDLINE")) {
      return true;
    }
    else {
      return false;
    }
  }

  function linesSameHeight(element) {
    var heights = {};
    var selector = ".line";
    if (element.find(selector).length == 0) {
      selector = ".cli-element";
    }
    element.find(selector).each(function() {
      heights[$(this).height()] = true;
    });
    return Object.keys(heights).length < 2;
  }

  function shrinkToPreventWrapping(element) {
    var fontSize = parseInt(element.css("font-size"));
    var count = 0;
    var MAX = 20;
    var STEP = 10;
    while (!linesSameHeight(element) && (count < MAX)) {
      fontSize -= STEP;
      element.css("font-size",fontSize);
      element.css("margin-top",-1 * fontSize);
      count += 1;
    }
  }

  function scrollWidth(element) {
    return element[0].scrollWidth;
  }

  function scrollHeight(element) {
    return element[0].scrollHeight;
  }

  function shrinkToFitWidth(element,maxWidth) {
    var fontSize = parseInt(element.css("font-size"));
    var count = 0;
    while ((scrollWidth(element) > maxWidth) && (count < 20)) {
      fontSize -= 10;
      element.css("font-size",fontSize);
      count += 1;
    }
  }

  function shrinkToFitHeight(element,maxHeight) {
    var fontSize = parseInt(element.css("font-size"));
    var count = 0;
    while ((scrollHeight(element) > maxHeight) && (count < 20)) {
      fontSize -= 10;
      element.css("font-size",fontSize);
      count += 1;
    }
  }

  return {
    sizeFunction: function(maxWidth,maxHeight,initialFontSize,tolerance) {
      return function(element) {
        function increaseSize(element,fontSize) {
          if (element.hasClass("COMMANDLINE")) {
            element.find(".cli-element").each(function() {
              $(this).css("display","inline")
            });
          }
          element.css("font-size",fontSize);
          var results = [scrollWidth(element),element.height()];
          if (element.hasClass("COMMANDLINE")) {
            element.find(".cli-element").each(function() {
              $(this).css("display","none")
            });
          }
          return results;
        }
        var now = (new Date()).getTime();

        var currentFontSize,currentSize,newFontSize,newSize,rise,runWidth,runHeight;

        currentFontSize = parseInt(element.css("font-size"));
        currentSize = increaseSize(element,currentFontSize);
        newFontSize = currentFontSize + 10;

        for(var i=0;i<3;i = i + 1) {
          if (newFontSize > currentFontSize) {
            newSize = increaseSize(element,newFontSize);

            rise = newFontSize - currentFontSize;
            runWidth = newSize[0] - currentSize[0];
            runHeight = newSize[1] - currentSize[1];

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
        if (isCodeSlide(element)) {
          shrinkToPreventWrapping(element);
        }
        else {
          if (scrollWidth(element) > maxWidth) {
            shrinkToFitWidth(element,maxWidth);
          }
          if (scrollHeight(element) > maxHeight) {
            shrinkToFitHeight(element,maxHeight);
          }
        }
      };
    }
  };
}();
