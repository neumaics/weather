var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var shell = require('gulp-shell');

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('build/app/assets/lib/'));
});

gulp.task('html', function() {
  return gulp.src('assets/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('js', function() {
  return gulp.src('assets/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/app/assets/js'))
});

gulp.task('config', function() {
  return gulp.src('config/*.js')
    .pipe(gulp.dest('build/config/'));
});

gulp.task('prod-dep-file', function() {
  return gulp.src(['package.json'])
    .pipe(gulp.dest('build/'));
});

gulp.task('prod-deps', ['prod-dep-file'], shell.task([
  'npm install --production'
], { cwd: 'build/' }));

gulp.task('server', ['config', 'prod-deps'], function() {
  return [
    gulp.src('models/**/*.js')
      .pipe(gulp.dest('build/models')),

    gulp.src('server.js')
      .pipe(gulp.dest('build/'))
  ];
});

gulp.task('default',[
  'bower',
  'js',
  'html',
  'server'
]);
