/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',

    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */'
    },

    coffee: {
      app: {
        src: ['src/**/*.coffee'],
        options: {
          bare: true
        }
      },
      spec: {
        src: ['spec/**/*.coffee'],
        options: {
          bare: true
        }
      }
    },
    coffeelint: {
      app: ['src/**/*.coffee']
    },

    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    server: {
      port: 8000,
      base: '.'
    },
    reload: {
      port: 3001,
      proxy: {
        host: 'localhost',
        port: '8000'
      }
    },

    watch: {
      coffee: {
        files: ['src/**/*.coffee', 'spec/**/*.coffee'],
        tasks: 'coffee coffeelint concat'
      },
      reload: {
        files: ['dist/**'],
        tasks: 'reload'
      }
    },

    uglify: {}
  });

  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-reload');

  grunt.registerTask('wait', 'Wait forever.', function() {
    grunt.log.write('Waiting...');
    this.async();
  });

  grunt.registerTask('dist', 'coffee concat min');
  grunt.registerTask('default', 'dist server reload watch'); // Default task.
};

