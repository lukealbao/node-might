'use strict';

// signature :: (Function) -> Array[String]
// Return parameters of function as Array
function signature (fn) {
  var str = fn.toString();
  var argRegEx = /function.*\(([\w ,]+)\)/;

  var match = str.match(argRegEx);
  if (!match) return [];

  return match[1].split(/\W+/);
}

// callsArg :: (Function[, String]) -> Boolean
// Static inspection of function expression returns
// true if argument for param is called, false if not.
//
// If second argument is a string, test will be performed
// on it; by default it will test the last parameter in the
// signature.
//
// This of course has edge cases where the regular expression
// is present but is commented out, in which case you get false
// positives. But we ain't looking to build a full parser here.
function callsArg (fn, _param) {
  var str = fn.toString();
  var args = signature(fn);

  _param = _param || args[args.length - 1]; 
  if (!_param || args.indexOf(_param) < 0) {
    throw new TypeError('Function ' + fn.name
                        + ' has no parameter ' + _param);
  }

  var re = new RegExp(_param + '\\([\\w ,]*\\)');
  return re.test(str);
}

// assert :: (Function) -> Function
// Helper function accepts a predicate function and returns
// an assertion function.
function assert (predicate) {
  return function (val, str) {
    if (predicate(val)) {
      return (undefined);
    } else {
      throw new Error(str);
    }
  }
}

module.exports = {
  callsArg: assert(callsArg)
};
