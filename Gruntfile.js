/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			build: ["temp", "dist"]
		},

		copy: {
			bower: {
				files: [
					{expand: true, flatten: true, src: ['bower_components/jquery/jquery.js'], dest: 'temp/src/'},
					{expand: true, flatten: true, src: ['bower_components/handlebars/handlebars.runtime.js'], dest: 'temp/src/'},
					{expand: true, flatten: true, src: ['bower_components/i18next/release/i18next-1.6.3.min.js'], dest: 'dist/'}
				]
			},
			locales: {
				files: [
					{src: 'locales/**', dest: 'dist/'}
				]
			}
		},

		coffee: {
			app: {
				options: {
					bare: true,
					sourceMap: true
				},
				expand: true,
				cwd: 'src',
				src: ['**/*.coffee'],
				dest: 'temp/src',
				ext: '.js'
			},
			specs: {
				expand: true,
				flatten: true,
				cwd: 'spec',
				src: ['**/*.coffee'],
				dest: 'temp/spec',
				ext: '.js'
			}
		},

		stylus: {
			compile: {
				options: {
					use: [
						//require('fluidity') // use stylus plugin at compile time
					],
				},
				files: {
					'dist/opensong.css': ['src/opensong.styl'],
				}
			}
		},

		recess: {
			options: {
				compile: true
			},
			bootstrap: {
				src: ['src/bootstrap.less'],
				dest: 'dist/bootstrap.custom.css'
			},
			min: {
				options: {
					compress: true
				},
				src: ['dist/opensong.css', 'dist/bootstrap.custom.css'],
				dest: 'dist/opensong.min.css'
			}
		},

		handlebars: {
			compile: {
				options: {
					namespace: "JST"
				},
				files: {
					"temp/src/opensong.hbs.js": "src/opensong.hbs"
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				sourceMap: 'dist/opensong.min.map',
				sourceMapRoot: 'temp/src/' // the location to find your original source
				//	sourceMapIn: 'temp/opensong.map'  // input sourcemap from a previous compilation
			},
			build: {
				files: {
					'dist/opensong.min.js': ['temp/src/*.js']
				}
			}
		},

		connect: {
			server: {
				options: {
					hostname: "*",
					port: 9001
				}
			}
		},

		watch: {
			coffee_app: {
				files: ['src/**/*.coffee'],
				tasks: ['coffee:app', 'uglify']
			},
			coffee_specs: {
				files: ['spec/**/*.coffee'],
				tasks: ['coffee:specs']
			},
			handlebars: {
				files: ['src/**/*.hbs'],
				tasks: ['handlebars', 'uglify']
			},
			stylus: {
				files: ['src/**/*.styl'],
				tasks: ['stylus']
			},
			specs: {
				files: ['temp/spec/**/*.js', 'dist/**/*.js'],
				tasks: ['jasmine']
			},
			livereload: {
				files: ['index.html', 'dist/**'],
				options: {
					livereload: true
				}
			}
		},

		jasmine: {
			testing: {
				src: 'dist/opensong.min.js',
				options: {
					specs: 'temp/spec/*Spec.js',
					helpers: 'temp/spec/*Helper.js'
				}
			}
		},

		open: {
			dev: {
				path: 'http://127.0.0.1:9001'
			}
		},

		'gh-pages': {
			src: ['index.html', 'dist/**/*', 'demo/*']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-gh-pages');

	grunt.registerTask('compile', ['coffee', 'stylus', 'recess', 'handlebars']);
	grunt.registerTask('build', ['clean', 'copy', 'compile', 'uglify']);
	grunt.registerTask('dev', ['build', 'connect', 'open', 'watch']);
	grunt.registerTask('test', ['build', 'jasmine']);
	grunt.registerTask('deploy', ['test', 'gh-pages']);

	grunt.registerTask('default', ['build']);

};

// vim: set noexpandtab :
