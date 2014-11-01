var request = require('request');
var url = require('./url');

module.exports = function ( text, cb ) {

	request(url(text), function ( err, resp, body ) {
		cb(body);
	});

};
