var data = {
	check: {
		yes: {
			input: 'podjelio sjeta ljepo s tobom sa tobom',
			output: [{"suspicious":"ljepo","suggestions":["lijepo","ljeto"]},{"suspicious":"podjelio","suggestions":["podijelio","podjeli"]},{"suspicious":"sa tobom","suggestions":["s tobom"]}]
		},
		no: {
			input: 'lijepo',
			output: []
		}
	},
	getErrors: {
		input: 'podjelio sjeta ljepo s tobom sa tobom',
		output: ["ljepo","podjelio","sa tobom"]
	},
	getSuggestions: {
		input: 'podjelio sjeta ljepo s tobom sa tobom',
		output: [{"suspicious":"ljepo","suggestions":["lijepo","ljeto"]},{"suspicious":"podjelio","suggestions":["podijelio","podjeli"]},{"suspicious":"sa tobom","suggestions":["s tobom"]}]
	}
};

if (typeof(exports) === 'object') {
	module.exports = data;
}
