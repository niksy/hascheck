// Return promise with list of suggestions
hascheck.check('podjelio sjeta ljepo').done().fail();

// Return array of errors (suspicious property)
hascheck.getErrors('podjelio sjeta ljepo');
hascheck.getErrors('podjelio sjeta ljepo', function ( errors ) {

});

// Return array: [{suspicious:String, suggestions:Array}, ...]
hascheck.getSuggestions('podjelio sjeta ljepo');
hascheck.getSuggestions('podjelio sjeta ljepo', function ( suggestions ) {

});

// Cache
var cache = [
	{
		text: 'podjelio sjeta ljepo',
		results: [
			{
				suspicious: 'podjelio',
				suggestions: ['podijeli', 'podjela']
			},
			{
				suspicious: 'ljepo',
				suggestions: ['lijepo']
			}
		]
	}
];
