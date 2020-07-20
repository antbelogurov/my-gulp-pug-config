const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemap = require('gulp-sourcemaps')
const pug = require('gulp-pug')
const del = require('del')

gulp.task('pug', (callback) => {
    return gulp.src('./src/pug/pages/**/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream())
    callback()

})

gulp.task('scss', (callback) => {
    return gulp.src('./src/scss/style.scss')
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe(sourcemap.write())
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream())
    callback()
});
gulp.task('cleanbuild', () => {
    return del('./build')
})

gulp.task('copyimg', (callback) => {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('./build/img/'))
    callback()
})

gulp.task('copyjs', (callback) => {
    return gulp.src('./src/js/**/*.*')
        .pipe(gulp.dest('./build/js/'))
    callback()
})

gulp.task('watch', () => {
    watch(['./build/js/**/*.*', './build/img/**/*.*'], gulp.parallel(browserSync.reload))
    watch(['./src/scss/**/*.scss'], gulp.parallel('scss'))
    watch(['./src/pug/**/*.pug'], gulp.parallel('pug'))
    watch(['./src/img/**/*.*'], gulp.parallel('copyimg'))
    watch(['./src/js/**/*.*'], gulp.parallel('copyjs'))


});



gulp.task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

gulp.task('default',
    gulp.series(
        gulp.parallel('cleanbuild'),
        gulp.parallel('scss', 'pug', 'copyimg', 'copyjs'),
        gulp.parallel('server', 'watch')
    )
);