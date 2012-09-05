/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:opensong.jquery.json>',
    
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },

    coffee: {
      app: {
        src: ['src/**/*.coffee'],
        dest: 'dist',
        options: {
          bare: false
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
    
    mocha: {
      index: ['specs/index.html']
    },
    
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    
    server: {
      port: 8000,
      base: '.'
    },
    reload: {
      port: 3000,
      proxy: {
        host: 'localhost',
        port: '8000'
      }
    },

    watch: {
      coffee: {
        files: 'src/**/*.coffee',
        tasks: 'coffee coffeelint'
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
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('wait', 'Wait forever.', function() {
    grunt.log.write('Waiting...');
    this.async();
  });

  // Default task.
  grunt.registerTask('default', 'server reload watch');

  // TODO: add dist and test task
  //grunt.registerTask('dist', 'server reload watch');
  //grunt.registerTask('test', 'server reload watch');
};
