// Patch global object with XMLHttpRequest since server environment doesn’t have necessary support
global.XMLHttpRequest = global.XMLHttpRequest || require('xmlhttprequest').XMLHttpRequest;
var ajax = require('xhr');

var jsonp = require('jsonp');
var qs = require('qs');
var trim = require('trim');

/**
 * Escape JSON
 *
 * @param  {String} string
 *
 * @return {String}
 */
function jsonEscape ( string ) {
	return string
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r');
}

/**
 * Create URL for AJAX request
 *
 * @param  {String} text
 *
 * @return {String}
 */
function url ( text ) {
	return 'https://query.yahooapis.com/v1/public/yql?' + qs.stringify({
			q: 'select * from xml where url="http://hacheck.tel.fer.hr/xml.pl?textarea=' + encodeURIComponent(trim(text)) + '"',
			format: 'json'
		});
}

/**
 * Send AJAX request
 *
 * @param  {String}   text
 * @param  {Function} cb
 *
 * @return {}
 */
function start ( text, cb ) {

	// If IE8
	if ( '\v'=='v' ) {

		jsonp(url(text), {}, function ( err, data ) {
			cb(data);
		});

	} else {

		ajax({
			url: url(text),
			method: 'get',
			timeout: 10000
		}, function ( err, resp, body ) {
			cb(JSON.parse(jsonEscape(body)));
		});

	}

}

module.exports = start;
