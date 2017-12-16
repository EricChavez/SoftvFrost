// Karma configuration
// Generated on 2017-02-21

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angularUtils-pagination/dirPagination.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/ng-notify/src/scripts/ng-notify.js',
      'bower_components/tg-angular-validator/dist/angular-validator.js',
      'bower_components/angular-base64/angular-base64.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/ngmap/build/scripts/ng-map.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-block-ui/dist/angular-block-ui.js',
      'bower_components/angular-smart-table/dist/smart-table.js',
      'bower_components/angular-export-table/export/table-export-directive.js',
      'bower_components/angular-export-table/export/table-export-option-directive.js',
      'bower_components/angular-export-table/kayalshri-table-export.jquery.plugin-a891806/table-export.js',
      'bower_components/angular-export-table/kayalshri-table-export.jquery.plugin-a891806/jquery.base64.js',
      'bower_components/angular-export-table/kayalshri-table-export.jquery.plugin-a891806/html2canvas.js',
      'bower_components/angular-export-table/kayalshri-table-export.jquery.plugin-a891806/jspdf/jspdf.js',
      'bower_components/angular-export-table/kayalshri-table-export.jquery.plugin-a891806/jspdf/libs/base64.js',
      'bower_components/angular-export-table/kayalshri-table-export.jquery.plugin-a891806/jspdf/libs/sprintf.js',
      'bower_components/ng-table-to-csv/dist/ng-table-to-csv.js',
      'bower_components/angular-permission/dist/angular-permission.js',
      'bower_components/angular-permission/dist/angular-permission-ui.js',
      'bower_components/angular-permission/dist/angular-permission-ng.js',
      'bower_components/moment/moment.js',
      'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
      'bower_components/angular-ui-mask/dist/mask.js',
      'bower_components/jspdf/dist/jspdf.debug.js',
      'bower_components/jspdf-autotable/dist/jspdf.plugin.autotable.js',
      'bower_components/ng-csv/build/ng-csv.min.js',
      'bower_components/angular-fixed-table-header/src/fixed-table-header.js',
      'bower_components/angular-file-upload/dist/angular-file-upload.min.js',
      'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js',
      'bower_components/firebase/firebase.js',
      'bower_components/angularfire/dist/angularfire.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/AngularJS-Toaster/toaster.js',
      'bower_components/angular-ui-notification/dist/angular-ui-notification.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
