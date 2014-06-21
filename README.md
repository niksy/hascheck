# hascheck

Interface to [Hrvatski akademski spelling checker](http://hacheck.tel.fer.hr/).

## Installation

```sh
bower install niksy/hascheck
```

## API

### `check(text)`

Returns: `Promise`

Checks for errors and suggestions.

### `getErrors(text, [callback])`

Returns: `Array`

Returns array of errors (suspicious words).

#### text

Type: `String`

Text which should be checked for errors.

#### callback

Type: `Function`  
Returns: `Array`

Callback to execute after text has been checked. Returns list of suspicious words.

If there is no cached value for provided text, Hascheck will be called for results and callback will be returned after successful request.

### `getSuggestions(text, [callback])`

Returns: `Array`

Returns array of suggestions (with suspicious words).

#### text

Type: `String`

Text which should be checked for errors.

#### callback

Type: `Function`  
Returns: `Array`

Callback to execute after text has been checked. Returns list of suggestions.

If there is no cached value for provided text, Hascheck will be called for results and callback will be returned after successful request.

## Examples

### Initalization

```js
// Node
var hascheck = require('hascheck');

// Require
define(['hascheck'], function ( hascheck ) {
	// Code away
});

// Global
window.hascheck;
```

### Usage

```js
hascheck.check('podjelio sjeta ljepo s tobom sa tobom').done(function ( results ) {
	// [{suspicious:"ljepo",suggestions: ["lijepo","ljeto"]},…]
});

hascheck.getErrors('podjelio sjeta ljepo s tobom sa tobom');
	// ["ljepo","podjelio","sa tobom"]

hascheck.getErrors('podjelio sjeta ljepo s tobom sa tobom', function ( errors ) {
	// ["ljepo","podjelio","sa tobom"]
});

hascheck.getSuggestions('podjelio sjeta ljepo s tobom sa tobom');
	// [{suspicious:"ljepo",suggestions: ["lijepo", "ljeto"]},…]

hascheck.getSuggestions('podjelio sjeta ljepo s tobom sa tobom', function ( suggestions ) {
	// [{suspicious:"ljepo",suggestions: ["lijepo", "ljeto"]},…]
});
```

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
