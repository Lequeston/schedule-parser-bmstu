const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distPath = path.resolve(rootDir, 'dist');

const tsProject = ts.createProject(path.resolve(rootDir, 'tsconfig.json'));

gulp.task('typescript', () => {
  return tsProject
    .src()
    .pipe(tsProject())
    .on('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .js
    .pipe(gulp.dest(distPath));
});

gulp.task('build-clean', () => {
  return del([distPath], { force: true });
});

gulp.task('views', () => {
  return gulp
    .src(path.resolve(rootDir, 'src', 'views', '**', '*.ejs'))
    .pipe(gulp.dest(path.resolve(distPath, 'views')));
});

gulp.task('default', gulp.series('build-clean', 'typescript', 'views'), () => {
  console.log('Done');
});