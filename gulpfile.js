// gulpプラグインの読み込み
const gulp = require("gulp");
const sass = require("gulp-sass");
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const slim = require("gulp-slim");
const browserSync =require('browser-sync');
const paths = {
  'src': {
    'slim': 'src/slim/*.slim',
    'scss': 'src/scss/style.scss',
    'js': 'src/js/*.js'
  },
  'dist': {
    'html': 'dest/html/',
    'css': 'dest/css/',
    'js': 'dest/js/'
  }
}

gulp.task('slim', done => {
  gulp.src(paths.src.slim)
  .pipe(plumber())
  .pipe(slim({
    pretty: true
  }))
  .pipe(gulp.dest(paths.dist.html));
  done();
});

gulp.task('sass', done => {
  gulp.src(paths.src.scss)
  .pipe(sassGlob())
  .pipe(sass({
    outputStyle: 'expanded',
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false,
  }))
  .pipe(gulp.dest(paths.dist.css));
  done();
});

gulp.task('minjs', done => {
  gulp.src(paths.src.js)
  .pipe(uglify())
  .pipe(rename({extname: '.min.js'}))
  .pipe(gulp.dest(paths.dist.js));
  done();
});

gulp.task('browser-sync', done => {
  browserSync({
    server: {
       baseDir: "dest/",
       index  : "html/index.html"
    }
  });
  done();
});

gulp.task('bs-reload', done => {
    browserSync.reload();
    done();
});

// style.scssをタスクを作成する
gulp.task("default",gulp.series(gulp.parallel('slim', 'sass', 'minjs'),'browser-sync', function() {
  gulp.watch('src/',gulp.series('slim', 'sass', 'minjs', 'bs-reload'));
}));