// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');
var connect = require('gulp-connect');
var swig = require('gulp-swig');
var stylus = require('gulp-stylus');

// 启动本地服务
// gulp.task('webserver', function() {
//   gulp.src('src')
//     .pipe(webserver({
//       livereload: true,
//       directoryListing: true,
//       open: true,
//       fallback: 'index.html'
//     }));
// });

// 启动本地服务
gulp.task('connect', function() {
  connect.server({
    host: 'local.vip.yy.com',
    port: 3002,
    root: 'build',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./build/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./build/*.html'], ['html']);
});

// swig
gulp.task('templates', function() {
  gulp.src('./src/**/*.html')
      .pipe(swig())
      .pipe(gulp.dest('./build/'))
});     

// stylus
gulp.task('stylus', function () {
  gulp.src('./src/style/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./build/style/'));
});

// copy-js
gulp.task('copy', function () {
  gulp.src(['./src/**/*.js', './src/*.html'])
    .pipe(gulp.dest('./build/'));
});

// // copy-html
// gulp.task('copy-html', function () {
//   gulp.src(['./src/script/**/*.js', './src/*.html'])
//     .pipe(gulp.dest('./build/script/'));
// });

// default
gulp.task('default', ['copy', 'connect', 'watch']);