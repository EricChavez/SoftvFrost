'use strict';
angular
  .module('softvFrostApp')
  .controller('editamemoriatecnicaCtrl',
    function ($state, ngNotify, memoriaFactory, moment, firebase, $firebaseArray, $localStorage, $stateParams, $filter, FileUploader, globalService, Lightbox, $q) {

      var ref = firebase
        .database()
        .ref()
        .child('messages');

      function GetdataFire() {
        var defered = $q.defer();
        var promise = defered.promise;
        var registros = [];
        var posts = $firebaseArray(ref);
        posts.$loaded().then(function (x) {
          x.forEach(function (item) {
            registros.push(item);
          });
          defered.resolve(registros);
        }).catch(function (err) {
          defered.reject(err)
        });
        return promise;
      }

      function deleteFile(index) {
        var defered = $q.defer();
        var promise = defered.promise;
        var posts = $firebaseArray(ref);
        posts.$loaded().then(function (x) {
          posts.$remove(index).then(function (ref) {
            defered.resolve(true);
          });

        }).catch(function (err) {
          defered.reject(false)
        });
        return promise;

      }

      function initialData() {


        memoriaFactory.ObtieneTiposImagenes().then(function (response) {
          vm.tiposresp = response.GetObtieneTiposImagenesListResult;
          memoriaFactory.GetObtieneMemoriaTecnica(vm.id).then(function (data) {
            console.log(data);
            detalle(data.GetObtieneMemoriaTecnicaResult[0]);
            memoriaFactory.GetObtieneImagenesMemoriaTecnica(vm.id).then(function (response) {
              vm.Lista_evidencias = response.GetObtieneImagenesMemoriaTecnicaResult;
              vm.Lista_evidencias.forEach(function (item) {
                item.Ruta = item.Ruta;
                item.url = globalService.getUrlmemoriatecnicaImages() + '/' + item.Ruta;
                item.thumbUrl = globalService.getUrlmemoriatecnicaImages() + '/' + item.Ruta;
                item.RutaCompleta = globalService.getUrlmemoriatecnicaImages() + '/' + item.Ruta;
                item.Opcion = 2;
              });

              memoriaFactory.GetObtieneEquiposSustituir(vm.IdMemoriaTecnica).then(function (result) {
                var eq = result.GetObtieneEquiposSustituirResult;
                eq.forEach(function (item) {
                  var equipo = {};
                  equipo.IdEquipoSustituir = item.IdEquipoSustituir;
                  equipo.IdMemoriaTecnica = item.IdMemoriaTecnica;
                  equipo.Equipo = item.Equipo;
                  equipo.SerieAnterior = item.SerieAnterior;
                  equipo.SerieNueva = item.SerieNueva;
                  equipo.Opcion = 2;
                  vm.cambios.push(equipo);
                });
                memoriaFactory.GetObtieneDigitalMemoriaTecnica(vm.IdMemoriaTecnica).then(function (result) {
                  var ed = result.GetObtieneDigitalMemoriaTecnicaResult;
                  ed.forEach(function (item) {
                    var equipodig = {};
                    equipodig.IdEquipoSustituir = item.IdEquipoSustituir;
                    equipodig.IdMemoriaTecnica = item.IdMemoriaTecnica;
                    equipodig.Equipo = item.Equipo;
                    equipodig.SerieAnterior = item.SerieAnterior;
                    equipodig.paquete = item.paquete;
                    equipodig.Opcion = 2;
                    vm.aparatosdigitales.push(equipodig);
                  });

                  memoriaFactory.GetObtieneObservacionesMemoriaTecnica(vm.id).then(function (result) {
                    console.log(result.GetObtieneObservacionesMemoriaTecnicaResult);
                    var notas = result.GetObtieneObservacionesMemoriaTecnicaResult;
                    notas.forEach(function (item) {
                      console.log(item);
                      var obj = {};
                      obj.Observacion = item.Observacion;
                      obj.IdUsuario = 0;
                      obj.IdObservacion = 0;
                      obj.Fecha = item.Fecha;
                      obj.Nombre = item.Nombre;
                      vm.notas_ant.push(obj);

                    });
                  
                    memoriaFactory.GetEstatusTecnico().then(function (estatus) {
                      vm.listEstatus = estatus.GetEstatusTecnicoResult;
                      vm.listEstatus.forEach(function (item, index) {
                        if (item.IdEstatusTecnico === vm.IdEstatusTecnico) {
                          vm.estatustecnico = vm.listEstatus[index];
                        }
                      });
    
                      memoriaFactory.GetTipoServicio().then(function (tipos) {
                        vm.listTiposerv = tipos.GetTipoServicioResult;
                        vm.listTiposerv.forEach(function (item, index) {
                          if (item.IdTipoServicio === vm.IdTipoServicio) {
                            vm.tiposervicio = vm.listTiposerv[index];
                          }
                        });
    
    
                      });
                    });

                  });


                });
              });
            });
          });
        });
      }
      
      
      function getApartos(modem,radio,router,antena,ups) {
        memoriaFactory.GetAparatosTecnico(1, vm.numeroorden, vm.instalador.IdEntidad, vm.IdMemoriaTecnica).then(function (aparatos) {
          vm.listModem = aparatos.GetAparatosTecnicoResult;
          vm.listModem.forEach(function(item,index){
             if(item.Descripcion===modem){
              vm.modem=vm.listModem[index];
             }
          });

          memoriaFactory.GetAparatosTecnico(2, vm.numeroorden, vm.instalador.IdEntidad, vm.IdMemoriaTecnica).then(function (aparatos) {
            vm.listRadio = aparatos.GetAparatosTecnicoResult;
            vm.listRadio.forEach(function(item,index){
              if(item.Descripcion===radio){
                vm.serieradio=vm.listRadio[index];
              }             
            });

            memoriaFactory.GetAparatosTecnico(3, vm.numeroorden, vm.instalador.IdEntidad, vm.IdMemoriaTecnica).then(function (aparatos) {
              vm.listRouter = aparatos.GetAparatosTecnicoResult;
              vm.listRouter.forEach(function(item,index){
               if(item.Descripcion===router){
                vm.serierouter=vm.listRouter[index];
               }
              });
              

              memoriaFactory.GetAparatosTecnico(4, vm.numeroorden, vm.instalador.IdEntidad, vm.IdMemoriaTecnica).then(function (aparatos) {
                vm.listSTB = aparatos.GetAparatosTecnicoResult;


                memoriaFactory.GetAparatosTecnico(5, vm.numeroorden, vm.instalador.IdEntidad, vm.IdMemoriaTecnica).then(function (aparatos) {
                  vm.listAntena = aparatos.GetAparatosTecnicoResult;
                  vm.listAntena.forEach(function(item,index){
                    if(item.Descripcion===antena){
                      vm.antena=vm.listAntena[index];
                     }
                  });

                  memoriaFactory.GetAparatosTecnico(6, vm.numeroorden, vm.instalador.IdEntidad, vm.IdMemoriaTecnica).then(function (aparatos) {
                    vm.listUPS = aparatos.GetAparatosTecnicoResult;
                    vm.listUPS.forEach(function(item,index){
                      if(item.Descripcion===ups){
                        vm.upsserie=vm.listUPS[index];
                       }
                    })
                  });
                });
              });
            });
          });
        });
      }


      function getTecnicos(id, idtecnico,Modem,Radio,Router,Antena,UPS) {
        memoriaFactory.GetTecnicosMemoriaTecnica(id).then(function (tecnicos) {
          vm.listTecnicos = tecnicos.GetTecnicosMemoriaTecnicaResult;
          vm.listTecnicos.forEach(function (item, index) {
            if (item.IdEntidad === idtecnico) {
              vm.instalador = vm.listTecnicos[index];
            }
          });
          getApartos(Modem,Radio,Router,Antena,UPS);
        });
      }

      function guardaNota() {
        var obj = {};
        obj.Observacion = vm.detallenota;
        obj.IdUsuario = $localStorage.currentUser.idUsuario;
        obj.IdObservacion = 0;
        obj.Fecha = moment().format('L');
        obj.Nombre = $localStorage.currentUser.nombre;
        vm.notas.push(obj);
      }

      function validaAparatodig(serie) {
        var count = 0;
        vm.aparatosdigitales.forEach(function (item) { count += (item.SerieAnterior === serie) ? 1 : 0;      });
        return (count > 0) ? true : false;
      }


      function addAparatodig() {
        
              if (vm.aparatosdigitales.length < 3) {
                if (!validaAparatodig(vm.DTH.Descripcion)) {
                  var obj = {};
                  obj.SerieAnterior = vm.DTH.Descripcion;
                  obj.IdEquipoSustituir = 0;
                  obj.IdMemoriaTecnica = vm.id;
                  obj.paquete = vm.DTH.Servicio;
                  obj.Opcion = 3;
                  obj.IdUsuario = $localStorage.currentUser.idUsuario;
                  obj.Equipo = vm.DTH.Clv_CableModem;
                  vm.aparatosdigitales.push(obj);
                } else {
                  ngNotify.set('El aparato ya esta seleccionado', 'warn');
                }
              } else {
                ngNotify.set('solo puedes ingresar 3 aparatos', 'warn');
              }
            }
/*
      function addAparatodig() {
        if( vm.aparatosdigitales.length < 2){
          var obj = {};
          obj.SerieAnterior = vm.seriedigital;
          obj.IdEquipoSustituir = 0;
          obj.IdMemoriaTecnica = vm.id;
          obj.paquete = vm.paquete;
          obj.Opcion = 3;
          obj.IdUsuario = $localStorage.currentUser.idUsuario;
          obj.Equipo = vm.equipodigital;
          vm.aparatosdigitales.push(obj);
        }

      } */


      function BorraImagen(index) {
        if (index > -1) {
          var obj = vm.Lista_evidencias[index];
          obj.Opcion = 2;
          obj.IdUsuario = $localStorage.currentUser.idUsuario;
          vm.Imagenes_eliminadas.push(obj);
          vm.Lista_evidencias.splice(index, 1);
        }
      }


      function eliminaaparato(index) {
        if (index > -1) {
          var obj = vm.cambios[index];
          vm.cambios.splice(index, 1);
          if (obj.IdEquipoSustituir > 0) {
            obj.Opcion = 2;
            obj.IdUsuario = $localStorage.currentUser.idUsuario;
            vm.cambios_eliminados.push(obj);

          }
        }
      }

      function eliminaaparatodig(index) {
        if (index > -1) {
          var obj = vm.aparatosdigitales[index];
          vm.aparatosdigitales.splice(index, 1);
          if (obj.IdEquipoSustituir > 0) {
            obj.Opcion = 2;
            obj.IdUsuario = $localStorage.currentUser.idUsuario;
            vm.digitales_eliminados.push(obj);

          }
        }
      }


      function cambioAparato() {
        if ((vm.serieanterior !== '' && vm.serieanterior !== undefined) &&
          (vm.equiposurtir !== '' && vm.equiposurtir !== undefined) &&
          (vm.serienueva !== '' && vm.serienueva !== undefined)) {
          if (vm.serienueva !== vm.serieanterior) {
            var obj = {};
            obj.SerieAnterior = vm.serieanterior;
            obj.Equipo = vm.equiposurtir;
            obj.SerieNueva = vm.serienueva;
            obj.IdEquipoSustituir = 0;
            obj.IdMemoriaTecnica = vm.id;
            obj.IdUsuario = $localStorage.currentUser.idUsuario;
            obj.Opcion = 3;

            vm.cambios.push(obj);
            vm.serieanterior = '';
            vm.equiposurtir = '';
            vm.serienueva = '';
          } else {
            ngNotify.set('Las series no pueden ser iguales', 'error');
          }

        } else {
          ngNotify.set('Necesita completar todos los campos', 'error');
        }
      }


      function isvalid(value) {
        return (value !== undefined && value !== '' && value !== null) ? true : false;
      }


      function guardar() {
        console.log(vm.instalador);
       
        var obj = {
          'IdMemoriaTecnica': vm.IdMemoriaTecnica,
          'SAN': (isvalid(vm.SAN) === true) ? vm.SAN : 0,
          'Contrato': (isvalid(vm.contrato) === true) ? vm.contrato : 0,
          'Distribuidor': (isvalid(vm.distribuidor) === true) ? vm.distribuidor : '',
          'Instalador': (isvalid(vm.instalador) === true) ? vm.instalador.Nombre: '',
          'FechaVisita': (isvalid(vm.fechasitio) === true) ? vm.fechasitio : '', // $filter('date')(vm.fechasitio, 'yyyy-MM-dd') : '',
          'HoraLlegada': (isvalid(vm.horallegada) === true) ? vm.horallegada : '',
          'HoraSalida': (isvalid(vm.horasalida) === true) ? vm.horasalida : '',
          'SiteId': 0,
          'Cliente': (isvalid(vm.cliente) === true) ? vm.cliente : '',
          'Estado': (isvalid(vm.estado) === true) ? vm.estado : '',
          'Municipio': (isvalid(vm.municipio) === true) ? vm.municipio : '',
          'Localidad': (isvalid(vm.localidad) === true) ? vm.localidad : '',
          'Direccion': (isvalid(vm.direccion) === true) ? vm.direccion : '',
          'PersonaRecibe': (isvalid(vm.recibe) === true) ? vm.recibe : '',
          'Plataforma': (isvalid(vm.plataforma) === true) ? vm.plataforma : '',
          'Servicio': (isvalid(vm.plan) === true) ? vm.plan : '',
          'TipoServicio': (isvalid(vm.tiposervicio) === true) ? vm.tiposervicio.IdTipoServicio : 0,
          'Velocidad': (isvalid(vm.velocidad) === true) ? vm.velocidad : '',
          'DomicilioNotificacion': (isvalid(vm.domicilionotificacion) === true) ? vm.domicilionotificacion : '',
          'CodigoPostal': (isvalid(vm.codigopostal) === true) ? vm.codigopostal : '',
          'Telefono': vm.telefono,
          'Celular': vm.celular,
          'Latitud': vm.latitud,
          'Longitud': vm.longitud,
          'Beam': (isvalid(vm.beam) === true) ? vm.beam : '',
          'EstatusTecnico': (isvalid(vm.estatustecnico) === true) ? vm.estatustecnico.IdEstatusTecnico : '',
          'FechaActivacion': (isvalid(vm.fechaactivacion) === true) ? vm.fechaactivacion : '', // ? $filter('date')(vm.fechaactivacion, 'yyyy-MM-dd') : '',
          'VCNeutroTierra': (isvalid(vm.vcneutrotierra) === true) ? vm.vcneutrotierra : '',
          'VCFaseTierra': (isvalid(vm.vcfasetierra) === true) ? vm.vcfasetierra : '',
          'VCFaseNeutro': (isvalid(vm.vcfaseneutro) === true) ? vm.vcfaseneutro : '',
          'VUPSNeutroTierra': (isvalid(vm.upcneutrotierra) === true) ? vm.upcneutrotierra : '',
          'VUPSFaseTierra': (isvalid(vm.upcfasetierra) === true) ? vm.upcfasetierra : '',
          'VUPSFaseNeutro': (isvalid(vm.upcfaseneutro) === true) ? vm.upcfaseneutro : '',
          'Modem': (isvalid(vm.modem) === true) ? vm.modem.Descripcion : '',
          'Antena': (isvalid(vm.tamanoantena) === true) ? vm.tamanoantena : '',
          'SQF': (isvalid(vm.sqf) === true) ? vm.sqf : '',
          'Radio': (isvalid(vm.serieradio) === true) ? vm.serieradio.Descripcion : '',
          'Router': (isvalid(vm.serierouter) === true) ? vm.serierouter.Descripcion : '',
          'MarcaRouter': (isvalid(vm.marcarouter) === true) ? vm.marcarouter : '',
          'UPS': (isvalid(vm.upsserie) === true) ? vm.upsserie.Descripcion : '',
          'WiFi':  '',
          'Instalacion': vm.Instalacion,
          'InstalacionDemo': vm.InstalacionDemo,
          'Apuntamiento': vm.Apuntamiento,
          'Reubicacion': vm.Reubicacion,
          'CambioComponentes': vm.CambioComponentes,
          'Mantenimiento': vm.Mantenimiento,
          'SiteSurvey': vm.SiteSurvey,
          'Detalles': (isvalid(vm.detalleinstalacion) === true) ? vm.detalleinstalacion : '',
          'Folio': (isvalid(vm.numerofolio) === true) ? vm.numerofolio : 0,
          'Clv_Orden': (isvalid(vm.numeroorden) === true) ? vm.numeroorden : 0,
          'IdUsuario': $localStorage.currentUser.idUsuario,
          'PersonaValidaServicio': vm.PersonaValidaServicio,
          'IdEstatusTecnico':vm.estatustecnico.IdEstatusTecnico,
          'IdTipoServicio':vm.tiposervicio.IdTipoServicio,
          'IdTecnico':(isvalid(vm.instalador) === true) ? vm.instalador.IdEntidad  :0  ,
          'AntenaSerie':isvalid(vm.antena.Descripcion ) === true ? vm.antena.Descripcion : "" 
        };

        var file_options = [];
        var files = [];
        var tipos = [];
       
        vm.uploader.queue.forEach(function (f) {

         
            var options = {
              'IdImagen': 0,
              'Accion': 3,
              'Tipo': f._file.idtipo,
              'Nombre': f._file.name,
              'IdUsuario': $localStorage.currentUser.idUsuario
            };
            file_options.push(options);
            tipos.push(f._file.idtipo);
            files.push(f._file);
          
        });

       

        memoriaFactory.UpdateGuardaMemoriaTecnica(obj).then(function (response) {
          var equiposdig_ = [];
          vm.aparatosdigitales.forEach(function (item) {
            if (item.Opcion === 3) {
              equiposdig_.push(item);
            }
          });
          vm.digitales_eliminados.forEach(function (item) {
            equiposdig_.push(item);
          });
          var equipos_ = [];
          vm.cambios.forEach(function (item) {
            if (item.Opcion === 3) {
              equipos_.push(item);
            }
          });
          vm.cambios_eliminados.forEach(function (item) {
            equipos_.push(item);
          });

          memoriaFactory.GetGuardaEquiposDigital(equiposdig_).then(function (data) {

            memoriaFactory.GuardaEquiposSustituir(equipos_).then(function (result) {

              if (vm.notas.length > 0) {
                vm.notas.forEach(function(item){
                  item.IdMemoriaTecnica = vm.IdMemoriaTecnica;
                });                    
                memoriaFactory.GetGuardaObservacionMemoriaTecnicaList(vm.notas).then(function (resp) {});
              }



              memoriaFactory.GuardaImagenesMemoriaTecnica(files, vm.IdMemoriaTecnica, file_options, vm.Imagenes_eliminadas).then(function (data) {
                vm.uploader.clearQueue();
                ngNotify.set('La memoria técnica  se ha guardado correctamente', 'success');
                $state.go('home.memoria.memoriastecnicas');
              });

            });
          });
        });

      }

      function detalle(det) {
        vm.Apuntamiento = det.Apuntamiento;
        vm.tamanoantena = det.Antena;
        vm.beam = det.Beam;
        vm.CambioComponentes = det.CambioComponentes;
        vm.celular = det.Celular;
        vm.cliente = det.Cliente;
        vm.numeroorden = det.Clv_Orden;
        vm.codigopostal = det.CodigoPostal;
        vm.contrato = det.Contrato;
        vm.detalleinstalacion = det.Detalles;
        vm.direccion = det.Direccion;
        vm.distribuidor = det.Distribuidor;
        vm.domicilionotificacion = det.DomicilioNotificacion;
        vm.estado = det.Estado;
        vm.estatustecnico = det.EstatusTecnico;
        vm.fechacaptura = det.Fecha;
        vm.fechaactivacion = det.FechaActivacion;
        vm.fechasitio = det.FechaVisita;
        vm.numerofolio = det.Folio;
        vm.mensajefolio = (vm.numerofolio > 0) ? 'Folio generado' : 'Generar Folio';
        vm.generafolio = (vm.numerofolio > 0) ? true : false;
        vm.blockgenerafolio = (vm.numerofolio > 0) ? true : false;
        vm.horallegada = det.HoraLlegada;
        vm.horasalida = det.HoraSalida;
        vm.IdMemoriaTecnica = det.IdMemoriaTecnica;
        vm.IdUsuario = det.IdUsuario;
        vm.Instalacion = det.Instalacion;
        vm.InstalacionDemo = det.InstalacionDemo;
        vm.instalador = det.Instalador;
        vm.latitud = det.Latitud;
        vm.localidad = det.Localidad;
        vm.longitud = det.Longitud;
        vm.Mantenimiento = det.Mantenimiento;
        vm.marcarouter = det.MarcaRouter;        
        vm.municipio = det.Municipio;
        vm.recibe = det.PersonaRecibe;
        vm.plataforma = det.Plataforma;       
        vm.Reubicacion = det.Reubicacion;       
        vm.SAN = det.SAN;
        vm.sqf = det.SQF;
        vm.plan = det.Servicio;
        vm.siteid = det.SiteId;
        vm.SiteSurvey = det.SiteSurvey;
        vm.telefono = det.Telefono;
        vm.tiposervicio = det.TipoServicio;
        vm.upsserie = det.UPS;
        vm.vcfaseneutro = det.VCFaseNeutro;
        vm.vcfasetierra = det.VCFaseTierra;
        vm.vcneutrotierra = det.VCNeutroTierra;
        vm.upcfaseneutro = det.VUPSFaseNeutro;
        vm.upcfasetierra = det.VUPSFaseTierra;
        vm.upcneutrotierra = det.VUPSNeutroTierra;
        vm.velocidad = det.Velocidad;
        vm.wifiserie = det.WiFi;
        vm.contratocompania = det.contratocompania;
        vm.PersonaValidaServicio = det.PersonaValidaServicio;
        vm.Combo = det.Combo;
        vm.IdEstatusTecnico = det.IdEstatusTecnico;
        vm.IdTipoServicio = det.IdTipoServicio;
        getTecnicos(vm.contratocompania.split('-')[1], det.IdTecnico,det.Modem,det.Radio,det.Router,det.AntenaSerie,det.UPS);
        vm.titulo = 'Edición de memoria técnica #' + vm.IdMemoriaTecnica;
      }

      function obtenfolio() {

        memoriaFactory.GetGeneraFolioMemoriaTecnica(vm.IdMemoriaTecnica)
          .then(function (response) {

            var id = vm.IdMemoriaTecnica;
            GetdataFire().then(function (result) {
              result.forEach(function (item, index) {
                if (parseInt(item.Id) === parseInt(id)) {
                  deleteFile(index).then(function (result) {
                    console.log(result);
                  });

                }
              });

            });


            vm.numerofolio = response.GetGeneraFolioMemoriaTecnicaResult;
            vm.mensajefolio = (vm.numerofolio.trim().length>0) ? 'Folio generado' : 'Generar Folio';
            vm.generafolio = (vm.numerofolio.trim().length>0) ? true : false;
            vm.blockgenerafolio = (vm.numerofolio.trim().length>0) ? true : false;

          });

      }


      var openLightboxModal =
        function (index) {
          Lightbox.openModal(vm.Lista_evidencias, index);
        };


        function eliminaNota(index) {
          if (index > -1) {
            vm.notas.splice(index, 1);
          }
        }


      var vm = this;
      vm.eliminaNota = eliminaNota;
      vm.uploader = new FileUploader();
      vm.id = $stateParams.id;
      initialData();
      vm.openLightboxModal = openLightboxModal;
      vm.showguardar = true;
      vm.seleccionImagen = true;
      vm.detalle = false;
      vm.guardar = guardar;
      vm.cambioAparato = cambioAparato;
      vm.cambios = [];
      vm.cambios_eliminados = [];
      vm.eliminaaparato = eliminaaparato;
      vm.Imagenes_eliminadas = [];
      vm.BorraImagen = BorraImagen;
      vm.obtenfolio = obtenfolio;
      vm.aparatosdigitales = [];
      vm.digitales_eliminados = [];
      vm.eliminaaparatodig = eliminaaparatodig;
      vm.addAparatodig = addAparatodig;
      vm.blockorden = true;
      vm.blockcontrato = true;
      vm.guardaNota = guardaNota;
      vm.notas = [];
      vm.notas_ant = [];
      vm.permitecheck=$localStorage.currentUser.CheckMemoria;
      vm.uploader.onAfterAddingFile = function (fileItem) {
        fileItem.file.idtipo = vm.tipoimagen.IdTipo;
        fileItem.file.tipo = vm.tipoimagen.Nombre;
        fileItem._file.idtipo = vm.tipoimagen.IdTipo;
        fileItem._file.tipo = vm.tipoimagen.Nombre;
        fileItem.IdUsuario = $localStorage.currentUser.idUsuario;
      };
    });
