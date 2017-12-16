'use strict';

/**
 * @ngdoc overview
 * @name softvFrostApp
 * @description
 * # softvFrostApp
 *
 * Main module of the application.
 */
angular
  .module('softvFrostApp', [
    'smart-table',
    'ngSanitize',
    'ngCsv',
    'ngTableToCsv',
    'ngAnimate',
    'ngSanitize',
    'ngNotify',
    'angularValidator',
    'ngStorage',
    'base64',
    'ui.router',
    'angularUtils.directives.dirPagination',
    'ngStorage',
    'ui.bootstrap',
    'blockUI',
    'ngMap',
    'permission',
    'permission.ui',
    'ui.mask',
    'ngCsv',
    'fixed.table.header',
    'angularFileUpload',
    'bootstrapLightbox',
    'firebase',
    'angularMoment',
    //"toaster",
    'ngAnimate',
    'ui-notification'
  ])
  .config([
    '$provide',
    '$urlRouterProvider',
    '$httpProvider',
    '$qProvider',
    'blockUIConfig',
    'NotificationProvider',
    function (
      $provide,
      $urlRouterProvider,
      $httpProvider,
      $qProvider,
      blockUIConfig,
      NotificationProvider
    ) {
      $qProvider.errorOnUnhandledRejections(false);

      $urlRouterProvider.otherwise('/auth/login');
      blockUIConfig.templateUrl = 'views/loading.html';

      $provide.factory('ErrorHttpInterceptor', function (
        $q,
        $injector,
        $localStorage,
        $location
      ) {

        NotificationProvider.setOptions({
          delay: 10000,
          startTop: 20,
          startRight: 10,
          verticalSpacing: 20,
          horizontalSpacing: 20,
          positionX: 'right',
          positionY: 'top'
      });

        function notifyError(rejection) {
          var notify = $injector.get('ngNotify');
          if (
            rejection.data ===
            'Acceso no autorizado, favor de validar autenticación'
          ) {
            delete $localStorage.currentUser;
            notify.set(
              'Acceso no autorizado, por favor inicia sesión nuevamente.', {
                type: 'error',
                duration: 4000
              }
            );
            $location.path('/auth/');
            return;
          }
          var content = '¡Se ha generado un error! \n' + rejection.data;
          notify.set(content, {
            type: 'error',
            duration: 4000
          });
        }
        return {
          requestError: function (rejection) {
            notifyError(rejection);
            return $q.reject(rejection);
          },
          responseError: function (rejection) {
            notifyError(rejection);
            return $q.reject(rejection);
          }
        };
      });
      $httpProvider.interceptors.push('ErrorHttpInterceptor');
      $httpProvider.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';

      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
  ])
  .constant('APP_CONFIG', window.appConfig)
  .run([
    '$rootScope',
    '$state',
    '$injector',
    '$stateParams',
    '$localStorage',
    '$location',
    'permissionsFactory',
    'PermPermissionStore',
    'amMoment',

    function (

      $rootScope,
      $state,
      $injector,
      $stateParams,
      $localStorage,
      $location,
      permissionsFactory,
      PermPermissionStore,
      amMoment

    ) {
      $rootScope.$state = $state;
      amMoment.changeLocale('es');
      $rootScope.$stateParams = $stateParams;
      if ($localStorage.currentUser) {



        var fire = $injector.get('firebase');
        var config = {
          apiKey: 'AIzaSyBFtB3eFrr1Br5ohphAGtQ5c8ONQQw5C-Y',
          authDomain: 'boss-5fbab.firebaseapp.com',
          databaseURL: 'https://boss-5fbab.firebaseio.com',
          projectId: 'boss-5fbab',
          storageBucket: 'boss-5fbab.appspot.com',
          messagingSenderId: '1031430485862'
        };
        fire.initializeApp(config);

        if ($localStorage.currentUser.Recibemensaje === true) {
          setInterval(function () {

            var notify = $injector.get('ngNotify');
            // console.log('hahahaah');
            notify.set(
              '<i class="fa fa-exclamation-triangle"></i> ¡Atención! tienes  Memorias Tecnicas pendientes,consultalas aqui <a  href="#!/home/memoriastecnicas"><i>ir a menu</i></a>', {
                theme: 'pitchy',
                html: true,
                sticky: true
              }
            );
          }, 60000);
        }


        //$location.path('/auth/login');
        var permissions = permissionsFactory.on();
        PermPermissionStore.definePermission('anonymous', function () {
          return false;
        });
        PermPermissionStore.defineManyPermissions(permissions, function () {
          return true;
        });
      } else {
        $location.path('/auth/login');
        PermPermissionStore.definePermission('anonymous', function () {
          return true;
        });
      }
    }
  ]);
