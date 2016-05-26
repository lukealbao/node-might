'use strict';

var Benchmark = require('benchmark');
var pkg = require(__dirname + '/../index');

var suite = new Benchmark.Suite();
function noop () {}

process.env.ABC = 'abc';
process.env.DEF = 'def';
process.env.GHI = 'ghi';
 
// add tests 
suite.add('handleIf match on Boolean predicate', function() {
  pkg.handleIf(1 === 1, noop);
})
.add('handleIf no match on Boolean predicate', function() {
  pkg.handleIf(1 === 2, noop);
})
.add('handleIf match on Object predicate', function() {
  pkg.handleIf({ABC: 'abc', DEF: 'def', GHI: 'ghi'}, noop);
})
.add('handleIf no match on Object predicate', function() {
  pkg.handleIf({ABC: 'xxx', DEF: 'xxx', GHI: 'xxx'}, noop);
})
.add('handleIf no match and return alternate fn', function () {
  function alt (req, res, next) { next(); }
  pkg.handleIf(false, noop, alt);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({async: false });
