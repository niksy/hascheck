;(function ( $, window, document, undefined ) {

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

			var d = resolveDfd(text);
			var dfd = d.dfd;

			if ( getCache(text).results ) {

				dfd.resolve( getCache(text).results );

			} else {

				if ( d.called ) {
					return dfd.promise();
				}
				d.called = d.called || true;

				getRawData(text)
				.done(function ( data ) {
					setCache(text, processErrors(data));
					dfd.resolve( getCache(text).results );
				})
				.fail(function () {
					dfd.reject('No results.');
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
			var errors = [];
			var results = getCache(text).results || [];

			if ( !results.length && cb ) {
				if ( resolveDfd(text).called ) {
					return;
				}
				this.check(text).done($.proxy(this.getErrors, this, text, cb));
				return;
			}

			$.each(results, function ( index, result ) {
				errors.push(result.suspicious);
			});

			if ( cb ) {
				cb.call(null, errors);
			}
			return errors;
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
			var suggestions = getCache(text).results || [];

			if ( !suggestions.length && cb ) {
				if ( resolveDfd(text).called ) {
					return;
				}
				this.check(text).done($.proxy(this.getSuggestions, this, text, cb));
				return;
			}

			if ( cb ) {
				cb.call(null, suggestions);
			}
			return suggestions;
		}

	});

	window.hascheck = new Hascheck();

})( jQuery, window, document );
