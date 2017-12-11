'use strict';
angular
  .module('softvFrostApp')
  .factory('memoriaFactory', function ($http, $q, globalService, $localStorage) {
    var factory = {};
    var paths = {
      GuardaMemoriaTecnica: '/GuardaMemoriaTecnica/GetGuardaMemoriaTecnicaList',
      BuscaMemoriaTecnica: '/BuscaMemoriaTecnica/GetBuscaMemoriaTecnicaList',
      GetObtieneDatosPorOrden: '/BuscaMemoriaTecnica/GetObtieneDatosPorOrden',
      GuardaImagenesMemoriaTecnica: '/GuardaImagenesMemoriaTecnica/GetGuardaImagenesMemoriaTecnicaList',
      GetReportepdf: '/GuardaImagenesMemoriaTecnica/GetReportepdf',
      GetGuardaObservacionMemoriaTecnicaList: '/GuardaObservacionMemoriaTecnica/GetGuardaObservacionMemoriaTecnicaList',
      GetObtieneObservacionesMemoriaTecnica: '/GuardaObservacionMemoriaTecnica/GetObtieneObservacionesMemoriaTecnica',
      GuardaEquiposSustituir: '/GuardaEquiposSustituir/GetGuardaEquiposSustituirList',
      ObtieneTiposImagenes: '/ObtieneTiposImagenes/GetObtieneTiposImagenesList',
      GetObtieneImagenesMemoriaTecnica: '/GuardaImagenesMemoriaTecnica/GetObtieneImagenesMemoriaTecnica',
      GetObtieneMemoriaTecnica: '/GuardaMemoriaTecnica/GetObtieneMemoriaTecnica',
      UpdateGuardaMemoriaTecnica: '/GuardaMemoriaTecnica/UpdateGuardaMemoriaTecnica',
      GetObtieneEquiposSustituir: '/GuardaEquiposSustituir/GetObtieneEquiposSustituir',
      GetGeneraFolioMemoriaTecnica: '/BuscaMemoriaTecnica/GetGeneraFolioMemoriaTecnica',
      GetGuardaEquiposDigital: '/GuardaEquiposSustituir/GetGuardaEquiposDigital',
      GetObtieneDigitalMemoriaTecnica: '/GuardaEquiposSustituir/GetObtieneDigitalMemoriaTecnica',
      GetObtieneBitacoraPorIdMemoria: '/BuscaMemoriaTecnica/GetObtieneBitacoraPorIdMemoria',
      GetReporteMemoria: '/BuscaMemoriaTecnica/GetReporteMemoria',
      GetReportexls:'/GuardaImagenesMemoriaTecnica/GetReportexls',
      GetTipoServicio: '/ObtieneTiposImagenes/GetTipoServicio',
      GetEstatusTecnico: '/ObtieneTiposImagenes/GetEstatusTecnico',
      GetTecnicosMemoriaTecnica: '/ObtieneTiposImagenes/GetTecnicosMemoriaTecnica',
      GetAparatosTecnico:'/ObtieneTiposImagenes/GetAparatosTecnico'
    };


    factory.GetAparatosTecnico = function (Tipo,Clv_Orden,IdTecnico,IdMemoriaTecnica) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };

      var Parametros = {
        'Tipo':Tipo ,
        'IdTecnico':IdTecnico,
        'Clv_Orden':Clv_Orden,
        'IdMemoriaTecnica':IdMemoriaTecnica    
      };      
     
      $http.post(globalService.getUrl() + paths.GetAparatosTecnico,JSON.stringify(Parametros),config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };


    factory.GetTecnicosMemoriaTecnica = function (id) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };

      var Parametros = {
        'IdCompania':id       
      };      
     
      $http.post(globalService.getUrl() + paths.GetTecnicosMemoriaTecnica,JSON.stringify(Parametros),config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };


    factory.GetEstatusTecnico = function () {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
     
      $http.get(globalService.getUrl() + paths.GetEstatusTecnico,config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };

    factory.GetTipoServicio = function () {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
     
      $http.get(globalService.getUrl() + paths.GetTipoServicio,config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };



     factory.GetGuardaObservacionMemoriaTecnicaList = function (notas) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'notas':notas       
      };
      $http.post(globalService.getUrl() + paths.GetGuardaObservacionMemoriaTecnicaList, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };


     factory.GetObtieneObservacionesMemoriaTecnica = function (IdMemoriaTecnica) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'IdMemoriaTecnica': IdMemoriaTecnica
      };
      $http.post(globalService.getUrl() + paths.GetObtieneObservacionesMemoriaTecnica, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };


    factory.GetReporteMemoria = function () {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };

      $http.get(globalService.getUrl() + paths.GetReporteMemoria, config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };



    factory.GetObtieneBitacoraPorIdMemoria = function (Idmemoria) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'Idmemoria': Idmemoria
      };
      $http.post(globalService.getUrl() + paths.GetObtieneBitacoraPorIdMemoria, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };





    factory.GetObtieneDigitalMemoriaTecnica = function (IdMemoriaTecnica) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'IdMemoriaTecnica': IdMemoriaTecnica
      };
      $http.post(globalService.getUrl() + paths.GetObtieneDigitalMemoriaTecnica, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };



    factory.GetGuardaEquiposDigital = function (equipos) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'equipos': equipos
      };
      $http.post(globalService.getUrl() + paths.GetGuardaEquiposDigital, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };




    factory.GetGeneraFolioMemoriaTecnica = function (IdMemoriaTecnica) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'IdMemoriaTecnica': IdMemoriaTecnica,
        'IdUsuario': $localStorage.currentUser.idUsuario

      };
      $http.post(globalService.getUrl() + paths.GetGeneraFolioMemoriaTecnica, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };


    factory.GetObtieneDatosPorOrden = function (orden) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'orden': orden
      };
      $http.post(globalService.getUrl() + paths.GetObtieneDatosPorOrden, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };

    factory.GetReportepdf = function (idmemoria) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'idmemoria': idmemoria
      };
      $http.post(globalService.getUrlmemoriatecnica() + paths.GetReportepdf, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };


    factory.GetReportexls = function (idmemoria) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'idmemoria': idmemoria
      };
      $http.post(globalService.getUrlmemoriatecnica() + paths.GetReportexls, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };







    factory.GuardaImagenesMemoriaTecnica = function (file, orden, options, eliminadas) {
      var deferred = $q.defer();
      var data = new FormData();
      for (var i = 0; i < file.length; i++) {
        data.append('file' + i, file[i]);
      }
      data.append('orden', orden);
      data.append('options', JSON.stringify(options));
      data.append('eliminadas', JSON.stringify(eliminadas));

      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token,
          'Content-Type': undefined
        }
      };
      console.log(data);
      console.log(config);
      $http.post(globalService.getUrlmemoriatecnica() + paths.GuardaImagenesMemoriaTecnica, data, config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (response) {
        deferred.reject(response);
      });

      return deferred.promise;
    };


    factory.GetObtieneEquiposSustituir = function (IdMemoriaTecnica) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'IdMemoriaTecnica': IdMemoriaTecnica
      };
      $http.post(globalService.getUrl() + paths.GetObtieneEquiposSustituir, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };



    factory.GetObtieneMemoriaTecnica = function (IdMemoriaTecnica) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'IdMemoriaTecnica': IdMemoriaTecnica
      };
      $http.post(globalService.getUrl() + paths.GetObtieneMemoriaTecnica, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };



    factory.GetObtieneImagenesMemoriaTecnica = function (IdMemoriaTecnica) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'IdMemoriaTecnica': IdMemoriaTecnica
      };
      $http.post(globalService.getUrl() + paths.GetObtieneImagenesMemoriaTecnica, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };



    factory.GuardaEquiposSustituir = function (equipos) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'equipos': equipos
      };
      $http.post(globalService.getUrl() + paths.GuardaEquiposSustituir, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };



    factory.ObtieneTiposImagenes = function () {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      $http.get(globalService.getUrl() + paths.ObtieneTiposImagenes, config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };





    factory.UpdateGuardaMemoriaTecnica = function (obj) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'objGuardaMemoriaTecnica': obj
      };
      $http.post(globalService.getUrl() + paths.UpdateGuardaMemoriaTecnica, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };




    factory.GuardaMemoriaTecnica = function (obj) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = obj;
      $http.post(globalService.getUrl() + paths.GuardaMemoriaTecnica, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };

    factory.BuscaMemoriaTecnica = function (object) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      var Parametros = {
        'Folio': object.Folio,
        'Fecha': object.Fecha,
        'IdUsuario': $localStorage.currentUser.idUsuario,
        'Clv_Orden': object.orden,
        'Op': object.op,
        'SAN': object.SAN,
        'Cliente': object.Cliente,
        'Contrato': object.Contrato,
        'Tecnico': object.Tecnico

      };
      $http.post(globalService.getUrl() + paths.BuscaMemoriaTecnica, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };

    return factory;
  });
