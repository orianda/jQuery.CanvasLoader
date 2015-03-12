"use strict";

var gulp = require('gulp-help')(require('gulp'));

gulp.task('jshint', 'JsHint check for source files.', function () {
    var jshint = require('gulp-jshint');
    return gulp.src('src/**/*.js')
        .pipe(jshint({
            lookup : true
        }))
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('cleanup', 'Remove dist folder and its content.', function (callback) {
    var del = require('del');
    del('dist', callback);
});

gulp.task('build:style', 'Concatenate style files into one file and prepend the banner.', function () {
    var concat = require('gulp-concat'),
        header = require('gulp-header'),
        pkg = require('./package.json'),
        fs = require('fs'),
        banner = fs.readFileSync('banner.txt', 'utf8');
    return gulp.src('src/**/*.css')
        .pipe(concat(pkg.name + '-' + pkg.version + '.css'))
        .pipe(header(banner, {pkg : pkg}))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:style:compress', 'Compress style files.', function () {
    var sourcemaps = require('gulp-sourcemaps'),
        minify = require('gulp-minify-css'),
        rename = require('gulp-rename');
    return gulp.src('dist/**/*.css')
        .pipe(rename({
            suffix : '.min'
        }))
        .pipe(sourcemaps.init())
        .pipe(minify({
            keepSpecialComments : true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:script', 'Concatenate script files into one file and prepend the banner.', function () {
    var concat = require('gulp-concat'),
        header = require('gulp-header'),
        pkg = require('./package.json'),
        fs = require('fs'),
        banner = fs.readFileSync('banner.txt', 'utf8');
    return gulp.src('src/**/*.js')
        .pipe(concat(pkg.name + '-' + pkg.version + '.js'))
        .pipe(header(banner, {pkg : pkg}))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:script:compress', 'Compress script files.', function () {
    var sourcemaps = require('gulp-sourcemaps'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename');
    return gulp.src('dist/**/*.js')
        .pipe(rename({
            suffix : '.min'
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify({
            output : {
                comments : /@preserve|@license|@cc_on/i
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', 'Build distribution content', function (callback) {
    var runSequence = require('run-sequence');
    runSequence(
        ['jshint', 'cleanup'],
        ['build:style', 'build:script'],
        ['build:style:compress', 'build:script:compress'],
        callback
    );
});

gulp.task('update:node', 'Update npm modules.', function (callback) {
    var exec = require('child_process').exec;
    exec('npm update', callback);
});

gulp.task('update:bower', 'Update bower components.', function (callback) {
    var exec = require('child_process').exec;
    exec('bower update', callback);
});

gulp.task('update', 'Update npm and bower dependencies.', [
    'update:node',
    'update:bower'
]);

gulp.task('version', 'Latest project version', function () {
    var bower = require('./bower.json');
    console.log('Version:', bower.version);
});