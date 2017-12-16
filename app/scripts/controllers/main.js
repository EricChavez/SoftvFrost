'use strict';

/**
 * @ngdoc function
 * @name softvFrostApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the softvFrostApp
 */
angular.module('softvFrostApp').controller('MainCtrl', function (
  $localStorage,
  $window,
  $location,
  rolFactory,
  $firebaseArray,
  firebase,
  //toaster,
  ngNotify
  
) {
  this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
  /* var config = {
       apiKey: 'AIzaSyBFtB3eFrr1Br5ohphAGtQ5c8ONQQw5C-Y',
       authDomain: 'boss-5fbab.firebaseapp.com',
       databaseURL: 'https://boss-5fbab.firebaseio.com',
       projectId: 'boss-5fbab',
       storageBucket: 'boss-5fbab.appspot.com',
       messagingSenderId: '1031430485862'
     };
     firebase.initializeApp(config);*/
  this.$onInit = function () {


    if ($localStorage.currentUser) {
      vm.menus = $localStorage.currentUser.menu;
      vm.usuario = $localStorage.currentUser.usuario;
      rolFactory.GetRoleList().then(function (data) {
        data.GetRoleListResult.forEach(function (item) {
          if (item.IdRol === $localStorage.currentUser.idRol) {
            vm.rol = item.Nombre;
          }
        });


        if ($localStorage.currentUser.Recibemensaje === true) {
          var ref = firebase
            .database()
            .ref()
            .child('messages');
          vm.messages = $firebaseArray(ref);
          vm.messages.$loaded().then(function (notes) {
            vm.count = notes.length;
          });
          var first = true;

          ref.on('child_removed', function (snapshot) {
            console.log(snapshot);
            vm.messages.$loaded().then(function (notes) {
              vm.count = notes.length;
            });
          });
          ref.once('value', function (snap) {

            //TODO: display initial state...
            // Object.keys not supported in IE 8, but has a polyfill: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
            var keys = Object.keys(snap.val() || {});
            var lastIdInSnapshot = keys[keys.length - 1];
           
            ref.orderByKey().startAt(lastIdInSnapshot).on('child_added', function (newMessSnapshot) {
             console.log(newMessSnapshot);
              if (snap.key === lastIdInSnapshot) {
                return;
              }
              if (first) {
                first = false;
              } else {
                vm.messages.$loaded().then(function (notes) {
                  vm.count = notes.length;
                    ngNotify.set('<i class="fa fa-bell"></i> tienes una nueva notificación', {
                    theme: 'pitchy',
                    html: true,
                    type: 'success'
                  });
                });

              }
            });
          });




        }
      });
    } else {
      $location.path('/auth/login');
    }
  };

  function logOut() {
    delete $localStorage.currentUser;
    $window.location.reload();
  }
  var vm = this;
  vm.logOut = logOut;
});
