var Utils = function() {
  /** If possibleFunction is undefined, use otherFunction */
  function fOr(possibleFunction,otherFunction) {
    if (typeof possibleFunction != "undefined") {
      return possibleFunction;
    }
    else {
      return otherFunction;
    }
  };
  /** Turn possibly-undefined into a function */
  function f(possibleFunction) {
    return fOr(possibleFunction,function() {});
  };
  return {
    f:   f,
    fOr: fOr
  };
}();
