var gulp        = require('gulp'),
	browserSync = require('browser-sync'),
	compass     = require('gulp-compass'),
	pug         = require('gulp-pug'),
	minifyCss   = require('gulp-minify-css'),
	concatCss   = require('gulp-concat-css'),
	htmlReplace = require('gulp-html-replace'),
	minifyHtml  = require('gulp-minify-html'),
	replace     = require('gulp-replace');

// Tâche de base avec browser-sync activé.
gulp.task('default', ['compass', 'pug', 'serve'], function() {
	gulp.watch('./src/**/*.scss', ['compass']);
	gulp.watch('./src/views/**/*.pug', ['pug']);
});

// Tâche de base sans watching.
gulp.task('src', ['compass', 'pug']);

// Browser-sync.
gulp.task('serve', function() {
	browserSync({
		server: './',
		files: 'src/*.html, src/assets/css/*.css',
		directory: true,
		open: true
	});
});

// Développement.

gulp.task('compass', function() {
	return gulp.src('./src/scss/*.scss')
		.pipe(compass({
			config_file: './config.rb',
			css: './src/assets/css/',
			sass: './src/scss/'
		}))
		.pipe(gulp.dest('src/assets/css/'));
});

gulp.task('pug', function() {
	return gulp.src('./src/views/*.pug')
    .pipe(pug({
		pretty: true
    }))
    .pipe(gulp.dest('./src'));
});

// Tâche globale de prod.
gulp.task('dist', ['dist-css', 'dist-html']);

gulp.task('dist-css', function () {
	gulp.src(['src/lib/webfont/*.css', 'src/assets/css/*.css'])
	.pipe(concatCss('css/app.min.css'))
	.pipe(replace('../fonts/', '../../lib/webfont/fonts/'))
	.pipe(minifyCss())
	.pipe(replace('../../../../dist/assets/css/img', 'img'))
	.pipe(gulp.dest('./dist/assets/'));
});

gulp.task('dist-html', function() {
	gulp.src('./src/index.html')
	// Remplace les liens css par ceux de la version de prod.
	.pipe(htmlReplace({
		'css': 'dist/assets/css/app.min.css'
	}))
	// Remplage les href des img par ceux de la version de prod.
	.pipe(replace('../dist/assets/img', 'dist/assets/img'))
	// Minifie le html.
	.pipe(minifyHtml({
		empty: true,
		conditionals: true,
		spare:true,
		quotes: true
	}))
	.pipe(gulp.dest('./'));
});
