var expect = require('expect.js');
var fixture = require('./fixtures/data');
var hascheck = require('../src/hascheck');

describe('call', function () {

	var results;

	describe('first time calling', function () {

		this.timeout(10000);

		before(function ( done ) {
			hascheck(fixture.check.yes.input, function ( errors ) {
				results = errors;
				done();
			});
		});

		it('should return array', function () {
			expect(results).to.be.an('array');
		});
		it('should have 3 errors', function () {
			expect(results).to.have.length(3);
		});
		it('should have 3 errors matching fixture output', function () {
			expect(results).to.eql(fixture.check.yes.output);
		});
	});

	describe('get cached value', function () {

		before(function ( done ) {
			hascheck(fixture.check.yes.input, function ( errors ) {
				results = errors;
				done();
			});
		});

		it('should have 3 results returned from cache', function () {
			expect(results).to.have.length(3);
		});
		it('should have 3 results returned from cache matching fixture output', function () {
			expect(results).to.eql(fixture.check.yes.output);
		});

	});

	describe('done sans results', function () {

		var noResults;

		this.timeout(10000);

		before(function ( done ) {
			hascheck(fixture.check.no.input, function ( errors ) {
				noResults = errors;
				done();
			});
		});

		it('should return array', function () {
			expect(noResults).to.be.an('array');
		});
		it('should have 0 results', function () {
			expect(noResults).to.have.length(0);
		});
		it('should have 3 results matching fixture output', function () {
			expect(noResults).to.eql(fixture.check.no.output);
		});

	});

});
