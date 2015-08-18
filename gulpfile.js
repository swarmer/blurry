'use strict';

var gulp  = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var path = require('path');
var bower = require('gulp-bower');
var autoprefixer = require('autoprefixer-core');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');


var staticFiles = ['blurry/**'];
var buildDest = 'build/';

function copyBowerPackage(name, files) {
    return gulp.src(path.join('bower_components/', name, files))
        .pipe(gulp.dest(path.join(buildDest, 'static/dist/', name)));
}

gulp.task('clean', function (done) {
    del(path.join(buildDest, '*'), done);
});

gulp.task('copyStatic', ['clean'], function () {
    return gulp.src(staticFiles)
        .pipe(gulp.dest(buildDest));
});

gulp.task('bower-install', ['clean'], function () {
    return bower();
});

gulp.task('bower', ['bower-install'], function () {
    return merge(
        copyBowerPackage('bootstrap', 'dist/**'),
        copyBowerPackage('jquery', 'dist/**'),
        copyBowerPackage('underscore', '*'),
        copyBowerPackage('sprintf', 'dist/**')
    );
});

gulp.task('css', ['copyStatic'], function () {
    var processors = [
        autoprefixer({
            browsers: 'last 2 versions'
        }),
        cssnano({
            autoprefixer: false,
            merge: false,
            idents: false,
            unused: false,
            zindex: false
        })
    ];
    return gulp.src(path.join(buildDest, 'static/*.css'))
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(postcss(processors))
            .pipe(rename({extname: '.min.css'}))
        .pipe(sourcemaps.write('.', {sourceRoot: '/static/'}))
        .pipe(gulp.dest(path.join(buildDest, 'static/')));
});

gulp.task('uglify', ['copyStatic'], function() {
  return gulp.src([
        path.join(buildDest, 'static/*.js'),
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('.', {sourceRoot: '/static/'}))
    .pipe(gulp.dest(path.join(buildDest, 'static/')));
});

gulp.task('build', ['copyStatic', 'bower', 'css', 'uglify']);

gulp.task('watch', function () {
    gulp.watch([staticFiles, 'bower.json'], ['build']);
});

gulp.task('default', ['build']);
