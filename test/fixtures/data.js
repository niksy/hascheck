module.exports = {
	check: {
		yes: {
			input: 'podjelio ljepo čovijek sumljam počmem s tobom sa tobom kuča',
			output: [{suspicious:"počmem",suggestions:["počnem"]},{suspicious:"sumljam",suggestions:["smuljam","sukljam","sumnjam","mumljam"]},{suspicious:"kuča",suggestions:["kuća","Kuča","kiča","kula","kupa","kuša","luča","kauča","kučad","kučak","kučja","kučka","kučma","kača","kuba","kuca","kuda","kuga","kuha","kuja","kuka","kuma","kuna","kura","kusa","kuta","kuče","buča","puča","ruča","tuča","vuča" ] },{suspicious:"ljepo",suggestions:["lijepo","ljeto"]},{suspicious:"čovijek",suggestions:["čovjek","dovijek"]},{suspicious:"podjelio",suggestions:["podijelio","podjeli"]},{suspicious:"sa tobom",suggestions:["s tobom"]}]
		},
		no: {
			input: 'lijepo',
			output: []
		}
	}
};
