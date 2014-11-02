var indexOf = require('component-indexof');
var services;

var CAN_SET_HEADERS             = !('XDomainRequest' in window);
var IS_SECURE_CONNECTION        = /^https:\/\//.test(location.href);
var SECURE_CORS_PROXIES         = ['//www.corsproxy.com/'];
var SECURE_CORS_PROXIES_HEADERS = ['//cors-anywhere.herokuapp.com/'];
var CORS_PROXIES                = ['//cors.corsproxy.io?url='];

function getHeaders ( service ) {
	if ( indexOf(SECURE_CORS_PROXIES_HEADERS, service) === -1 || !CAN_SET_HEADERS ) {
		return false;
	}
	return {
		'X-Requested-With': 'XMLHttpRequest'
	};
}

function getServices () {
	var arr = [].concat(SECURE_CORS_PROXIES);
	if ( CAN_SET_HEADERS ) {
		arr = arr.concat(SECURE_CORS_PROXIES_HEADERS);
	}
	if ( !IS_SECURE_CONNECTION ) {
		arr = arr.concat(CORS_PROXIES);
	}
	return arr;
}

function getUrl ( service, url ) {
	var finalUrl = service + url;
	if ( /corsproxy\.com/.test(finalUrl) ) {
		finalUrl = finalUrl.replace(/corsproxy\.com\/https?:\/\//,'corsproxy.com/');
	}
	return finalUrl;
}

function getService ( url ) {
	services = services || getServices();
	var service = services[Math.floor(Math.random()*services.length)];
	return {
		url: getUrl(service, url),
		headers: getHeaders(service)
	};
}

module.exports = getService;
