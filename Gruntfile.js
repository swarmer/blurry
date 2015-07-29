module.exports = function(grunt) {
  var distPath = 'build/static/dist/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      all: {
        files: ['blurry/**'],
        tasks: ['default'],
      },
    },

    postcss: {
      options: {
        map: {
          inline: false,
        },

        processors: [
          require('autoprefixer-core')({
            browsers: 'last 2 versions'
          }),
          require('cssnano')({
            autoprefixer: false,
            merge: false,
            idents: false,
            unused: false,
            zindex: false
          })
        ]
      },

      custom: {
        files: [
          {
            expand: true,
            src: ['build/static/*.css'],
            dest: './',
            ext: '.min.css',
          },
        ]
      }
    },

    bower: {
      dev: {
        dest: distPath,

        options: {
          stripGlobBase: true,
          expand: true,

          packageSpecific: {
            bootstrap: {
              files: [
                'dist/**'
              ]
            },

            jquery: {
              files: [
                'dist/*'
              ]
            },

            underscore: {
              stripGlobBase: false,

              files: [
                'underscore-min.js',
                'underscore-min.map'
              ]
            },

            'components-font-awesome': {
              stripGlobBase: false,

              files: [
                'css/*',
                'fonts/*'
              ]
            }
          }
        }
      }
    },

    clean: {
      build: {
        src: ['build/*']
      }
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'blurry/',
            src: '**',
            dest: 'build/'
          }
        ]
      }
    },

    uglify: {
      options: {
        mangle: false,
        sourceMap: true,
        compress: {
          sequences: false,
          join_vars: false
        }
      },
      custom: {
        files: [
          {
            expand: true,
            src: ['build/static/*.js'],
            dest: './',
            ext: '.min.js',
          },
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default',
    ['clean:build', 'copy:build', 'bower',
      'postcss:custom', 'uglify:custom']);
};
