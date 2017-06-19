module.exports = function karmaConfig(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: ['test/test.bundle.js'],
    plugins: [
      'karma-chrome-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      'test/test.bundle.js': ['webpack', 'sourcemap'],
      'test/tests.bundle.js': ['webpack', 'sourcemap'],
    },
    reporters: ['progress'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            exclude: /node_modules/,
            loader: 'babel-loader',
            test: /\.jsx?$/,
          },
        ],
      },
    },
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
