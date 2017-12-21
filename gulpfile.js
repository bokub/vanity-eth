const gulp = require('gulp');
const pump = require('pump');

const browserify = require('browserify');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');

// Browserify
gulp.task('browserify', cb => {
	pump([
		browserify('js/index.js').bundle(),
		source('bundle.js'),
		gulp.dest('js')
	], cb);
});

// Browserify then babelify, then uglify
gulp.task('build', ['browserify'], cb => {
	pump([
		gulp.src('js/bundle.js'),
		babel({presets: ['env']}),
		uglify(),
		gulp.dest('js')
	], cb);
});

// Watch changes and browserify on the fly
gulp.task('watch', () => {
	gulp.watch(['js/index.js', 'js/vanity.js'], ['browserify']);
});
