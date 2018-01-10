const gulp = require('gulp');
const pump = require('pump');

const browserify = require('browserify');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

// Browserify
gulp.task('browserify', cb => {
	pump([
		browserify('js/vanity.js', {standalone: 'vanity'}).bundle(),
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
		gulp.src(['js/index.js', 'js/bundle.js']),
		babel({presets: ['env'], plugins: ['@babel/plugin-transform-object-assign']}),
		uglify(),
		rename({extname: '.min.js'}),
		gulp.dest('build/js')
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
		rename({extname: '.min.css'}),
		gulp.dest('build/css')
	], cb);
});

gulp.task('replace-path', cb => {
	pump([
		gulp.src('index.html'),
		replace('css/stylesheet.css', 'build/css/stylesheet.min.css'),
		replace('js/index.js', 'build/js/index.min.js'),
		gulp.dest('./'),
		gulp.src('js/index.js'),
		replace('js/bundle.js', 'build/js/bundle.min.js'),
		gulp.dest('js')
	], cb);
});

// Build app
gulp.task('build', ['replace-path', 'build-js', 'build-css']);

// Watch changes and compile on the fly
gulp.task('watch', () => {
	gulp.watch(['js/vanity.js'], ['browserify']);
	gulp.watch(['css/stylesheet.sass'], ['sass']);
});
