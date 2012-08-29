var Sizer = function() {
  return {
    sizeFunction: function(maxWidth,maxHeight,initialFontSize,tolerance) {
      return function(element) {
        var newFontSize = initialFontSize;
        var step = 10;
        //var log = function(arg) { console.log(arg); };
        var log = function(arg) {};
        var heightTolerance = tolerance
        var widthTolerance = 0;
        if (element.text().replace(/^\s\s*/, '').replace(/\s\s*$/, '').indexOf(" ") == -1) {
          widthTolerance = tolerance;
        }

        while ( (element.width() <= maxWidth) && (element.height() <= maxHeight) ) {
          log("*");
          var widthBefore = element.width();
          var heightBefore = element.height();

          newFontSize = newFontSize + step;
          log(newFontSize);
          element.css("font-size",newFontSize);

          var delta = element.width() - widthBefore;
          var sizeToGo = maxWidth - element.width();
          step = Math.round(sizeToGo / delta);
          log("Width: " + element.width() + ", sizeToGo: " + sizeToGo + ", Delta: " + delta + ", step: " + step);
          if ((step <= 0) || (delta <= 0)) {
            delta = element.height() - heightBefore;
            sizeToGo = maxHeight - element.height();
            step = Math.round(sizeToGo / delta);
            log("Height: " + element.height() + ", sizeToGo: " + sizeToGo + ", Delta: " + delta + ", step: " + step);
          }
          log("Step: " + step + ", Delta: " + delta);

          if ((step <= 0) || (delta <= 0)) { break; }
        }
        while (element.width() > (maxWidth - widthTolerance)) {
          log("Backing off due to width:" + element.width() + "x" + element.height() + ":" + maxWidth);
          newFontSize = newFontSize - 2;
          element.css("font-size",newFontSize);
        }
        while (element.height() > (maxHeight - heightTolerance)) {
          log("Backing off due to height:" + element.width() + "x" + element.height() + ":" + maxHeight);
          newFontSize = newFontSize - 2;
          element.css("font-size",newFontSize);
        }
        log(element.width() + "x" + element.height() + ":" + maxWidth + "x" + maxHeight);
        if (element.hasClass("CODE") || element.hasClass("COMMANDLINE")) {
          element.css("margin-top",-1 * newFontSize);
        }
      };
    }
  };
}();
