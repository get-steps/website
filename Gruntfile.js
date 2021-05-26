const path = require('path');
const sass = require('node-sass');
const stylelint = require('stylelint');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-shopify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-stylelint');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('@lodder/grunt-postcss');

  const is_production = grunt.option('env') === 'production';
  const credentials = is_production
    ? ''
    : grunt.file.readJSON('credentials.json');

  grunt.initConfig({
    credentials: credentials,

    shopify: {
      options: {
        api_key: credentials.api_key,
        password: credentials.password,
        url: credentials.url,
        theme: credentials.theme_id,
        base: 'shop/'
      }
    },

    copy: {
      css: {
        expand: true,
        flatten: true,
        src: './temp/css/*',
        dest: './shop/assets/'
      }
    },

    concurrent: {
      upload_css_js: ['watch', 'exec:touch_css_js'],
      upload_assets: ['watch', 'exec:touch_assets'],
      upload_config: ['watch', 'exec:touch_config'],
      upload_layout: ['watch', 'exec:touch_layout'],
      upload_locales: ['watch', 'exec:touch_locales'],
      upload_snippets: ['watch', 'exec:touch_snippets'],
      upload_sections: ['watch', 'exec:touch_sections'],
      upload_templates: ['watch', 'exec:touch_templates'],
      options: {
        logConcurrentOutput: true // must be on to work with grunt watch
      }
    },

    exec: {
      touch_css_js: 'sleep 1 && touch shop/assets/*.css shop/assets/*.js',
      touch_config: 'sleep 1 && touch shop/config/*',
      touch_layout: 'sleep 1 && touch shop/layout/*',
      touch_locales: 'sleep 1 && touch shop/locales/*',
      touch_assets: 'sleep 2 && touch shop/assets/*',
      touch_sections: 'sleep 5 && touch shop/sections/*',
      touch_snippets: 'sleep 5 && touch shop/snippets/*',
      touch_templates: 'sleep 5 && touch shop/templates/*'
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: './shop/',
          keepalive: true
        }
      }
    },

    clean: {
      reset: ['shop/**/*.*']
    },

    sass: {
      development: {
        options: {
          implementation: sass,
          sourceMap: true,
          outputStyle: 'expanded',
          includePaths: ['./node_modules/']
        },
        files: [
          {
            expand: true,
            cwd: 'src/scss',
            src: ['*.scss'],
            dest: 'temp/css',
            ext: '.css'
          }
        ]
      },
      production: {
        options: {
          implementation: sass,
          outputStyle: 'compressed',
          sourceMap: false,
          includePaths: ['./node_modules/']
        },
        files: [
          {
            expand: true,
            cwd: 'src/scss',
            src: ['*.scss'],
            dest: 'temp/css',
            ext: '.css'
          }
        ]
      }
    },

    postcss: {
      options: {
        map: {
          inline: false
        },

        processors: [require('autoprefixer')()]
      },

      dist: {
        src: './temp/css/app.css'
      }
    },

    stylelint: {
      all: ['./src/scss/**']
    },

    pkg: grunt.file.readJSON('package.json'),

    webpack: {
      development: Object.assign(require('./webpack/config/dev.js'), {
        watch: false
      }),
      production: require('./webpack/config/prod.js')
    },

    environment: is_production ? 'production' : 'development',

    watch: {
      shopify: {
        files: ['shop/**'],
        tasks: ['shopify'],
        options: { livereload: true }
      },
      sass: {
        files: ['src/scss/**'],
        tasks: ['stylesheets:development']
      }
    },

    zip: {
      'long-format': {
        cwd: 'shop/',
        src: ['shop/**/*'],
        dest: `public/theme.zip`
      }
    }
  });

  grunt.event.on('watch', function(action, filepath) {
    if (path.extname(filepath) === '.scss') {
      stylelint
        .lint({
          files: [filepath],
          fix: true,
          formatter: 'string'
        })
        .then(({ errored, output }) => {
          if (errored) {
            console.log(output);
          }
        });
    }
  });

  grunt.registerTask('default', ['shopify']);

  grunt.registerTask('stylesheets:development', [
    'sass:development',
    'postcss',
    'copy:css'
  ]);

  grunt.registerTask('stylesheets:production', [
    'sass:production',
    'postcss',
    'copy:css'
  ]);

  grunt.registerTask('compile:development', [
    'stylelint',
    'stylesheets:development'
  ]);

  grunt.registerTask('compile:production', [
    'webpack:production',
    'stylelint',
    'stylesheets:production'
  ]);
};

/*
files: [
  'shop/!**!/!*.liquid',
  'shop/!**!/!*.css',
  'shop/!**!/!*.{png,jpg,jpeg,gif,svg}',
  'shop/!**!/!*.js',
  'shop/!**!/!*.json'
],*/
