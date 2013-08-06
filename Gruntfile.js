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
					{expand: true, flatten: true, src: ['bower_components/handlebars/handlebars.runtime.js'], dest: 'temp/src/'}
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
					'dist/opensong.demo.css': ['src/opensong.styl', 'src/demo.styl']
				}
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
					port: 9001
				}
			}
		},

		watch: {
			coffee: {
				files: ['src/**/*.coffee', 'spec/**/*.coffee'],
				tasks: ['coffee', 'uglify']
			},
			stylus: {
				files: ['src/**/*.styl'],
				tasks: ['stylus']
			},
			livereload: {
				files: ['demo/index.html', 'dist/**'],
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

	grunt.registerTask('compile', ['coffee', 'stylus', 'handlebars']);
	grunt.registerTask('build', ['clean', 'copy', 'compile', 'uglify']);
	grunt.registerTask('dev', ['build', 'connect', 'watch']);
	grunt.registerTask('test', ['build', 'jasmine']);

	grunt.registerTask('default', ['build']);

};

// vim: set noexpandtab :
