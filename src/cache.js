var trim = require('trim');
var each = require('foreach');
var toarray = require('toarray');

var cache = [];
var resolved = {};

/**
 * @param  {String} text
 *
 * @return {Object}
 */
function resolve ( text ) {
	text = trim(text);
	if ( !resolved[text] ) {
		resolved[text] = {
			called: text === '' ? true : false
		};
	}
	return resolved[text];
}

/**
 * @param  {String} text
 *
 * @return {Array}
 */
function get ( text ) {
	var result = {};
	each(cache, function ( value, index ) {
		if ( value.text === trim(text) ) {
			result = value;
			return false;
		}
	});
	return toarray(result.results);
}

/**
 * @param {String} text
 * @param {Array} results
 *
 * @return {}
 */
function set ( text, results ) {
	cache.push({
		text: trim(text),
		results: results
	});
}

module.exports = {
	resolve: resolve,
	get: get,
	set: set
};
