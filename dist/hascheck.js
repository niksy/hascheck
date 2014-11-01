/*! hascheck 0.4.4 - Interface to Hrvatski akademski spelling checker. | Author: Ivan Nikolić, 2014 | License: MIT */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.hascheck=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],2:[function(require,module,exports){
/*
xml2json v 1.1
copyright 2005-2007 Thomas Frank
This program is free software under the terms of the
GNU General Public License version 2 as published by the Free
Software Foundation. It is distributed without any warranty.
*/
xml2json = {
    parser: function (xmlcode, ignoretags, debug) {
        function deformateXml(str) {
            if (str)
                return str.replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&apos;/g, "'");
            return "";
        }
        function no_fast_endings(str) {
            var values = str.split("/>");
            for (var i = 1; i < values.length; i++) {
                var t = values[i - 1].substring(values[i - 1].lastIndexOf("<") + 1).split(" ")[0];
                values[i] = "></" + t + ">" + values[i];
            };
            str = values.join("");
            return str;
        }
        function isArray(obj) {
            return (Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) == "[object Array]");
        }
        
        var xmlobject = {};
        var x = '<JSONTAGWRAPPER>' + xmlcode + '</JSONTAGWRAPPER>';
        var cdatas = [];
        var cdataIndex = 0;
        while (x.indexOf("<![CDATA[") > 0) {
            var bindex = x.indexOf("<![CDATA[");
            var eindex = x.indexOf("]]>", bindex);
            cdatas.push(x.substring(bindex + 9, eindex));
            x = x.substring(0, bindex) + "§![CDATA[" + cdataIndex + "]]>" + x.substring(eindex + 3);
            cdataIndex++;
        }
        //		x=x.replace(/<\?[^>]*>/g,"").replace(/<\!--[^>]*-->/g,"");//好像是去註解?
        x = x.replace(/<\?[^>]*>/g, ""); //.replace(/<\!--[]*-->/g,"");
        while (x.indexOf("<!--") > 0) {
            var bindex = x.indexOf("<!--");
            var eindex = x.indexOf("-->", bindex);
            x = x.substring(0, bindex) + x.substring(eindex + 3);
        }
        x = x.replace(/\s*\/>/g, '/>');
        x = no_fast_endings(x);
        x = x.replace(/<\//g, "§");
        x = x.split("<");
        var y = [];
        var level = 0;
        var opentags = [];
        for (var i = 1; i < x.length; i++) {
            x[i] = x[i].replace("§![CDATA[", "<![CDATA[");
            var tagname = x[i].split(">")[0].replace(/\s+/g, " ");
            if (tagname.indexOf(" ") > 0)
                tagname = tagname.substring(0, tagname.indexOf(" "));
            opentags.push(tagname);
            level++;
            y.push(level + "<" + x[i].split("§")[0]);
            var ending = x[i];
            var endingProcess = false;
            while (ending.replace(/^\s+/g, '').indexOf("§" + opentags[opentags.length - 1]) >= 0) {
                if (opentags[opentags.length - 1] != tagname &&
                ending.indexOf("§" + opentags[opentags.length - 1]) > 0 &&
                ending.substring(0, ending.indexOf("§" + opentags[opentags.length - 1])).replace(/^[\s]*[>]\s+|\s+$/g, '') != "") {
                    y.push("" + (level + 1) + "<@text>" + ending.substring(0, ending.indexOf("§" + opentags[opentags.length - 1])).replace(/^[\s]*>/g, ''));
                }
                ending = ending.substring(ending.indexOf("§" + opentags[opentags.length - 1]) + opentags[opentags.length - 1].length + 2).replace(/^\s+>/g, '');
                xmlcode['aa'] = ending;
                level--;
                opentags.pop();
                endingProcess = true;
            }
            if (endingProcess && ending.replace(/^\s+|\s+$/g, '') != "") {
                y.push(level + 1 + "<@text>" + ending.replace(/^[\s]*>/g, ''));
            }
        };
        var oldniva = -1;
        var objname = "xmlobject";

        var currentObj = xmlobject;
        var parentStack = [];

        for (var i = 0; i < y.length; i++) {
            var niva = Number(y[i].split("<")[0]);
            var tagname = (y[i].split("<")[1].split(">")[0]).replace(/\s/g, ' ');
            var atts = tagname.match(/ ([^=]*)=[\s]*((\"[^\"|>]*\")|(\'[^\'|>]*\'))/g);
            if (tagname.indexOf(" ") > 0)
                tagname = tagname.substring(0, tagname.indexOf(" "));
            var rest = y[i].substring(y[i].indexOf(">") + 1);
            if (niva <= oldniva) {
                var tabort = oldniva - niva + 1;
                for (var j = 0; j < tabort; j++) {
                    currentObj = parentStack.pop();
                }
            };

            rest = rest.replace(/^\s+|\s+$/g, ''); //  .replace(/^\s+|\s+$/g, '') <=這個叫做trim()
            var isstring = false;
            if (rest != "") {
                if (rest.match(/\<\!\[CDATA\[[0-9]+\]\]\>/g)) {
                    rest = cdatas[Number(rest.replace(/\<\!\[CDATA\[/g, "").replace(/\]\]\>/g, ""))];
                    isstring = true;
                }
                else {
                    rest = deformateXml(rest);
                    isstring = true;
                }
            }
            else {
                if (atts || ((i + 1) < y.length && niva < Number(y[i + 1].split("<")[0]))) {
                    rest = {};
                }
                else {
                    rest = '';
                    isstring = true;
                }
            };
            if (atts) {
                if (isstring) {
                    rest = { "@text": rest };
                }
                rest["@"] = [];
                for (var m = 0; m < atts.length; m++) {
                    var attname = atts[m].substring(0, atts[m].indexOf("=")).replace(/^\s+|\s+$/g, '');
                    var attvalue = atts[m].substring(atts[m].indexOf("=") + 1).replace(/^\s+/g, '');
                    ;
                    if (attvalue != attvalue.replace(/^\'+|\'+$/g, ''))
                        attvalue = attvalue.replace(/^\'+|\'+$/g, '');
                    else
                        attvalue = attvalue.replace(/^\"+|\"+$/g, '');
                    rest["@"].push(attname);
                    if (!rest[attname]) {
                        rest[attname] = deformateXml(attvalue);
                    }
                }
            }
            var already = false;
            for (k in currentObj) {
                if (k == tagname) {
                    already = true;
                    break;
                }
            }
            if (already) {
                if (!isArray(currentObj[tagname])) {
                    currentObj[tagname] = [currentObj[tagname]];
                }
                currentObj[tagname].push(rest);
            }
            else {
                currentObj[tagname] = rest;
            }
            parentStack.push(currentObj);
            currentObj = rest;
            oldniva = niva;
        };
        var result = xmlobject.JSONTAGWRAPPER;
        if (debug) {
            result = this.show_json_structure(result, debug);
        };
        return result;
    },
    show_json_structure: function (obj, debug, l) {
        var x = '';
        try {
            if (!obj) {
                if (obj === null || obj === undefined) {
                    x += '' + obj + ',\n';
                }
                else {
                    x += "'" + obj + "',\n";
                }
            }
            else {
                var objType = typeof obj;
                if (Array.isArray ? Array.isArray(obj) : (obj == null ? String(obj) : (Object.prototype.toString.call(obj) == "[object Array]"))) { //obj isArray
                    x += "[\n";
                    for (var i in obj) {
                        //x += "'" + i.replace(/\'/g, "\\'") + "':";
                        x += this.show_json_structure(obj[i], false, 1);
                    };
                    x += "],\n";
                }
                else {
                    if (objType == 'number' || objType == 'string' || objType == 'boolean') {//obj isValueType
                        x += "'" + ("" + obj).replace(/\'/g, "\\'").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r") + "',\n";
                    }
                    else {
                        if (objType == "function") {
                            var v = obj + "";
                            x += v.substr(0, v.indexOf('{')) + "{\n...,\n},\n";
                        }
                        else {
                            x += "{\n";
                            for (var i in obj) {
                                x += "'" + i.replace(/\'/g, "\\'") + "':";
                                x += this.show_json_structure(obj[i], false, 1);
                            };
                            x += "},\n";
                        }
                    }
                }
            }
        }
        catch (err) {
            x += err + ",\n";
        }
        //        if (!obj) {
        //            return '' + obj;
        //        }
        //        if (obj.sort) {
        //            x += "[\n";
        //        }
        //        else {
        //            x += "{\n";
        //        };
        //        for (var i in obj) {
        //            if (!obj.sort) {
        //                x += "'" + i.replace(/\'/g, "\\'") + "':";
        //            };
        //            if (typeof obj[i] == "object") {
        //                x += this.show_json_structure(obj[i], false, 1);
        //            }
        //            else {
        //                if (typeof obj[i] == "function") {
        //                    var v = 'function'//obj[i] + "";
        //                    //v=v.replace(/\t/g,"");
        //                    x += v;
        //                }
        //                else
        //                    if (typeof obj[i] != "string") {
        //                        x += obj[i] + ",\n";
        //                    }
        //                    else {
        //                        x += "'" + obj[i].replace(/\'/g, "\\'").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r") + "',\n";
        //                    }
        //            }
        //        };
        //        if (obj.sort) {
        //            x += "],\n";
        //        }
        //        else {
        //            x += "},\n";
        //        };
        if (!l) {
            x = x.substring(0, x.lastIndexOf(","));
            x = x.replace(new RegExp(",\n}", "g"), "\n}");
            x = x.replace(new RegExp(",\n]", "g"), "\n]");
            var y = x.split("\n");
            x = "";
            var lvl = 0;
            for (var i = 0; i < y.length; i++) {
                if (y[i].indexOf("}") >= 0 || y[i].indexOf("]") >= 0) {
                    lvl--;
                };
                tabs = "";
                for (var j = 0; j < lvl; j++) {
                    tabs += "\t";
                };
                x += tabs + y[i] + "\n";
                if (y[i].indexOf("{") >= 0 || y[i].indexOf("[") >= 0) {
                    lvl++;
                }
            };
            if (debug == "html") {
                x = x.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                x = x.replace(/\n/g, "<BR>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
            };
            if (debug == "compact") {
                x = x.replace(/\n/g, "").replace(/\t/g, "");
            }
        };
        return x;
    }
};

module.exports.xml2obj = function (xmlcode, ignoretags, debug) {
    return xml2json.parser(xmlcode, ignoretags, debug);
};
},{}],3:[function(require,module,exports){
module.exports = function(item) {
  if(item === undefined)  return [];
  return Object.prototype.toString.call(item) === "[object Array]" ? item : [item];
}
},{}],4:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],5:[function(require,module,exports){
var window = require("global/window")
var once = require("once")
var parseHeaders = require('parse-headers')

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ? XHR : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new XDR()
        }else{
            xhr = new XHR()
        }
    }

    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var key
    var load = options.response ? loadResponse : loadXhr

    if ("json" in options) {
        isJson = true
        headers["Accept"] = "application/json"
        if (method !== "GET" && method !== "HEAD") {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    // hate IE
    xhr.ontimeout = noop
    xhr.open(method, uri, !sync)
                                    //backward compatibility
    if (options.withCredentials || (options.cors && options.withCredentials !== false)) {
        xhr.withCredentials = true
    }

    // Cannot set timeout with sync request
    if (!sync) {
        xhr.timeout = "timeout" in options ? options.timeout : 5000
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }
    
    if ("beforeSend" in options && 
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr

    function readystatechange() {
        if (xhr.readyState === 4) {
            load()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = null

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === 'text' || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function getStatusCode() {
        return xhr.status === 1223 ? 204 : xhr.status
    }

    // if we're getting a none-ok statusCode, build & return an error
    function errorFromStatusCode(status) {
        var error = null
        if (status === 0 || (status >= 400 && status < 600)) {
            var message = (typeof body === "string" ? body : false) ||
                messages[String(status).charAt(0)]
            error = new Error(message)
            error.statusCode = status
        }

        return error
    }

    // will load the data & process the response in a special response object
    function loadResponse() {
        var status = getStatusCode()
        var error = errorFromStatusCode(status)
        var response = {
            body: getBody(),
            statusCode: status,
            statusText: xhr.statusText,
            raw: xhr
        }
        if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
            response.headers = parseHeaders(xhr.getAllResponseHeaders())
        } else {
            response.headers = {}
        }

        callback(error, response, response.body)
    }

    // will load the data and add some response properties to the source xhr
    // and then respond with that
    function loadXhr() {
        var status = getStatusCode()
        var error = errorFromStatusCode(status)

        xhr.status = xhr.statusCode = status
        xhr.body = getBody()
        xhr.headers = parseHeaders(xhr.getAllResponseHeaders())

        callback(error, xhr, xhr.body)
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}

},{"global/window":6,"once":7,"parse-headers":10}],6:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],8:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":9}],9:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],10:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":8,"trim":4}],11:[function(require,module,exports){
var trim = require('trim');
var each = require('foreach');
var toarray = require('toarray');

var cache = [];
var resolved = {};

/**
 * @param  {String} text
 *
 * @return {Object}
 */
function resolve ( text ) {
	text = trim(text);
	if ( !resolved[text] ) {
		resolved[text] = {
			called: text === '' ? true : false
		};
	}
	return resolved[text];
}

/**
 * @param  {String} text
 *
 * @return {Array}
 */
function get ( text ) {
	var result = {};
	each(cache, function ( value, index ) {
		if ( value.text === trim(text) ) {
			result = value;
			return false;
		}
	});
	return toarray(result.results);
}

/**
 * @param {String} text
 * @param {Array} results
 *
 * @return {}
 */
function set ( text, results ) {
	cache.push({
		text: trim(text),
		results: results
	});
}

module.exports = {
	resolve: resolve,
	get: get,
	set: set
};

},{"foreach":1,"toarray":3,"trim":4}],12:[function(require,module,exports){
var toarray = require('toarray');
var trim = require('trim');
var each = require('foreach');
var request = require('./request');
var parse = require('./parse');
var cache = require('./cache');

module.exports = function ( text, cb ) {

	var query = cache.resolve(text);

	if ( cache.get(text).length || trim(text) === '' || query.called ) {

		cb(cache.get(text));

	} else {

		query.called = true;

		request(text, function ( data ) {
			cache.set(text, parse(data));
			cb(cache.get(text));
		});

	}

};

},{"./cache":11,"./parse":13,"./request":14,"foreach":1,"toarray":3,"trim":4}],13:[function(require,module,exports){
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
			suggestions: toarray(error.suggestions.word)
		});
	});

	return normalized;

};

},{"foreach":1,"nodexml/xml2obj":2,"toarray":3}],14:[function(require,module,exports){
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

},{"./url":15,"xhr":5}],15:[function(require,module,exports){
var trim = require('trim');

module.exports = function ( text ) {
	return 'http://hacheck.tel.fer.hr/xml.pl?textarea=' + encodeURIComponent(trim(text));
};

},{"trim":4}]},{},[12])(12)
});