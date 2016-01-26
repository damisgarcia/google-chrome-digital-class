'use strict'

// config
var DIST_FOLDER = "digitalclass/"

var gulp = require('gulp')
var debug = require('gulp-debug');
var domSrc = require('gulp-dom-src')
var ngAnnotate = require('gulp-ng-annotate')
var concat = require('gulp-concat')
var cssmin = require('gulp-cssmin')
var uglify = require('gulp-uglify')
var cheerio = require('gulp-cheerio')


// @Overide
gulp.copy = function(src,dest){
  return gulp.src(src, {base:"."}).pipe(gulp.dest(dest))
}

function css(src,filename){
  return domSrc({file:src,selector:'link',attribute:'href'})
        .pipe(debug())
        .pipe(concat(filename))
        .pipe(cssmin())
        .pipe(gulp.dest(DIST_FOLDER))
}

function js(src,filename) {
      return domSrc({ file: src, selector: 'script', attribute: 'src' })
            .pipe(debug())
            .pipe(concat(filename))
            .pipe(ngAnnotate())
            .pipe(uglify({mangle: false}))
            .pipe(gulp.dest(DIST_FOLDER))
}

function rename_scripts_styles(src,opts){
  return gulp.src(src)
    .pipe(cheerio(function ($) {

      if(opts.hasOwnProperty('javascript'))
        $('script').remove()
        $('body').append('<script src="'+opts.javascript+'"></script>')

      if(opts.hasOwnProperty('stylesheet'))
        $('link').remove()
        $('head').append('<link rel="stylesheet" href="'+opts.stylesheet+'">')

    }))
    .pipe(gulp.dest(DIST_FOLDER))
}

gulp.task('build', function () {
  // Index File
  js("index.html","digitalclass.min.js")
  css("index.html","digitalclass.min.css")
  rename_scripts_styles("index.html",{javascript:"digitalclass.min.js",stylesheet:"digitalclass.min.css"})
  // Background Filde
  js("background.html","digitalclass-background.min.js")
  rename_scripts_styles("background.html",{javascript:"digitalclass-background.min.js"})
  // Move Folders
  gulp.copy(
    [
      "app/templates/*",
      "app/views/*",
      "app/scripts/services/lib/OggVorbisEncoder.min.js",
      "app/scripts/services/lib/OggVorbisEncoder.min.js.mem",
      "app/scripts/services/lib/OggEncoderWorker.js",
      "app/styles/videogular.css",
      "fonts/*",
      "assets/**/*",
      "pnacl/**/*",
      "icon128.png",
      "manifest.json"
    ],
  DIST_FOLDER)

})
