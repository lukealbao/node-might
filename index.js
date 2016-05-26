'use strict';

var debug = require('util').debuglog('maybe');
var assert = require(__dirname + '/lib/assert');

function handleIf (predicate, handler, alternate) {
  var useHandler = true;
  if (typeof alternate === 'function') {
    assert.callsArg(alternate, 'Alternate fn must call next');
  }
  
  switch (typeof predicate) {
    case 'boolean':
    useHandler = predicate;
    break;

    case 'function':
    useHandler = Boolean(predicate());
    break;

    case 'object':
    if (predicate === null || Array.isArray(predicate)) {
      throw new TypeError('Invalid predicate type: '
                         + typeof predicate);
    }
    for (var envVar in predicate) {
      if (process.env[envVar] !== predicate[envVar]) {
        useHandler = false;
        break;
      }
    }
    break;

    default:
    throw new TypeError('Invalid predicate type: '
                       + typeof predicate);
  }

  if (useHandler) {
    return handler;
  } else {
    debug('Predicate does not match. Skipping handler [%s]',
          handler.name);
    return (typeof alternate === 'function') ? alternate
         : function noMatchNoOp (req, res, next) {
           debug('Skipping handler [%s]', handler.name);
           return next();
         };
  }
}

function runIf (match, fn) {
  var useFn = true;
  var argv = [].slice(arguments, 2);
  
  for (var envVar in match) {
    if (process.env[envVar] !== match) {
      useFn = false;
      break;
    }
  }

  if (useFn) return fn.apply(null, argv);  
}

module.exports.handleIf = handleIf;
module.exports.runIf = runIf;
