var Utils = function() {
  /** If possibleFunction is undefined, use otherFunction */
  var fOr = function(possibleFunction,otherFunction) {
    if (typeof possibleFunction != "undefined") {
      return possibleFunction;
    }
    else {
      return otherFunction;
    }
  };
  /** Turn possibly-undefined into a function */
  var f = function(possibleFunction) {
    return fOr(possibleFunction,function() {});
  };
  return {
    f:   f,
    fOr: fOr
  };
}();
