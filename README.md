# Might, maybe. Depends.
Easy feature toggling for connect-based (Express, Restify, etc.)
handlers, as well as for arbitrary blocks of code.

## Status
- Designed for Node.js usage only.
- Currently only has support for connect-like handlers. Arbitrary
blocks of code coming in the future.

## Example - might.handleIf
Give it a predicate and a connect-based handler, and it will return
the handler you want.

```javascript
var might = require('might');
var handlers = require('./handlers');
var config = require('./config');

server.get('/',
           might.handleIf(config.useNewFeature, handlers.newFeature),
           handlers.theVanillaStuff);
```

If `config.useNewFeature` equals `true`, then the route mounting is
equivalent to this:

```javascript
server.get('/',
           handlers.newFeature,
           handlers.theVanillaStuff);
```

But if `config.useNewFeature` equals `false`, then under the hood,
this is what gets mounted:

```javascript
server.get('/',
           function noMatchNoOp (req, res, next) {
             return next();
           },
           handlers.theVanillaStuff);
```

## API

### might.handleIf (predicate, handler[, alternate])

If the predicate is true, you will get the original handler; otherwise
you will get an alternate.

- `predicate` (**required**, Boolean | Object | Function) :: If an object,
  it will iterate through the keys and see if they all match those in
  `process.env`; if a function, its return value will be coerced to a
  boolean.
- `handler` (**required**, Function) :: The connect-based handler that
  will be used if predicate is true.
- `alternate` (**optional**, Function) :: If you don't want a noop
  passthrough handler, you can pass another one in here. Will throw an
  error if the alternate handler is not a valid connect-based handler.
