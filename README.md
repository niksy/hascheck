# hascheck

Interface to [Hrvatski akademski spelling checker](http://hacheck.tel.fer.hr/).

## Installation

```sh
# NPM
npm install hascheck

# Bower
bower install niksy/hascheck
```

## API

### `hascheck(text, cb)`

Checks for errors and suggestions.

#### `text`

Type: `String`

String to check.

#### `cb`

Type: `Function`  
Arguments: [List of errors and suggestions]

Callback to execute after text has been checked.

## Examples

### Initalization

```js
// Node
var hascheck = require('hascheck');

// Require.js
define(['hascheck'], function ( hascheck ) {
	// Code away
});

// Global browser module
window.hascheck;
```

### Usage

```js
hascheck('podjelio ljepo čovijek sumljam počmem s tobom sa tobom kuča', function ( results ) {
	// [{suspicious:"počmem",suggestions:["počnem"]},{suspicious:"sumljam",suggestions:["smuljam","sukljam","sumnjam","mumljam"]},…]
});
```

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
