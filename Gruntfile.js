/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			bower: {
				files: [
					{expand: true, flatten: true, src: ['components/jquery/jquery.js'], dest: 'temp/'},
					{expand: true, flatten: true, src: ['components/handlebars/handlebars.js'], dest: 'temp/'}
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
				dest: 'temp/',
				ext: '.js'
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: {
					'dist/opensong.min.js': ['temp/*.js']
				}
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
			livereload: {
				files: ['index.html', 'dist/**'],
				options: {
					livereload: true
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['copy', 'coffee', 'uglify']);
	grunt.registerTask('dev', ['default', 'connect', 'watch']);

};

