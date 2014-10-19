module.exports = function ( grunt ) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		meta: {
			banner: '/*! <%= pkg.name %> <%= pkg.version %> - <%= pkg.description %> | Author: <%= pkg.author %>, <%= grunt.template.today("yyyy") %> | License: <%= pkg.license %> */\n'
		},

		concat: {
			dist: {
				options: {
					stripBanners: true,
					banner: '<%= meta.banner %>'
				},
				files: {
					'dist/hascheck.js': ['src/out/hascheck.js']
				}
			}
		},

		uglify: {
			dist: {
				options: {
					banner: '<%= meta.banner %>'
				},
				files: {
					'dist/hascheck.min.js': ['src/out/hascheck.js']
				}
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: '',
				push: false
			}
		},

		jscs: {
			main: {
				options: {
					config: '.jscsrc'
				},
				files: {
					src: [
						'src/hascheck.js'
					]
				}
			}
		},

		jshint: {
			main: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: [
					'src/hascheck.js'
				]
			}
		},

		browserify: {
			options: {
				bundleOptions: {
					standalone: 'hascheck'
				}
			},
			dist: {
				files: {
					'src/out/hascheck.js': ['src/hascheck.js']
				}
			},
			test: {
				files: {
					'test/out/test.js': ['test/test.js']
				}
			},
			watch: {
				options: {
					watch: true,
					keepAlive: true
				},
				files: {
					'src/out/hascheck.js': ['src/hascheck.js']
				}
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},

		mochaTest: {
			unit: {
				options: {
					reporter: 'spec'
				},
				src: ['test/test.js']
			}
		}

	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('stylecheck', ['jshint:main', 'jscs:main']);
	grunt.registerTask('default', ['browserify:dist','concat:dist', 'uglify:dist']);
	grunt.registerTask('watch', ['browserify:watch']);
	grunt.registerTask('test', ['browserify:test','mochaTest:unit','karma:unit',]);
	grunt.registerTask('releasePatch', ['bump-only:patch', 'default', 'bump-commit']);
	grunt.registerTask('releaseMinor', ['bump-only:minor', 'default', 'bump-commit']);
	grunt.registerTask('releaseMajor', ['bump-only:major', 'default', 'bump-commit']);

};
