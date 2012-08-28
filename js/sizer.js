var Sizer = function() {
  return {
    sizeFunction: function(maxWidth,maxHeight,initialFontSize) {
      return function(element) {
        var newFontSize = initialFontSize;
        var step = 10;

        while ( (element.width() < maxWidth) && (element.height() < maxHeight) ) {
          var widthBefore = element.width();
          var heightBefore = element.height();

          newFontSize = newFontSize + step;
          element.css("font-size",newFontSize);

          var delta = element.width() - widthBefore;
          var sizeToGo = maxWidth - element.width();
          step = Math.round(sizeToGo / delta);
          console.log(element.html());
          if ((step <= 0) || (delta <= 0)) {
            delta = element.height() - heightBefore;
            sizeToGo = maxHeight - element.height();
            step = Math.round(sizeToGo / delta);
            console.log(element.height() + ", sizeToGo: " + sizeToGo + ", Delta: " + delta);
          }
          console.log("Step: " + step + ", Delta: " + delta);

          if ((step <= 0) || (delta <= 0)) { break; }
        }
        while ((element.width() >= maxWidth) || (element.height() >= maxHeight)) {
          console.log("Backing off");
          newFontSize = newFontSize - 1;
          element.css("font-size",newFontSize);
        }
      };
    }
  };
}();
