const { src, dest, series, parallel } = require('gulp');

// html tasks
function htmlTask() {
  return src('src/*.html')
  .pipe(dest('dist'));
}

//script tasks
function scriptTask() {
  return src('src/js/*.js')
  .pipe(dest('dist/js'));
}

//style tasks
function styleTask() {
  return src('src/css/*.css')
  .pipe(dest('dist/css'));
}

//images tasks
function imagesTask() {
  return src('src/images/*.png')
  .pipe(dest('dist/images'));
}

exports.default = series(htmlTask, scriptTask, styleTask, imagesTask);