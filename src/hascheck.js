var toarray = require('toarray');
var trim = require('trim');
var each = require('foreach');
var request = require('./request');
var parse = require('./parse');
var cache = require('./cache');

module.exports = function ( text, cb ) {

	var query = cache.resolve(text);

	if ( cache.get(text).length || trim(text) === '' || query.called ) {

		cb(cache.get(text));

	} else {

		query.called = true;

		request(text, function ( data ) {
			cache.set(text, parse(data));
			cb(cache.get(text));
		});

	}

};
