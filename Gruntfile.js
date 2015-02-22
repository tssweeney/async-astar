var tasks = ['jsbeautifier', 'jshint', 'simplemocha'];

module.exports = function(grunt) {

  grunt.initConfig({
    // Make sure the code looks good   
    jsbeautifier: {
      files: "<%= watch.files %>",
      options: {
        html: {
          indentSize: 2,
        },
        css: {
          indentSize: 2
        },
        js: {
          indentSize: 2,
        }
      }
    },

    // Make sure no incidental mistakes
    jshint: {
      all: "<%= watch.files %>",
      options: {
        // force: true
      }
    },

    // Test Suite
    simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },

      all: {
        src: ['tests/*.test.js']
      }
    },

    // Run on change of any files
    watch: {
      files: ['src/*.js', 'tests/*.js', 'package.json', 'Gruntfile.js'],
      tasks: tasks
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.registerTask('default', tasks.concat(['watch']));
};
