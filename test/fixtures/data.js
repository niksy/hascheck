module.exports = {
	check: {
		yes: {
			input: 'podjelio sjeta ljepo s tobom sa tobom',
			output: [{"suspicious":"ljepo","suggestions":["lijepo","ljeto"]},{"suspicious":"podjelio","suggestions":["podijelio","podjeli"]},{"suspicious":"sa tobom","suggestions":["s tobom"]}]
		},
		no: {
			input: 'lijepo',
			output: []
		}
	}
};
