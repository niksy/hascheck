var request = require('xhr');
var url = require('./url');

var SECURE_CORS_PROXIES = ['//www.corsproxy.com/'];
var CORS_PROXIES        = ['//cors.corsproxy.io?url='].concat(SECURE_CORS_PROXIES);
var proxies             = /^https:\/\//.test(location.href) ? SECURE_CORS_PROXIES : CORS_PROXIES;

function getUrl ( text ) {

	var proxy = proxies[Math.floor(Math.random()*proxies.length)] + url(text);

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
