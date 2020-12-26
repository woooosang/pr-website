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

const scssFiles = ["./assets/scss/**/*.scss"];
const scssMain = ["./assets/scss/main.scss"];
const pathStyleDest = "./assets/css";

// SASS
gulp.task("style", function () {
    return gulp
        .src(scssMain)
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
        .pipe(gulp.dest(pathStyleDest));
});

gulp.task("style-build", function () {
    return gulp
        .src(scssMain)
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
        .pipe(gulp.dest(pathStyleDest));
});

// Watcher
gulp.task("watch", () => {
    gulp.watch(scssFiles, function () {
        runSequence("style", ["notify"]);
    });
});

// Build for prod
gulp.task("build", function (callback) {
    runSequence(["style-build"], callback);
});

gulp.task(
    "serve",
    gulp.series("style", function () {
        browserSync.init({
            server: "./",
        });

        gulp.watch(scssMain, gulp.series("watch"));
        gulp.watch("./*.html").on("change", browserSync.reload);
    })
);

// Default
gulp.task("default", (done) => {
    runSequence(["style", "serve"], done);
});

// Helpers
function onError(error) {
    console.log(error.toString());
    this.emit("end");
}

gulp.task("notify", function () {
    return gulp.src("").pipe(notify({ message: "Done!", onLast: true }));
});
