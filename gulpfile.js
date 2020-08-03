// General
const { src, dest, parallel, watch, series } = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const lazypipe = require('lazypipe');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const util = require('gulp-util');

// Styles
const postcss = require('gulp-postcss');

// Scripts
const babel = require('gulp-babel');
const terser = require('gulp-terser');

function cleanDist(done) {
    del.sync('./dist/');
    done();
}

/**
 * Style Tasks
 */

const cssTasks = lazypipe().pipe(postcss);

function buildCSS() {
    return src('src/**/*.css')
        .pipe(gulpIf(!util.env.production, sourcemaps.init()))
        .pipe(cssTasks())
        .pipe(concat('bundle.css'))
        .pipe(gulpIf(!util.env.production, sourcemaps.write()))
        .pipe(dest('dist/'));
}

/**
 * Script Tasks
 */

const jsTasks = lazypipe().pipe(babel).pipe(terser);

function buildJS() {
    return src(['src/components/**/*.js', '!src/components/**/*.config.js'])
        .pipe(gulpIf(!util.env.production, sourcemaps.init()))
        .pipe(concat('bundle.js'))
        .pipe(jsTasks())
        .pipe(gulpIf(!util.env.production, sourcemaps.write()))
        .pipe(dest('dist/'));
}

/**
 * BrowserSync Tasks
 */

function startDevServer(done) {
    browserSync.init({
        proxy: 'fractal-playground.local',
    });

    done();
}

function reloadBrowser(done) {
    browserSync.reload();
    done();
}
function watchSource(done) {
    watch(
        ['src/**/*.*', '!src/components/**/*.css.json'],
        series(exports.default, reloadBrowser)
    );
    done();
}

exports.default = series(cleanDist, parallel(buildCSS, buildJS));

exports.watch = series(exports.default, startDevServer, watchSource);

exports.js = buildJS;
exports.css = buildCSS;
