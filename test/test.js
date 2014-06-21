var should = require('should');
var fixture = require('./fixtures/data');
var hascheck = require('../src/hascheck');

describe('check', function () {

	var results;

	describe('promise', function () {

		describe('done', function () {
			this.timeout(10000);

			before(function ( done ) {
				hascheck.check(fixture.check.yes.input)
					.done(function ( errors ) {
						results = errors;
						done();
					});
			});

			it('should return array', function () {
				results.should.be.an.Array;
			});
			it('should have 3 errors', function () {
				(results.length).should.equal(3);
			});
			it('should have 3 errors matching fixture output', function () {
				results.should.eql(fixture.check.yes.output);
			});
		});

		describe('get', function () {

			before(function ( done ) {
				results = hascheck.check(fixture.check.yes.input);
				done();
			});

			it('should return promise', function () {
				results.should.be.an.Object;
				results.should.have.property('promise');
			});
			it('should have 3 results returned from promise', function () {
				results.done(function ( errors ) {
					(errors.length).should.equal(3);
				});
			});
			it('should have 3 results returned from promise matching fixture output', function () {
				results.done(function ( errors ) {
					errors.should.eql(fixture.check.yes.output);
				});
			});

		});

	});

	describe('fail', function () {

		var noResults;

		this.timeout(10000);

		before(function ( done ) {
			hascheck.check(fixture.check.no.input)
				.done(function ( errors ) {
					noResults = errors;
					done();
				});
		});

		it('should return array', function () {
			noResults.should.be.an.Array;
		});
		it('should have 0 results', function () {
			(noResults.length).should.equal(0);
		});
		it('should have 3 results matching fixture output', function () {
			noResults.should.eql(fixture.check.no.output);
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
			results.should.be.an.Array;
		});
		it('should have 3 errors', function () {
			(results.length).should.equal(3);
		});
		it('should have 3 errors matching fixture output', function () {
			results.should.eql(fixture.getErrors.output);
		});

	});

	describe('get', function () {

		before(function ( done ) {
			results = hascheck.getErrors(fixture.getErrors.input);
			done();
		});

		it('should return array', function () {
			results.should.be.an.Array;
		});
		it('should have 3 errors', function () {
			(results.length).should.equal(3);
		});
		it('should have 3 errors matching fixture output', function () {
			results.should.eql(fixture.getErrors.output);
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
			results.should.be.an.Array;
		});
		it('should have 3 suggestions', function () {
			(results.length).should.equal(3);
		});
		it('should have 3 suggestions matching fixture output', function () {
			results.should.eql(fixture.getSuggestions.output);
		});

	});

	describe('get', function () {

		before(function ( done ) {
			results = hascheck.getSuggestions(fixture.getSuggestions.input);
			done();
		});

		it('should return array', function () {
			results.should.be.an.Array;
		});
		it('should have 3 suggestions', function () {
			(results.length).should.equal(3);
		});
		it('should have 3 suggestions matching fixture output', function () {
			results.should.eql(fixture.getSuggestions.output);
		});

	});

	describe('data', function () {

		it('should have first suggestion with suspicious property "ljepo"', function () {
			(results[0].suspicious).should.equal('ljepo');
		});
		it('should have second suggestion with first suggestion "podijelio"', function () {
			(results[1].suggestions[0]).should.eql("podijelio");
		});
		it('should have third suggestion with 1 suggestion', function () {
			(results[2].suggestions.length).should.equal(1);
		});

	});

});
