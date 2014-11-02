var expect = require('expect.js');
var fs = require('fs');
var each = require('foreach');
var parse = require('../src/parse');

describe('one suspicious word with suggestions', function () {

	var results = parse(fs.readFileSync(__dirname + '/fixtures/xml/one-result.xml','utf8'));

	it('should return array', function () {
		expect(results).to.be.an('array');
	});
	it('should have 1 error', function () {
		expect(results).to.have.length(1);
	});
	it('should have error which is object', function () {
		expect(results[0]).to.be.an('object');
	});
	it('should have suspicious word', function () {
		expect(results[0]).to.have.property('suspicious');
	});
	it('should have suggestions', function () {
		expect(results[0]).to.have.property('suggestions');
	});
	it('should have suggestions as array', function () {
		expect(results[0].suggestions).to.be.an('array');
	});

});

describe('one suspicious unknown word without suggestions', function () {

	var results = parse(fs.readFileSync(__dirname + '/fixtures/xml/one-result-unknown.xml','utf8'));

	it('should return array', function () {
		expect(results).to.be.an('array');
	});
	it('should have 1 error', function () {
		expect(results).to.have.length(1);
	});
	it('should have error which is object', function () {
		expect(results[0]).to.be.an('object');
	});
	it('should have suspicious word', function () {
		expect(results[0]).to.have.property('suspicious');
	});
	it('should have suggestions', function () {
		expect(results[0]).to.have.property('suggestions');
	});
	it('should have suggestions as array', function () {
		expect(results[0].suggestions).to.be.an('array');
	});

});

describe('multiple suspicious words with suggestions', function () {

	var results = parse(fs.readFileSync(__dirname + '/fixtures/xml/multiple-results.xml','utf8'));

	it('should return array', function () {
		expect(results).to.be.an('array');
	});
	it('should have 3 errors', function () {
		expect(results).to.have.length(3);
	});

	each(results, function ( error, index ) {
		it('should have error #'+(index+1)+' which is object', function () {
			expect(error).to.be.an('object');
		});
		it('should have error #'+(index+1)+' which has suspicious word', function () {
			expect(error).to.have.property('suspicious');
		});
		it('should have error #'+(index+1)+' which has suggestions', function () {
			expect(error).to.have.property('suggestions');
		});
		it('should have error #'+(index+1)+' which has suggestions as array', function () {
			expect(error.suggestions).to.be.an('array');
		});
	});
});
