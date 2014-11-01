var request = require('xhr');
var url = require('./url');

var CORS_PROXIES = ['http://cors.corsproxy.io?url=', 'http://www.corsproxy.com/'];

function getUrl ( text ) {
	var proxy = CORS_PROXIES[Math.floor(Math.random()*CORS_PROXIES.length)] + url(text);
	if ( /corsproxy\.com/.test(proxy) ) {
		proxy = proxy.replace(/http:\/\/(?=hacheck)/,'');
	}
	return proxy;
}

module.exports = function ( text, cb ) {

	request({
		url: getUrl(text),
		method: 'get',
		timeout: 10000,
		useXDR: true,
		response: true
	}, function ( err, resp, body ) {
		cb(body);
	});

};
