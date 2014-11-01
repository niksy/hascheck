var trim = require('trim');

module.exports = function ( text ) {
	return 'http://hacheck.tel.fer.hr/xml.pl?textarea=' + encodeURIComponent(trim(text));
};
