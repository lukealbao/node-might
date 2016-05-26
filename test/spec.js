'use strict';

var check = 'use it';
var expect = require('chai').expect;
var pkg = require(__dirname + '/../index');
var handleIf = pkg.handleIf;

describe('handleIf :: (predicate, handler[, altFn]) -> Function', function () {
  function handler () {}
  before(function () {
    process.env.TESTNAME = 'handle';
    process.env.TESTNUMBER = 1;
  });

  describe('Input', function () {
    it('Throws TypeError if predicate is a String', function () {
      function shouldThrow () { handleIf('false', handler);}
      expect(shouldThrow).to.throw(/Invalid predicate type/);
    });

    it('Throws TypeError if predicate is an Array', function () {
      function shouldThrow () { handleIf([true], handler);}
      expect(shouldThrow).to.throw(/Invalid predicate type/);
    });

    it('Throws TypeError if predicate is an `null`', function () {
      function shouldThrow () { handleIf(null, handler);}
      expect(shouldThrow).to.throw(/Invalid predicate type/);
    });

    it('Throws TypeError if altFn is invalid handler', function () {
      function invalidFn (req, res, next) {
        // Never calls next
      }
      function shouldThrow () { handleIf(false, handler, invalidFn); }
      expect(shouldThrow).to.throw(/Alternate fn must call next/);
    });
  });
  
  describe('Output', function () {
    it('Noop handler calls its third argument (`next` cb)', function (done) {
      var ret = handleIf(false, handler);
      ret(null, null, done);
    });

    it('Optional third [Function] argument returned on no match', function () {
      function otherFn (req, res, next) { /* Log or something */ next(); }
      var ret = handleIf(false, handler, otherFn);

      expect(ret).to.equal(otherFn);
    });
  });
  describe('Object predicate', function () {
    it('Returns handler if all values strictly match process.env[key]',
       function () {         
         var ret = handleIf({TESTNAME: 'handle', TESTNUMBER: '1'}, handler);
         expect(ret).to.equal(handler);
       });

    it('Returns noop handler if any values fail to match', function () {
      var ret = handleIf({TESTNAME: 'NOPE', TESTNUMBER: '1'}, handler);
      expect(ret).not.to.equal(handler);
      expect(ret).to.be.a('function');
    });
  });

  describe('Boolean predicate', function () {
    it('Returns handler if predicate === true', function () {
      var ret = handleIf((1 === 1), handler);
         expect(ret).to.equal(handler);
       });

    it('Returns noop handler if predicate !== false', function () {
      var ret = handleIf((1 > 2), handler);
      expect(ret).not.to.equal(handler);
      expect(ret).to.be.a('function');
    });
  });

  describe('Function predicate', function () {
    it('Returns handler if calling predicate is truthy', function () {
      var ret = handleIf(function () {return 1}, handler);
         expect(ret).to.equal(handler);
       });

    it('Returns noop handler if calling predicate is falsy', function () {
      var ret = handleIf(function () { return null }, handler);
      expect(ret).not.to.equal(handler);
      expect(ret).to.be.a('function');
    });
  });
});

