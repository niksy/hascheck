var request = require('xhr');
var url = require('./url');
var corsService = require('./cors-service');

module.exports = function ( text, cb ) {

	var service = corsService(url(text));

	request({
		url: service.url,
		method: 'get',
		timeout: 10000,
		useXDR: true,
		response: true,
		headers: service.headers
	}, function ( err, resp, body ) {
		cb(body);
	});

};
