/*! hascheck 0.2.1 - Interface to Hrvatski akademski spelling checker. | Author: Ivan Nikolić, 2014 | License: MIT */
;(function ( root, factory ) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery')(require('jsdom').jsdom().createWindow()));
	} else {
		root.hascheck = factory(jQuery, root, document);
	}
}(this, function ( $, window, document, undefined ) {

	var cache = [];
	var dfds = {};

	/**
	 * Get or set deferred object
	 *
	 * @param  {String} text
	 *
	 * @return {Object}
	 */
	function resolveDfd ( text ) {
		text = $.trim(text);
		if ( !dfds[text] ) {
			dfds[text] = {
				dfd: $.Deferred(),
				called: false
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
		$.each(cache, function ( index, value ) {
			if ( value.text === $.trim(text) ) {
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
			text: $.trim(text),
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

		$.each(resultErrors, function ( index, obj ) {
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

		return $.ajax({
			url: 'https://query.yahooapis.com/v1/public/yql',
			type: 'get',
			dataType: 'jsonp',
			cache: true,
			data: {
				q: 'select * from xml where url="http://hacheck.tel.fer.hr/xml.pl?textarea=' + encodeURIComponent($.trim(text)) + '"',
				format: 'json'
			}
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
			this.check(text).done($.proxy(this[type === 'errors' ? 'getErrors' : 'getSuggestions'], this, text, cb));
			return;
		}

		$.each(results, function ( index, result ) {
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

	function Hascheck () {}

	$.extend(Hascheck.prototype, {

		/**
		 * Check provided data
		 *
		 * @param  {String} text
		 *
		 * @return {Promise}
		 */
		check: function ( text ) {

			var resolvedDfd = resolveDfd(text);
			var dfd = resolvedDfd.dfd;

			if ( getCache(text).results ) {

				dfd.resolve( getCache(text).results );

			} else {

				if ( resolvedDfd.called ) {
					return dfd.promise();
				}
				resolvedDfd.called = resolvedDfd.called || true;

				getRawData(text)
					.done(function ( data ) {
						setCache(text, processErrors(data));
						dfd.resolve( getCache(text).results );
					});

			}

			return dfd.promise();

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

	});

	return new Hascheck();

}));
