const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const notify = require("gulp-notify");
const cssnano = require("gulp-cssnano");
const plumber = require("gulp-plumber");
const deploySite = require("gulp-gh-pages");
const browserSync = require("browser-sync");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");

const paths = {
    src: {
        assets: "./assets",
        css: "./assets/css/*.css",
        downloads: "./assets/downloads/*",
        fonts: "./assets/fonts/*",
        img: "./assets/img/*",
        js: "./assets/js/*.js",
        html: "./*.html",
        cname: "CNAME",
        scss: "./assets/scss/**/*.scss",
        scssMain: "./assets/scss/main.scss",
    },
    dest: {
        dest: "../dist",
        css: "../dist/assets/css",
        downloads: "../dist/assets/downloads",
        fonts: "../dist/assets/fonts",
        img: "../dist/assets/img",
        js: "../dist/assets/js",
    },
};

const copySrc = ["css", "html", "fonts", "cname", "downloads"];

const copyDest = ["css", "dest", "fonts", "dest", "downloads"];

// SASS
function style() {
    return gulp
        .src(paths.src.scssMain)
        .pipe(
            plumber({
                errorHandler: notify.onError(
                    "Style Build Error: <%= error.message %>"
                ),
            })
        )
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer("last 4 version"))
        .pipe(sourcemaps.write())
        .on("error", onError)
        .pipe(gulp.dest(paths.dest.css));
}

// SASS-prod
function styleBuild() {
    return gulp
        .src(paths.src.scssMain)
        .pipe(
            plumber({
                errorHandler: notify.onError(
                    "Style Build Error: <%= error.message %>"
                ),
            })
        )
        .pipe(sass())
        .on("error", onError)
        .pipe(autoprefixer("last 4 version"))
        .pipe(cssnano())
        .pipe(gulp.dest("./assets/css"));
}

function copy(from, to) {
    return gulp.src(from).pipe(gulp.dest(to));
}

function copyFiles() {
    copySrc
        .map(function (e, i) {
            return [e, copyDest[i]];
        })
        .forEach((f, t) => {
            const src = paths.src[f];
            const dest = paths.dest[t];
            copy(src, dest);
        });
}

// Minify images
function image() {
    return gulp
        .src(paths.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dest.img));
}

// Uglify JS
function uglifyJS() {
    return gulp.src(paths.src.js).pipe(uglify()).pipe(gulp.dest(paths.dest.js));
}

const moveAssets = gulp.parallel(copyFiles, image, uglifyJS);

function serveDev() {
    return browserSync.init({
        server: "./",
    });
}

function watchHTML() {
    return gulp.watch("*.html").on("change", browserSync.reload);
}

function deployPage() {
    return gulp.src("../dist/**/*").pipe(deploySite());
}

const defaultTasksDev = gulp.series(
    styleBuild,
    gulp.parallel(serveDev, watchHTML)
);

// const defaultTasks = gulp.series(gulp.parallel(moveAssets, style), serve);
const defaultTasks = gulp.series(gulp.parallel(moveAssets, style), deployPage);

// Helpers
function onError(error) {
    console.log(error.toString());
    this.emit("end");
}

exports.copy = copyFiles;
exports.dev = defaultTasksDev;
exports.deploy = defaultTasks;
