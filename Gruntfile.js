module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Convert LESS into CSS:

    // Concat JavaScript files and Examples:
    concat: {
      // Concat the ChocolateChipJS files together:
      chocolatechip: {      
        options: {
          banner: '/*\n    pO\\\n   6  /\\\n     /OO\\\n    /OOOO\\\n  /OOOOOOOO\\\n ((OOOOOOOO))\n  \\:~=++=~:/\n\n<%= pkg.title %>\nChocolateChip.js\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        src: [
          "src/chocolatechip/start.js",
          "src/chocolatechip/returnResult.js",
          "src/chocolatechip/selectors.js",
          "src/chocolatechip/extend.js",
          "src/chocolatechip/core.js",
          "src/chocolatechip/plugin.js",
          "src/chocolatechip/cache.js",
          "src/chocolatechip/collection.js",
          "src/chocolatechip/domready.js",
          "src/chocolatechip/string.js",
          "src/chocolatechip/form.js", 
          "src/chocolatechip/ajax.js",
          "src/chocolatechip/feature-detection.js",
          "src/chocolatechip/templates.js",
          "src/chocolatechip/pubsub.js",
          "src/chocolatechip/deferred.js",
          "src/chocolatechip/expose-chocolatechip.js",
          "src/chocolatechip/end.js"
        ],
        dest: '<%= pkg.project_path %>js/chocolatechip-<%= pkg.version %>.js'
      },
      tests : {
        options: {
          banner: "<!doctype html>\n<html>\n   <head>\n      <meta charset='UTF-8' />\n      <meta http-equiv='content-type' content='text/html; charset=utf-8' />\n      <title>QUnit ChocolateChipJS</title>\n      <link rel='stylesheet' href='../qunit/qunit.css'>\n      <script src='../../js/chocolatechip-<%= pkg.version %>.js'></script>\n      <script src='../qunit/qunit.js'></script>\n  </head>\n"
        },
        files: [
          {
            expand: true,
            cwd: 'src/tests/',
            src: ['**/*.html'],
            dest: '<%= pkg.project_path %>tests/'
          }
        ]
      },

    },
    // Minify JavaScript files:
    uglify: {
      chocolatechip: {
        options: {
          banner: '/*\nChocolateChip-UI\nChocolateChip.js\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        files: {'<%= pkg.project_path %>js/chocolatechip-<%= pkg.version %>.min.js': ['js/chocolatechip-<%= pkg.version %>.js']
        }
      }
    },
    
    // Copy files out of src directory:
    copy: {
      tests: {
        files: [
          {
            expand: true,
            cwd: 'src/tests/',
            src: ['**/*.js'],
            dest: '<%= pkg.project_path %>tests/'
          }
        ]
      },
      qunit : {
        files : [
          {
            expand: true,
            cwd: 'src/tests/qunit/',
            src: ['*.css'],
            dest: '<%= pkg.project_path %>tests/qunit/'
          }
        ]
      }
    },
    // Run JsHint on JavaScript files:
    // Rules to follow for linting:
    jshint: {
      options: {
          curly: false,
          browser: true,
          eqeqeq: true,
          forin: false,
          immed: false,
          expr: false,
          indent: false,
          noempty: true,
          plusplus: false,
          unused: false,
          boss: true,
          evil: true,
          laxbreak: true,
          multistr: true,
          scripturl: true,
          '-W030': true,
          '-W083': false
      },
      chocolatechip: ['<%= pkg.project_path %>js/chocolatechip-<%= pkg.version %>.js']
    }
  });

  // Tasks:
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  // Default build:
  grunt.registerTask('default', ['concat:chocolatechip','concat:tests', 'uglify', 'copy', 'jshint']);
};