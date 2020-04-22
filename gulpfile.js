const gulp = require('gulp')
const del = require('del')
const nodemon = require('nodemon')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')


const tsProject = ts.createProject('tsconfig.json')
const outputDir = './dist'
const srcMask = './src/**/*'
const srcMaskTs = `${srcMask}.ts`
const srcMaskPgSQL = `${srcMask}.pgsql`

function clean() {
    return del(outputDir)
}

function copyTask() {
    return gulp
        .src(srcMaskPgSQL)
        .pipe(gulp.dest(outputDir))
}

function build() {
    return gulp.src(srcMaskTs)
        .pipe(sourcemaps.init( { loadMaps: true }))
        .pipe(tsProject()).js
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot:'.'
        }))
        .pipe(gulp.dest(outputDir))
}

const defaultTask = gulp.series(clean, build, copyTask)

function watchTask() {
    gulp.watch(srcMaskTs, build)
    gulp.watch(srcMaskPgSQL, copyTask)
}

function botRestartTask(done) {
    return nodemon({
        script: `${outputDir}/app.test.js`,
        watch: outputDir,
        delay: '1000',
        done,
    })
}

function devTask(done) {
    watchTask()
    gulp.series(defaultTask, botRestartTask)(done)
}

// exports.botRestart = botRestartTask
// exports.watch = watchTask
exports.dev = devTask
exports.copy = copyTask
exports.default = defaultTask
