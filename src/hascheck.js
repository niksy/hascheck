var trim = require('trim');
var each = require('foreach');
var bind = require('component-bind');
var ajax = require('./lib/ajax');
var Promise = require('es6-promise').Promise;

var cache = [];
var dfds = {};

/**
 * Get or set promise
 *
 * @param  {String} text
 *
 * @return {Object}
 */
function resolvePromise ( text ) {
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

/**
 * Return raw representation of data
 *
 * @param  {String} text
 *
 * @return {Promise}
 */
function getRawData ( text ) {

	return new Promise(function ( resolve, reject ) {

		ajax(text, function ( data ) {
			resolve(data);
		});

	});

}

/**
 * @param  {String}   type
 * @param  {String}   text
 * @param  {Function} cb
 *
 * @return {Array}
 */
function getData ( type, text, cb ) {
	var arr = [];
	var results = getCache(text).results || [];

	if ( !results.length && cb ) {
		this.check(text).then(bind(null, getData, type, text, cb));
		return;
	}

	each(results, function ( result, index ) {
		if ( type === 'errors' ) {
			arr.push(result.suspicious);
			return;
		}
		arr.push(result);
	});

	if ( cb ) {
		cb.call(null, arr);
	}

	return arr;
}

var api = {

	/**
	 * Check provided data
	 *
	 * @param  {String} text
	 *
	 * @return {Promise}
	 */
	check: function ( text ) {

		var promise = resolvePromise(text);

		return new Promise(function ( resolve, reject ) {

			if ( getCache(text).results || trim(text) === '' || promise.called ) {

				resolve( getCache(text).results || [] );

			} else {

				promise.called = true;

				getRawData(text)
					.then(function ( data ) {
						setCache(text, processErrors(data));
						resolve( getCache(text).results );
					});

			}

		});

	},

	/**
	 * Get errors for provided text
	 *
	 * @param  {String} text
	 * @param  {Function} cb
	 *
	 * @return {Array}
	 */
	getErrors: function ( text, cb ) {
		return getData.call(this, 'errors', text, cb);
	},

	/**
	 * Get suggestions for provided text
	 *
	 * @param  {String} text
	 * @param  {Function} cb
	 *
	 * @return {Array}
	 */
	getSuggestions: function ( text, cb ) {
		return getData.call(this, 'suggestions', text, cb);
	}

};

module.exports = api;
