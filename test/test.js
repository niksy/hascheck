var expect = require('expect.js');
var fixture = require('./fixtures/data');
var hascheck = require('../src/hascheck');
var Promise = require('es6-promise').Promise;

describe('check', function () {

	var results;

	describe('promise', function () {

		describe('done with results', function () {

			this.timeout(10000);

			before(function ( done ) {
				hascheck.check(fixture.check.yes.input)
					.then(function ( errors ) {
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

		describe('get', function () {

			before(function ( done ) {
				results = hascheck.check(fixture.check.yes.input);
				done();
			});

			it('should return promise', function () {
				expect(results).to.be.a(Promise);
			});
			it('should have 3 results returned from promise', function () {
				results.then(function ( errors ) {
					expect(errors).to.have.length(3);
				});
			});
			it('should have 3 results returned from promise matching fixture output', function () {
				results.then(function ( errors ) {
					expect(errors).to.eql(fixture.check.yes.output);
				});
			});

		});

	});

	describe('done sans results', function () {

		var noResults;

		this.timeout(10000);

		before(function ( done ) {
			hascheck.check(fixture.check.no.input)
				.then(function ( errors ) {
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

describe('getErrors', function () {

	var results;

	describe('callback', function () {

		this.timeout(10000);

		before(function ( done ) {
			hascheck.getErrors(fixture.getErrors.input, function ( errors ) {
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
			expect(results).to.eql(fixture.getErrors.output);
		});

	});

	describe('get', function () {

		before(function ( done ) {
			results = hascheck.getErrors(fixture.getErrors.input);
			done();
		});

		it('should return array', function () {
			expect(results).to.be.an('array');
		});
		it('should have 3 errors', function () {
			expect(results).to.have.length(3);
		});
		it('should have 3 errors matching fixture output', function () {
			expect(results).to.eql(fixture.getErrors.output);
		});

	});

});

describe('getSuggestions', function () {

	var results;

	describe('callback', function () {

		this.timeout(10000);

		before(function ( done ) {
			hascheck.getSuggestions(fixture.getSuggestions.input, function ( suggestions ) {
				results = suggestions;
				done();
			});
		});

		it('should return array', function () {
			expect(results).to.be.an('array');
		});
		it('should have 3 suggestions', function () {
			expect(results).to.have.length(3);
		});
		it('should have 3 suggestions matching fixture output', function () {
			expect(results).to.eql(fixture.getSuggestions.output);
		});

	});

	describe('get', function () {

		before(function ( done ) {
			results = hascheck.getSuggestions(fixture.getSuggestions.input);
			done();
		});

		it('should return array', function () {
			expect(results).to.be.an('array');
		});
		it('should have 3 suggestions', function () {
			expect(results).to.have.length(3);
		});
		it('should have 3 suggestions matching fixture output', function () {
			expect(results).to.eql(fixture.getSuggestions.output);
		});

	});

	describe('data', function () {

		it('should have first suggestion with suspicious property "ljepo"', function () {
			expect(results[0].suspicious).to.equal('ljepo');
		});
		it('should have second suggestion with first suggestion "podijelio"', function () {
			expect(results[1].suggestions[0]).to.equal('podijelio');
		});
		it('should have third suggestion with 1 suggestion', function () {
			expect(results[2].suggestions).to.have.length(1);
		});

	});

});
