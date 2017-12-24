const gulp = require('gulp');
const pump = require('pump');

const browserify = require('browserify');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Browserify
gulp.task('browserify', cb => {
	pump([
		browserify('js/index.js').bundle(),
		source('bundle.js'),
		gulp.dest('js')
	], cb);
});

// SASS
gulp.task('sass', cb => {
	pump([
		gulp.src('css/stylesheet.sass'),
		sass().on('error', sass.logError),
		gulp.dest('css')
	], cb);
});

// Build javascript
gulp.task('build-js', ['browserify'], cb => {
	pump([
		gulp.src('js/bundle.js'),
		babel({presets: ['env']}),
		uglify(),
		gulp.dest('js')
	], cb);
});

// Build CSS
gulp.task('build-css', ['sass'], cb => {
	pump([
		gulp.src('css/stylesheet.css'),
		autoprefixer({
			browsers: ['last 2 versions'],
			remove: false,
			cascade: false
		}),
		cleanCSS({compatibility: 'ie8'}),
		gulp.dest('css')
	], cb);
});

// Build app
gulp.task('default', ['build-js', 'build-css']);

// Watch changes and compile on the fly
gulp.task('watch', () => {
	gulp.watch(['js/index.js', 'js/vanity.js'], ['browserify']);
	gulp.watch(['css/stylesheet.sass'], ['sass']);
});
