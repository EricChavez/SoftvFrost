'use strict';
angular
  .module("softvFrostApp")
  .controller("nuevamemoriatecnicaCtrl", function (
    $state,
    ngNotify,
    memoriaFactory,
    $localStorage,
    $uibModal,
    $filter,
    FileUploader,
    $firebaseArray,
    firebase,
    moment

  ) {
    var vm = this;
    vm.cambios = [];
    vm.notas = [];
    vm.notas_ant = [];
    vm.cambios_eliminados = [];
    vm.aparatosdigitales = [];
    vm.cambioAparato = cambioAparato;
    vm.eliminaaparato = eliminaaparato;
    vm.guardar = guardar;
    vm.BorraImagen = BorraImagen;
    vm.showguardar = false;
    vm.seleccionImagen = true;
    vm.detalle = false;
    vm.validar = validar;
    vm.generafolio = false;
    vm.mensajefolio = "Generar Folio";
    vm.blockgenerafolio = true;
    vm.titulo = "Registro de memoria técnica";
    vm.addAparatodig = addAparatodig;
    vm.eliminaaparatodig = eliminaaparatodig;
    vm.blockorden = false;
    vm.blockcontrato = false;
    vm.Imagenes_eliminadas = [];
    vm.guardaNota = guardaNota;
    vm.eliminaNota = eliminaNota;
    vm.detalleTecnico = detalleTecnico;
    initialData();

    function initialData() {
      var fechaHoy = new Date();
      vm.fechasitio = $filter('date')(fechaHoy, 'dd/MM/yyyy');
      vm.horallegada = moment().format('HH:mm');
      vm.instalador = $localStorage.currentUser.usuario;
      vm.permitecheck = $localStorage.currentUser.CheckMemoria;     
      memoriaFactory.ObtieneTiposImagenes().then(function (response) {
        vm.tiposresp = response.GetObtieneTiposImagenesListResult;
        memoriaFactory.GetEstatusTecnico().then(function (estatus) {         
          vm.listEstatus = estatus.GetEstatusTecnicoResult;
          memoriaFactory.GetTipoServicio().then(function (tipos) {          
            vm.listTiposerv = tipos.GetTipoServicioResult;
          });
        });
      });
    }

    function getValidationdata(obj) {
      var results = obj;
      vm.celular = results.Celular;
      vm.cliente = results.Cliente;
      vm.beam = results.Beam;
      vm.contrato = results.Contrato;
      vm.direccion = results.Direccion + '\nCol.' + results.Colonia;
      vm.distribuidor = results.Distribuidor;
      vm.estado = results.Estado;
      vm.latitud = results.Latitud;
      vm.localidad = results.Localidad;
      vm.longitud = results.Longitud;
      vm.municipio = results.Municipio;
      vm.plataforma = results.Plataforma;
      vm.contratocompania = results.contratocompania;
      vm.SAN = results.SAN;
      vm.plan = results.Servicio;
      vm.telefono = results.Telefono;
      vm.Combo = results.Combo;
      vm.codigopostal = results.CodigoPostal;     
      getTecnicos(vm.contratocompania.split('-')[1]);
    }



    function validar() {
      memoriaFactory.GetObtieneDatosPorOrden(vm.numeroorden).then(function (result) {         
          if (result.GetObtieneDatosPorOrdenResult.length > 0) {
            if (result.GetObtieneDatosPorOrdenResult[0].Error > 0) {
              ngNotify.set(result.GetObtieneDatosPorOrdenResult[0].Msg, "error");
              getValidationdata(result.GetObtieneDatosPorOrdenResult[0]);
            } else {
              getValidationdata(result.GetObtieneDatosPorOrdenResult[0]);
              vm.showguardar = true;
            }
            } else {
            ngNotify.set("El Numero de orden ingresado no es válido ,intente con otro", "warn");
          }
        });
    }

    vm.uploader = new FileUploader({
      filters: [{
        name: "yourName1",fn: function (item) {
          var count = 0;
          vm.uploader.queue.forEach(function (f) {
            count += f._file.name === item.name ? 1 : 0;
          });
          if (count > 0) {
          ngNotify.set("Un archivo con ese mismo nombre ya fue seleccionado","warn");
            return false;
          } else {
            return true;
          }
        }
      }]
    });

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
          obj.IdMemoriaTecnica = 0;
          obj.paquete = vm.DTH.Servicio;
          obj.Opcion = 1;
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

    function eliminaaparatodig(index) {
      if (index > -1) {
        vm.aparatosdigitales.splice(index, 1);
      }
    }

    function eliminaNota(index) {
      if (index > -1) {
        vm.notas.splice(index, 1);
      }
    }

    vm.uploader.onAfterAddingFile = function (fileItem) {
      fileItem.file.idtipo = vm.tipoimagen.IdTipo;
      fileItem.file.tipo = vm.tipoimagen.Nombre;
      fileItem._file.idtipo = vm.tipoimagen.IdTipo;
      fileItem._file.tipo = vm.tipoimagen.Nombre;
      fileItem.IdUsuario = $localStorage.currentUser.idUsuario;
    };

    function getTecnicos(id) {
      memoriaFactory.GetTecnicosMemoriaTecnica(id).then(function (tecnicos) {
        vm.listTecnicos = tecnicos.GetTecnicosMemoriaTecnicaResult;        
      });
    }

    function detalleTecnico() {
      vm.listModem = [];
      vm.listRadio = [];
      vm.listRouter = [];
      vm.listSTB = [];
      vm.listAntena = [];
      vm.aparatosdigitales = [];
      getApartos();
    }

    function getApartos(){
      memoriaFactory.GetAparatosTecnico(1, vm.numeroorden,vm.instalador.IdEntidad,0).then(function (aparatos) {
        vm.listModem = aparatos.GetAparatosTecnicoResult;
        memoriaFactory.GetAparatosTecnico(2, vm.numeroorden, vm.instalador.IdEntidad,0).then(function (aparatos) {       
          vm.listRadio = aparatos.GetAparatosTecnicoResult;
          memoriaFactory.GetAparatosTecnico(3, vm.numeroorden, vm.instalador.IdEntidad,0).then(function (aparatos) {       
            vm.listRouter = aparatos.GetAparatosTecnicoResult;
            memoriaFactory.GetAparatosTecnico(4, vm.numeroorden, vm.instalador.IdEntidad,0).then(function (aparatos) {      
              vm.listSTB = aparatos.GetAparatosTecnicoResult;
              memoriaFactory.GetAparatosTecnico(5, vm.numeroorden, vm.instalador.IdEntidad,0).then(function (aparatos) {       
                vm.listAntena = aparatos.GetAparatosTecnicoResult;
                memoriaFactory.GetAparatosTecnico(6, vm.numeroorden, vm.instalador.IdEntidad,0).then(function (aparatos) {       
                  vm.listUPS = aparatos.GetAparatosTecnicoResult;
                });
              });
            });
          });
        });
      });
    }

  
    function BorraImagen(index) {
      if (index > -1) {
        vm.cambios.splice(index, 1);
      }
    }

    function eliminaaparato(index) {
      if (index > -1) {
        vm.cambios.splice(index, 1);
      }
    }

    function cambioAparato() {
      if (vm.serieanterior && vm.equiposurtir && vm.serienueva) {
        if (vm.serienueva !== vm.serieanterior) {
          var obj = {};
          obj.SerieAnterior = vm.serieanterior;
          obj.Equipo = vm.equiposurtir;
          obj.SerieNueva = vm.serienueva;
          obj.Opcion = 1;
          obj.IdEquipoSustituir = 0;
          obj.IdMemoriaTecnica = 0;
          obj.Opcion = 1;
          obj.IdUsuario = $localStorage.currentUser.idUsuario;
          vm.cambios.push(obj);
          vm.serieanterior = "";
          vm.equiposurtir = "";
          vm.serienueva = "";
        } else {
          ngNotify.set("Las series no pueden ser iguales", "error");
        }
      } else {
        ngNotify.set("Necesita completar todos los campos", "error");
      }
    }

    function isvalid(value) {
      return value !== undefined && value !== "" && value !== null ?  true : false;
    }

    function guardaNota() {
      var obj = {};
      obj.Observacion = vm.detallenota;
      obj.IdUsuario = $localStorage.currentUser.idUsuario;
      obj.IdObservacion = 0;
      obj.Fecha = moment().format('L');
      obj.Nombre = $localStorage.currentUser.nombre;
      vm.notas.push(obj);
      vm.detallenota = '';
    }

    function guardar() {
      var obj = {
        SAN: isvalid(vm.SAN) === true ? vm.SAN : 0,
        Contrato: isvalid(vm.contrato) === true ? vm.contrato : 0,
        Distribuidor: isvalid(vm.distribuidor) === true ? vm.distribuidor : "",
        Instalador: isvalid(vm.instalador.Nombre ) === true ? vm.instalador.Nombre  : "",
        FechaVisita: isvalid(vm.fechasitio) === true ? $filter("date")(vm.fechasitio, "yyyy/MM/dd") : "",
        HoraLlegada: isvalid(vm.horallegada) === true ? vm.horallegada : "",
        HoraSalida: isvalid(vm.horasalida) === true ? vm.horasalida : "",
        SiteId: 0,
        Cliente: isvalid(vm.cliente) === true ? vm.cliente : "",
        Estado: isvalid(vm.estado) === true ? vm.estado : "",
        Municipio: isvalid(vm.municipio) === true ? vm.municipio : "",
        Localidad: isvalid(vm.localidad) === true ? vm.localidad : "",
        Direccion: isvalid(vm.direccion) === true ? vm.direccion : "",
        PersonaRecibe: isvalid(vm.recibe) === true ? vm.recibe : "",
        Plataforma: isvalid(vm.plataforma) === true ? vm.plataforma : "",
        Servicio: isvalid(vm.plan) === true ? vm.plan : "",
        TipoServicio: isvalid(vm.tiposervicio.Descripcion ) === true ? vm.tiposervicio.Descripcion  : "",
        Velocidad: isvalid(vm.velocidad) === true ? vm.velocidad : "",
        DomicilioNotificacion: isvalid(vm.domicilionotificacion) === true ?
          vm.domicilionotificacion : "",
        CodigoPostal: isvalid(vm.codigopostal) === true ? vm.codigopostal : "",
        Telefono: vm.telefono,
        Celular: vm.celular,
        Latitud: vm.latitud,
        Longitud: vm.longitud,
        Beam: isvalid(vm.beam) === true ? vm.beam : "",
        EstatusTecnico: isvalid(vm.estatustecnico.Descripcion ) === true ? vm.estatustecnico.Descripcion  : "",
        FechaActivacion: isvalid(vm.fechaactivacion) === true ? $filter("date")(vm.fechaactivacion, "yyyy/MM/dd") : "",
        VCNeutroTierra: isvalid(vm.vcneutrotierra) === true ? vm.vcneutrotierra : "",
        VCFaseTierra: isvalid(vm.vcfasetierra) === true ? vm.vcfasetierra : "",
        VCFaseNeutro: isvalid(vm.vcfaseneutro) === true ? vm.vcfaseneutro : "",
        VUPSNeutroTierra: isvalid(vm.upcneutrotierra) === true ? vm.upcneutrotierra : "",
        VUPSFaseTierra: isvalid(vm.upcfasetierra) === true ? vm.upcfasetierra : "",
        VUPSFaseNeutro: isvalid(vm.upcfaseneutro) === true ? vm.upcfaseneutro : "",
        Modem: isvalid(vm.modem.Descripcion) === true ? vm.modem.Descripcion : "",
        Antena: isvalid(vm.tamanoantena) === true ? vm.tamanoantena : "",
        SQF: isvalid(vm.sqf) === true ? vm.sqf : "",
        Radio: isvalid(vm.serieradio.Descripcion ) === true ? vm.serieradio.Descripcion  : "",
        Router: isvalid(vm.serierouter.Descripcion ) === true ? vm.serierouter.Descripcion : "",
        MarcaRouter: isvalid(vm.marcarouter) === true ? vm.marcarouter : "",
        UPS: isvalid(vm.upsserie.Descripcion ) === true ? vm.upsserie.Descripcion : "",
        WiFi: "",
        Instalacion: vm.Instalacion,
        InstalacionDemo: vm.InstalacionDemo,
        Apuntamiento: vm.Apuntamiento,
        Reubicacion: vm.Reubicacion,
        CambioComponentes: vm.CambioComponentes,
        Mantenimiento: vm.Mantenimiento,
        SiteSurvey: vm.SiteSurvey,
        Detalles: isvalid(vm.detalleinstalacion) === true ? vm.detalleinstalacion : "",
        Folio: isvalid(vm.numerofolio) === true ? vm.numerofolio : 0,
        Clv_Orden: isvalid(vm.numeroorden) === true ? vm.numeroorden : 0,
        IdUsuario: $localStorage.currentUser.idUsuario,
        PersonaValidaServicio: vm.PersonaValidaServicio,
        IdEstatusTecnico:vm.estatustecnico.IdEstatusTecnico,
        IdTipoServicio:vm.tiposervicio.IdTipoServicio,
        IdTecnico:vm.instalador.IdEntidad,
        AntenaSerie:isvalid(vm.antena.Descripcion ) === true ? vm.antena.Descripcion : "" 
      };

      var file_options = [];
      var files = [];
      var tipos = [];

      vm.uploader.queue.forEach(function (f) {
        var options = {
          IdImagen: 0,
          Accion: 1,
          Tipo: f._file.idtipo,
          Nombre: f._file.name,
          IdUsuario: $localStorage.currentUser.idUsuario
        };
        file_options.push(options);
        tipos.push(f._file.idtipo);
        files.push(f._file);
      });


      memoriaFactory.GuardaMemoriaTecnica(obj).then(function (response) {
        vm.IdMemoriaTecnica = response.GetGuardaMemoriaTecnicaListResult[0].IdMemoriaTecnica;

        memoriaFactory.GuardaImagenesMemoriaTecnica(files, vm.IdMemoriaTecnica, file_options, []).then(function (data) {
          ngNotify.set("las imagenes se han guardado correctamente", "success");
          vm.uploader.clearQueue();

          vm.cambios.forEach(function (item) {
            item.IdMemoriaTecnica = vm.IdMemoriaTecnica;
          });
          vm.aparatosdigitales.forEach(function (item) {
            item.IdMemoriaTecnica = vm.IdMemoriaTecnica;
          });

          memoriaFactory.GuardaEquiposSustituir(vm.cambios).then(function (result) {            
              memoriaFactory.GetGuardaEquiposDigital(vm.aparatosdigitales).then(function (data) {

                  if (vm.notas.length > 0) {
                    vm.notas.forEach(function (item) {  item.IdMemoriaTecnica = vm.IdMemoriaTecnica; });
                    memoriaFactory.GetGuardaObservacionMemoriaTecnicaList(vm.notas).then(function (resp) {});
                  }

                  var ref = firebase.database().ref().child("messages");
                  vm.messages = $firebaseArray(ref);
                  vm.messages.$add({
                    Id: vm.IdMemoriaTecnica,
                    Fecha: moment().format("L"),
                    Hora: moment().format("LT"),
                    Mensaje: 'Se ha generado una nueva memoria técnica',
                    Tipo: 1,
                    SAN: vm.SAN

                  });
                  ngNotify.set("La memoria técnica se ha guardado correctamente", "success");
                  $state.go("home.memoria.memoriastecnicas");
                });
            });
        });

      });
    }
  });
