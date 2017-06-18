/* eslint-disable import/no-extraneous-dependencies */

import gulp from 'gulp';
import del from 'del';
import eslint from 'gulp-eslint';
import webpack from 'webpack-stream';
import flow from 'gulp-flowtype';
import BrowserSync from 'browser-sync';
import webpackConfig from './webpack.config.babel';

const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  sharedSrcJs: 'src/**/*.js?(x)',
  clientEntryPoint: 'src/app.js',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  libDir: 'lib',
  distDir: 'dist',
  clientBundle: 'dist/client-bundle.js?(.map)',
  allLibTests: 'test/**/*.spec.js',
};

// create a task that ensures the `js` task is complete before
// // reloading browsers
gulp.task('js-watch', ['main'], (done) => {
  BrowserSync.reload();
  done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('dev', ['main'], () => {
  // Serve files from the root of this project
  BrowserSync.init({
    server: { baseDir: paths.distDir },
  });

  // add browserSync.reload to the tasks array to make
  gulp.watch('src/**/*.js', ['js-watch']);
});

gulp.task('clean', () => del([paths.libDir, paths.clientBundle]));

gulp.task('main', ['lint', 'clean'], () => gulp.src(paths.clientEntryPoint)
  .pipe(webpack(webpackConfig))
  .pipe(gulp.dest(paths.distDir))
);

gulp.task('lint', () => gulp.src([paths.allSrcJs, paths.gulpFile, paths.webpackFile])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(flow({ abort: true })));

