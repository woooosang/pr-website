const gulp = require("gulp");
const runSequence = require("gulp4-run-sequence");
const watch = require("gulp-watch");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const notify = require("gulp-notify");
const cssnano = require("gulp-cssnano");
const plumber = require("gulp-plumber");
const gulpNotify = require("gulp-notify");
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
        php: "./*.php",
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

// SASS
gulp.task("style", function () {
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
});

// SASS-prod
gulp.task("style-build", function () {
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
        .pipe(gulp.dest(paths.dest.css));
});

// Watcher
gulp.task("watch", () => {
    gulp.watch(paths.src.scss, function () {
        runSequence("style", ["notify"]);
    });
});

// Build for prod
gulp.task("build", function (callback) {
    runSequence(["style-build"], callback);
});

// Copy CSS
gulp.task("copy-css", function () {
    return gulp.src([paths.src.css]).pipe(gulp.dest(paths.dest.css));
});

// Copy Pages
gulp.task("copy-pages", function () {
    return gulp
        .src([paths.src.html, paths.src.php])
        .pipe(gulp.dest(paths.dest.dest));
});

// Copy Fonts
gulp.task("copy-fonts", function () {
    return gulp.src([paths.src.fonts]).pipe(gulp.dest(paths.dest.fonts));
});

// Copy Downloads
gulp.task("copy-downloads", function () {
    return gulp
        .src([paths.src.downloads])
        .pipe(gulp.dest(paths.dest.downloads));
});

// Minify images
gulp.task("image", function () {
    return gulp
        .src(paths.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dest.img));
});

// Uglify JS
gulp.task("uglify", function () {
    return gulp.src(paths.src.js).pipe(uglify()).pipe(gulp.dest(paths.dest.js));
});

gulp.task(
    "move-assets",
    gulp.series(
        "copy-css",
        "copy-pages",
        "copy-fonts",
        "copy-downloads",
        "image",
        "uglify"
    )
);

// Serve
gulp.task(
    "serve",
    gulp.series("style", function () {
        browserSync.init({
            server: paths.dest.dest,
        });
        // watch(paths.src.html).on("change", browserSync.reload);
    })
);

gulp.task("default", (done) => {
    gulp.series("move-assets", "style", "serve");
    done();
    // runSequence(["move-assets", "style", "serve"], done);
});

// Helpers
function onError(error) {
    console.log(error.toString());
    this.emit("end");
}

gulp.task("notify", function () {
    return gulp.src("").pipe(notify({ message: "Done!", onLast: true }));
});
