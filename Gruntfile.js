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
		}

	});

	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['copy', 'coffee', 'uglify']);

};

