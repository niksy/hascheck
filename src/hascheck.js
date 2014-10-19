var trim = require('trim');
var each = require('foreach');
var ajax = require('./lib/ajax');

var cache = [];
var dfds = {};

/**
 * Get or set value
 *
 * @param  {String} text
 *
 * @return {Object}
 */
function resolveValue ( text ) {
	text = trim(text);
	if ( !dfds[text] ) {
		dfds[text] = {
			called: text === '' ? true : false
		};
	}
	return dfds[text];
}

/**
 * Get cache for provided text
 *
 * @param  {String} text
 *
 * @return {Object}
 */
function getCache ( text ) {
	var result = {};
	each(cache, function ( value, index ) {
		if ( value.text === trim(text) ) {
			result = value;
			return false;
		}
	});
	return result;
}

/**
 * Set cache for provided text
 *
 * @param {String} text
 * @param {Array} results
 *
 * @return {Array}
 */
function setCache ( text, results ) {
	return cache.push({
		text: trim(text),
		results: results
	});
}

/**
 * Process raw results
 *
 * @param  {Object} result
 *
 * @return {Array}
 */
function processErrors ( result ) {

	var errors = [];
	var topResults = result.query.results;
	var resultErrors;

	/**
	 * Exit early if returned results are null
	 */
	if ( !topResults ) {
		return errors;
	}

	resultErrors = topResults.hacheck.results.error;

	/**
	 * Exit early if there are no errors
	 */
	if ( !resultErrors ) {
		return errors;
	}

	/**
	 * Convert single result to array with one item to keep it consistent
	 * when we have multiple results
	 */
	if ( resultErrors.suspicious ) {
		resultErrors = [resultErrors];
	}

	each(resultErrors, function ( obj, index ) {
		var suggestions = obj.suggestions;
		var list = suggestions ? suggestions.word : [];
		errors.push({
			suspicious: obj.suspicious,
			suggestions: typeof(list) === 'string' ? list.split() : list
		});
	});

	return errors;

}

var api = {

	/**
	 * Check provided data
	 *
	 * @param  {String} text
	 * @param  {Function} cb
	 *
	 * @return {}
	 */
	check: function ( text, cb ) {

		var value = resolveValue(text);

		if ( getCache(text).results || trim(text) === '' || value.called ) {

			cb.call(this, getCache(text).results || []);

		} else {

			value.called = true;

			ajax(text, function ( data ) {
				setCache(text, processErrors(data));
				cb.call(this, getCache(text).results);
			});

		}

	}

};

module.exports = api.check;
