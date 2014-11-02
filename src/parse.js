var toarray = require('toarray');
var parse = require('nodexml/xml2obj').xml2obj;
var each = require('foreach');

/**
 * @param  {Object} result
 *
 * @return {Array}
 */
module.exports = function ( result ) {

	var errors = toarray(parse(result).hacheck.results.error);
	var normalized = [];

	each(errors, function ( error, index ) {
		normalized.push({
			suspicious: error.suspicious,
			suggestions: error.suggestions ? toarray(error.suggestions.word) : []
		});
	});

	return normalized;

};
