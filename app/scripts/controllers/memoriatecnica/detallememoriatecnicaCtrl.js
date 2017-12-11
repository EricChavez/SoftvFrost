'use strict';
angular
  .module('softvFrostApp')
  .controller('detallememoriatecnicaCtrl',
    function ($state, ngNotify, memoriaFactory, $localStorage, $stateParams, FileUploader, globalService, Lightbox) {
      function initialData() {
        memoriaFactory.GetObtieneMemoriaTecnica(vm.id).then(function (data) {



          detalle(data.GetObtieneMemoriaTecnicaResult[0]);
          memoriaFactory.GetObtieneImagenesMemoriaTecnica(vm.id).then(function (response) {
            vm.Lista_evidencias = response.GetObtieneImagenesMemoriaTecnicaResult;
            vm.Lista_evidencias.forEach(function (item) {
              item.Ruta = item.Ruta;
              item.url = globalService.getUrlmemoriatecnicaImages() + '/' + item.Ruta;
              item.thumbUrl = globalService.getUrlmemoriatecnicaImages() + '/' + item.Ruta;
              item.RutaCompleta = globalService.getUrlmemoriatecnicaImages() + '/' + item.Ruta;
            });

            memoriaFactory.GetObtieneObservacionesMemoriaTecnica(vm.id).then(function (result) {
              var notas = result.GetObtieneObservacionesMemoriaTecnicaResult;
              notas.forEach(function (item) {
                var obj = {};
                obj.Observacion = item.Observacion;
                obj.IdUsuario = 0;
                obj.IdObservacion = 0;
                obj.Fecha = item.Fecha;
                obj.Nombre = item.Nombre;
                vm.notas_ant.push(obj);

              });
            });

            memoriaFactory.GetObtieneEquiposSustituir(vm.id).then(function (result) {
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
              memoriaFactory.GetObtieneDigitalMemoriaTecnica(vm.id).then(function (result) {
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

      function detalle(det) {
        console.log(det);
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
        vm.vcfaseneutro = det.VCFaseNeutro;
        vm.vcfasetierra = det.VCFaseTierra;
        vm.vcneutrotierra = det.VCNeutroTierra;
        vm.upcfaseneutro = det.VUPSFaseNeutro;
        vm.upcfasetierra = det.VUPSFaseTierra;
        vm.upcneutrotierra = det.VUPSNeutroTierra;
        vm.velocidad = det.Velocidad;
        vm.wifiserie = det.WiFi;
        vm.numeroorden = det.Clv_Orden;
        vm.PersonaValidaServicio = det.PersonaValidaServicio;
        vm.Combo = det.Combo;
        vm.contratocompania = det.contratocompania;
        vm.IdEstatusTecnico = det.IdEstatusTecnico;
        vm.IdTipoServicio = det.IdTipoServicio;
        getTecnicos(vm.contratocompania.split('-')[1], det.IdTecnico,det.Modem,det.Radio,det.Router,det.AntenaSerie,det.UPS);
        
      }


      var openLightboxModal =
        function (index) {
          Lightbox.openModal(vm.Lista_evidencias, index);
        };
      var vm = this;
      vm.uploader = new FileUploader();
      vm.id = $stateParams.id;
      initialData();
      vm.cambios = [];
      vm.notas = [];
      vm.notas_ant = [];
      vm.aparatosdigitales = [];
      vm.openLightboxModal = openLightboxModal;
      vm.showguardar = false;
      vm.seleccionImagen = false;
      vm.titulo = 'Detalle de memoria técnica #' + vm.id;
      vm.detalle = true;


    });
