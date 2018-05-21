'use strict';
angular

  .module('softvFrostApp')
  .controller('ModalGestionTerminalCtrl', function ($filter, $uibModalInstance, $uibModal, terminalFactory, terminal, $rootScope, ngNotify, globalService, configuracionIPFactory) {

    function initialData() {
      vm.Terminal = terminal;
    
      var paramAux = {};
      paramAux.SAN = vm.Terminal.SAN;
      //Nos traemos los datos de la IP de la terminal
      terminalFactory.GetDatosIPTerminal(paramAux).then(function (data) {
       
        vm.DatosIP = data.GetDatosIPTerminalResult;
     
      });
      terminalFactory.getComandoList().then(function (data) {
        vm.Comandos = data.GetComandoListResult;        
        //Vamos a dejar los comandos dependiendo del estado de la terminal
        if (vm.Terminal.Estatus ==="Incompleta") { //Incompleta
          obtieneIndex("Suspender Terminal");
          obtieneIndex("Reactivar Terminal");
          obtieneIndex("Cancelar Terminal");
          obtieneIndex("Cambiar servicio");
          obtieneIndex("Ver status de Movimiento");
          obtieneIndex("Cancelar Movimiento");
          obtieneIndex("Activar terminal");
          obtieneIndex("Swap");
          obtieneIndex("Mover");
          obtieneIndex("Token");
          obtieneIndex("Cambio de IP");
        } else if (vm.Terminal.Estatus == "Pendiente") { //Pendiente
          obtieneIndex("Suspender Terminal");
          obtieneIndex("Reactivar Terminal");
          obtieneIndex("Cancelar Terminal");
          obtieneIndex("Crear Terminal");
          obtieneIndex("Cambiar servicio");
          obtieneIndex("Ver status de Movimiento");
          obtieneIndex("Cancelar Movimiento");
          obtieneIndex("Activar terminal");
          obtieneIndex("Swap");
          obtieneIndex("Mover");
          obtieneIndex("Token");
        } else if (vm.Terminal.Estatus ==="Activa") { //Activa
          obtieneIndex("Crear Terminal");
          obtieneIndex("Reactivar Terminal");
          obtieneIndex("Ver status de Movimiento");
          obtieneIndex("Cancelar Movimiento");
          obtieneIndex("Activar terminal");
          terminalFactory.getServicioList().then(function (data) {
            vm.Servicios = data.GetServicioListResult;
          });
          //Nos vamos a traer el fap status y el consumo
          var obj = {};
          obj.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
          terminalFactory.hughesConsumoDeTerminal(obj).then(function (hughesData) {           
            vm.Consumo = {};
            vm.Consumo.Disponible = hughesData.envEnvelope.envBody.GetBandwidthInfoResponseMsg.AnyTimeBandwidthAvailable;
            vm.Consumo.Consumido = hughesData.envEnvelope.envBody.GetBandwidthInfoResponseMsg.AnyTimeBandwidthUsed;
            vm.Consumo.DiaRelleno = hughesData.envEnvelope.envBody.GetBandwidthInfoResponseMsg.RefillDayOfMonth;
            vm.Token = hughesData.envEnvelope.envBody.GetBandwidthInfoResponseMsg.TokenBandwidthAvailable;
          });
          terminalFactory.hughesFapStatus(obj).then(function (hughesData) {
            
            if (hughesData.envEnvelope.envBody.GetFAPStatusResponseMsg.FAPStatus ===-1) {
              vm.FapStatus = "Not Activated";
            } else if (hughesData.envEnvelope.envBody.GetFAPStatusResponseMsg.FAPStatus ===0) {
              vm.FapStatus = "Unthrottled";
            } else if (hughesData.envEnvelope.envBody.GetFAPStatusResponseMsg.FAPStatus ===1) {
              vm.FapStatus = "Throttled";
            }
          });
         
        } else if (vm.Terminal.Estatus ==="Suspendida") { //Suspendida
          obtieneIndex("Crear Terminal");
          obtieneIndex("Suspender Terminal");
          obtieneIndex("Token");
          obtieneIndex("Cambiar servicio");
          obtieneIndex("Ver status de Movimiento");
          obtieneIndex("Swap");
          obtieneIndex("Mover");
          obtieneIndex("Cancelar Movimiento");
          obtieneIndex("Activar terminal");
          obtieneIndex("Cambio de IP");
          //Nos vamos a traer el fap status y el consumo
          var obj = {};
          obj.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
          terminalFactory.hughesFapStatus(obj).then(function (hughesData) {
           
            if (hughesData.envEnvelope.envBody.GetFAPStatusResponseMsg.FAPStatus ===-1) {
              vm.FapStatus = "Not Activated";
            } else if (hughesData.envEnvelope.envBody.GetFAPStatusResponseMsg.FAPStatus ===0) {
              vm.FapStatus = "Unthrottled";
            } else if (hughesData.envEnvelope.envBody.GetFAPStatusResponseMsg.FAPStatus ===1) {
              vm.FapStatus = "Throttled";
            }
          });
        } else if (vm.Terminal.Estatus ==="Cancelada") { //Cancelada
          obtieneIndex("Suspender Terminal");
          obtieneIndex("Reactivar Terminal");
          obtieneIndex("Cancelar Terminal");
          obtieneIndex("Crear Terminal");
          obtieneIndex("Cambiar servicio");
          obtieneIndex("Ver status de Movimiento");
          obtieneIndex("Cancelar Movimiento");
          obtieneIndex("Activar terminal");
          obtieneIndex("Swap");
          obtieneIndex("Mover");
          obtieneIndex("Token");
          obtieneIndex("Cambio de IP");
        }
      });
    }

    function obtieneIndex(cadena) {
      var indexAux = 0;
      vm.Comandos.forEach(function (item, index) {
        if (item.Nombre ===cadena) {
          indexAux = index;
        }
      });
      vm.Comandos.splice(indexAux, 1);
    }

    function aplicaComando() {
     
      var parametros = {};

      terminalFactory.GetValidaEjecucionComando(vm.Comando.IdComando).then(function (data) {
        if (data.GetValidaEjecucionComandoResult ===0) {
          ngNotify.set('¡Atención! No tiene permisos para aplicar este comando', 'warn');
          return;
        } else {

          if (vm.Comando.IdComando === 1) //Crear
          {
            var parametros = {};
            //Validamos el servicio para obtener el beam y traer las redes y validar si hay subredes para esa
            var parametrosPre = {};
            parametrosPre.servicio = vm.Terminal.Servicio;
            parametrosPre.latitud = vm.Terminal.Latitud;
            parametrosPre.longitud = vm.Terminal.Longitud;
            terminalFactory.hughesValidaServicio(parametrosPre).then(function (hughesDataSPQPre) {
              var parametrosAux = {};
              var cont = 0;
              parametrosAux.IdServicio = vm.Terminal.IdServicio;
              parametrosAux.Beam = hughesDataSPQPre.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.BeamID;
              terminalFactory.obtienePoolsServicioBeam(parametrosAux).then(function (hughesDataPre) {
                vm.SubRed = hughesDataPre.GetObtienePoolsBeamServicioResult;
              });
            });
            //Si hay subredes para el beam y el servicio lo hacemos con eso
            if (vm.SubRed.length > 0)
            {             
              terminalFactory.getSuscriptorById(vm.Terminal.IdSuscriptor).then(function (data) {
                var suscriptor = data.GetSuscriptorResult;
                var obj = {};
                //Crea la terminal en la plataforma de Hughes
                terminalFactory.getSequenceId().then(function (Sequence) {
                  obj.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
                  obj.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
                  obj.nombre = suscriptor.Nombre;
                  obj.apellido = suscriptor.Apellido;
                  obj.direccion = suscriptor.Calle + ' ' + suscriptor.Numero;
                  obj.ciudad = suscriptor.Ciudad;
                  //Obtiene el código del estado para hughes
                  terminalFactory.getEstadoById(suscriptor.IdEstado).then(function (data) {
                    obj.estado = data.GetEstadoResult.Codigo;
                    obj.codigoPostal = suscriptor.CP;
                    obj.latitud = vm.Terminal.Latitud;
                    obj.longitud = vm.Terminal.Longitud;
                    obj.telefono = suscriptor.Telefono;
                    obj.email = suscriptor.Email;
                    obj.servicio = vm.Terminal.Servicio;
                    //Validamos las coordenadas para traernos el satelite y el beam
                    var parametros = {};
                    parametros.servicio = vm.Terminal.Servicio;
                    parametros.latitud = vm.Terminal.Latitud;
                    parametros.longitud = vm.Terminal.Longitud;
                    terminalFactory.hughesValidaServicio(parametros).then(function (hughesDataSPQ) {
                     
                      vm.BeamID = hughesDataSPQ.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.BeamID;
                      vm.SatelliteID = hughesDataSPQ.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.SatellitedID;
                      vm.Polarization = hughesDataSPQ.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.Polarization;
                      //Los nuevos de IP
                      obj.IPv4SubnetMask = vm.SubRed[0].MascaraRed4Terminal;
                      obj.VlanID = 1;
                      obj.MappedIPv4Subnet = vm.SubRed[0].IPTerminal;
                      obj.IPv6PrefixLen = vm.SubRed[0].MascaraRed6Terminal;
                      obj.MappedIPv6Prefix = vm.SubRed[0].IPv6Terminal;//vm.SubRed.MascaraIPv6;
                      obj.MappedIPv4Prefix = vm.SubRed[0].MascaraRed4Terminal;

                      terminalFactory.hughesCrearTerminalIP(obj).then(function (hughesData) {
                        
                        var Obj2 = {};
                        Obj2.objMovimiento = {};
                        Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                        Obj2.objMovimiento.IdComando = 1; //Hardcodeado a la tabla de Comando
                        Obj2.objMovimiento.IdUsuario = 0;
                        Obj2.objMovimiento.IdTicket = 0;
                        Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                        vm.fechaAuxiliar = new Date();
                        Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                        Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                        Obj2.objMovimiento.IdOrigen = 2; //Hardcodeado a la tabla de OrigenMovimiento
                        Obj2.objMovimiento.Detalle1 = '';
                        Obj2.objMovimiento.Detalle2 = '';
                        if (hughesData.StandardResponse.Code != '5') {
                          ngNotify.set('Error al crear la terminal en la plataforma.', 'error');
                          //Ponemos el movimiento como no exitoso
                          Obj2.objMovimiento.Exitoso = 0;
                        } else {
                          //Actualiza el estatus en la base en caso de que haya sido exitoso
                          var Obj3 = {};
                          Obj3.objTerminal = {};
                          Obj3.objTerminal.SAN = vm.Terminal.SAN;
                          Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
                          Obj3.objTerminal.IdServicio = vm.Terminal.IdServicio;
                          Obj3.objTerminal.Latitud = vm.Terminal.Latitud;
                          Obj3.objTerminal.Longitud = vm.Terminal.Longitud;
                          Obj3.objTerminal.Estatus = 'Pendiente';
                          Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
                          Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
                          Obj3.objTerminal.ESN = vm.Terminal.ESN;
                          Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
                          terminalFactory.updateTerminal(Obj3).then(function (data) {
                            ngNotify.set('La terminal se ha creado correctamente', 'success');
                          });

                          //Ponemos el movimiento como exitoso
                          Obj2.objMovimiento.Exitoso = 1;

                          //Objeto para actualizar el SatelliteId y BeamId a la terminal
                          var Obj3 = {};
                          Obj3.objTerminal = {};
                          Obj3.objTerminal.SatellitedID = vm.SatelliteID;
                          Obj3.objTerminal.BeamID = vm.BeamID;
                          Obj3.objTerminal.Polarization = vm.Polarization;
                          Obj3.objTerminal.SAN = vm.Terminal.SAN;
                          Obj3.objTerminal.Clv_IP = vm.SubRed[0].Clv_IP;
                          Obj3.objTerminal.Clv_IP6 = vm.SubRed[0].Clv_IP6;

                          //Actualizamos información adicional de la terminal
                          terminalFactory.agregaInfoTerminal(Obj3).then(function (obj) {});
                        }
                        terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {

                        });
                      });
                    });
                  });
                });
              });
            }
            else{
             
              terminalFactory.getSuscriptorById(vm.Terminal.IdSuscriptor).then(function (data) {
                var suscriptor = data.GetSuscriptorResult;
                var obj = {};
                //Crea la terminal en la plataforma de Hughes
                terminalFactory.getSequenceId().then(function (Sequence) {
                  obj.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
                  obj.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
                  obj.nombre = suscriptor.Nombre;
                  obj.apellido = suscriptor.Apellido;
                  obj.direccion = suscriptor.Calle + ' ' + suscriptor.Numero;
                  obj.ciudad = suscriptor.Ciudad;
                  //Obtiene el código del estado para hughes
                  terminalFactory.getEstadoById(suscriptor.IdEstado).then(function (data) {
                    obj.estado = data.GetEstadoResult.Codigo;
                    obj.codigoPostal = suscriptor.CP;
                    obj.latitud = vm.Terminal.Latitud;
                    obj.longitud = vm.Terminal.Longitud;
                    obj.telefono = suscriptor.Telefono;
                    obj.email = suscriptor.Email;
                    obj.servicio = vm.Terminal.Servicio;
                    //Validamos las coordenadas para traernos el satelite y el beam
                    var parametros = {};
                    parametros.servicio = vm.Terminal.Servicio;
                    parametros.latitud = vm.Terminal.Latitud;
                    parametros.longitud = vm.Terminal.Longitud;
                    terminalFactory.hughesValidaServicio(parametros).then(function (hughesDataSPQ) {
                      
                      vm.BeamID = hughesDataSPQ.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.BeamID;
                      vm.SatelliteID = hughesDataSPQ.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.SatellitedID;
                      vm.Polarization = hughesDataSPQ.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.Polarization;
                      terminalFactory.hughesCrearTerminal(obj).then(function (hughesData) {
                      
                        var Obj2 = {};
                        Obj2.objMovimiento = {};
                        Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                        Obj2.objMovimiento.IdComando = 1; //Hardcodeado a la tabla de Comando
                        Obj2.objMovimiento.IdUsuario = 0;
                        Obj2.objMovimiento.IdTicket = 0;
                        Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                        vm.fechaAuxiliar = new Date();
                        Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                        Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                        Obj2.objMovimiento.IdOrigen = 2; //Hardcodeado a la tabla de OrigenMovimiento
                        Obj2.objMovimiento.Detalle1 = '';
                        Obj2.objMovimiento.Detalle2 = '';
                        if (hughesData.StandardResponse.Code != '5') {
                          ngNotify.set('Error al crear la terminal en la plataforma.', 'error');
                          //Ponemos el movimiento como no exitoso
                          Obj2.objMovimiento.Exitoso = 0;
                        } else {
                          //Actualiza el estatus en la base en caso de que haya sido exitoso
                          var Obj3 = {};
                          Obj3.objTerminal = {};
                          Obj3.objTerminal.SAN = vm.Terminal.SAN;
                          Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
                          Obj3.objTerminal.IdServicio = vm.Terminal.IdServicio;
                          Obj3.objTerminal.Latitud = vm.Terminal.Latitud;
                          Obj3.objTerminal.Longitud = vm.Terminal.Longitud;
                          Obj3.objTerminal.Estatus = 'Pendiente';
                          Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
                          Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
                          Obj3.objTerminal.ESN = vm.Terminal.ESN;
                          Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
                          terminalFactory.updateTerminal(Obj3).then(function (data) {
                            ngNotify.set('La terminal se ha creado correctamente', 'success');
                          });

                          //Ponemos el movimiento como exitoso
                          Obj2.objMovimiento.Exitoso = 1;

                          //Objeto para actualizar el SatelliteId y BeamId a la terminal
                          var Obj3 = {};
                          Obj3.objTerminal = {};
                          Obj3.objTerminal.SatellitedID = vm.SatelliteID;
                          Obj3.objTerminal.BeamID = vm.BeamID;
                          Obj3.objTerminal.Polarization = vm.Polarization;
                          Obj3.objTerminal.SAN = vm.Terminal.SAN;

                          //Actualizamos información adicional de la terminal
                          terminalFactory.agregaInfoTerminal(Obj3).then(function (obj) {});
                        }
                        terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {

                        });
                      });
                    });
                  });
                });
              });
            }
              
          } else if (vm.Comando.IdComando === 2) //Suspender terminal
          {
            var parametros = {};
            terminalFactory.getSequenceId().then(function (Sequence) {
              parametros.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
              parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
              parametros.status = 2; //Status hardcodeado de hughes
              terminalFactory.hughesCambiarStatusServicio(parametros).then(function (hughesData) {
               
                if (hughesData.StandardResponse.Code != 5) {
                  //Guarda el movimiento sin OrderID
                  var Obj2 = {};
                  Obj2.objMovimiento = {};
                  Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                  Obj2.objMovimiento.IdComando = 2; //Hardcodeado a la tabla de Comando
                  Obj2.objMovimiento.IdUsuario = 0;
                  Obj2.objMovimiento.IdTicket = 0;
                  Obj2.objMovimiento.OrderId = 0;
                  vm.fechaAuxiliar = new Date();
                  Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                  Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                  Obj2.objMovimiento.IdOrigen = 2; //Hardcodeado a la tabla de OrigenMovimiento
                  Obj2.objMovimiento.Detalle1 = '';
                  Obj2.objMovimiento.Detalle2 = '';
                  Obj2.objMovimiento.Exitoso = 0;
                  terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {});
                  ngNotify.set('Error al suspender la terminal. Consulte el movimiento para más información', 'error');
                } else {
                  //Guarda el movimiento con OrderId
                  var Obj2 = {};
                  Obj2.objMovimiento = {};
                  Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                  Obj2.objMovimiento.IdComando = 2; //Hardcodeado a la tabla de Comando
                  Obj2.objMovimiento.IdUsuario = 0;
                  Obj2.objMovimiento.IdTicket = 0;
                  Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                  vm.fechaAuxiliar = new Date();
                  Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                  Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                  Obj2.objMovimiento.IdOrigen = 2; //Hardcodeado a la tabla de OrigenMovimiento
                  Obj2.objMovimiento.Detalle1 = '';
                  Obj2.objMovimiento.Detalle2 = '';
                  Obj2.objMovimiento.Exitoso = 1;
                  terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {

                    var Obj3 = {};
                    Obj3.objTerminal = {};
                    Obj3.objTerminal.SAN = vm.Terminal.SAN;
                    Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
                    Obj3.objTerminal.IdServicio = vm.Terminal.IdServicio;
                    Obj3.objTerminal.Latitud = vm.Terminal.Latitud;
                    Obj3.objTerminal.Longitud = vm.Terminal.Longitud;
                    Obj3.objTerminal.Estatus = 'Suspendida';
                    Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
                    Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
                    Obj3.objTerminal.ESN = vm.Terminal.ESN;
                    Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
                    terminalFactory.updateTerminal(Obj3).then(function (data) {
                      ngNotify.set('La terminal se ha suspendido correctamente', 'success');
                    });

                  });
                  //Actualiza el estatus en la base en caso de que haya sido exitoso

                }
              });
            });
          } else if (vm.Comando.IdComando === 3) //Reactivar
          {
            var parametros = {};
            terminalFactory.getSequenceId().then(function (Sequence) {
              parametros.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
              parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
              parametros.status = 3; //Status hardcodeado de hughes
              terminalFactory.hughesCambiarStatusServicio(parametros).then(function (hughesData) {
               
                if (hughesData.StandardResponse.Code != 5) {
                  //Guarda el movimiento sin OrderID
                  var Obj2 = {};
                  Obj2.objMovimiento = {};
                  Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                  Obj2.objMovimiento.IdComando = 3; //Hardcodeado a la tabla de Comando
                  Obj2.objMovimiento.IdUsuario = 0;
                  Obj2.objMovimiento.IdTicket = 0;
                  Obj2.objMovimiento.OrderId = 0;
                  vm.fechaAuxiliar = new Date();
                  Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                  Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                  Obj2.objMovimiento.IdOrigen = 2; //Hardcodeado a la tabla de OrigenMovimiento
                  Obj2.objMovimiento.Detalle1 = '';
                  Obj2.objMovimiento.Detalle2 = '';
                  Obj2.objMovimiento.Exitoso = 0;
                  terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {});
                  ngNotify.set('Error al reactivar la terminal. Consulte el movimiento para más información', 'error');
                } else {
                  //Guarda el movimiento con OrderId
                  var Obj2 = {};
                  Obj2.objMovimiento = {};
                  Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                  Obj2.objMovimiento.IdComando = 3; //Hardcodeado a la tabla de Comando
                  Obj2.objMovimiento.IdUsuario = 0;
                  Obj2.objMovimiento.IdTicket = 0;
                  Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                  vm.fechaAuxiliar = new Date();
                  Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                  Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                  Obj2.objMovimiento.IdOrigen = 2; //Hardcodeado a la tabla de OrigenMovimiento
                  Obj2.objMovimiento.Detalle1 = '';
                  Obj2.objMovimiento.Detalle2 = '';
                  Obj2.objMovimiento.Exitoso = 1;
                  terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {

                    //Actualiza el estatus en la base en caso de que haya sido exitoso
                    var Obj3 = {};
                    Obj3.objTerminal = {};
                    Obj3.objTerminal.SAN = vm.Terminal.SAN;
                    Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
                    Obj3.objTerminal.IdServicio = vm.Terminal.IdServicio;
                    Obj3.objTerminal.Latitud = vm.Terminal.Latitud;
                    Obj3.objTerminal.Longitud = vm.Terminal.Longitud;
                    Obj3.objTerminal.Estatus = 'Activa';
                    Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
                    Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
                    Obj3.objTerminal.ESN = vm.Terminal.ESN;
                    Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
                    terminalFactory.updateTerminal(Obj3).then(function (data) {
                      ngNotify.set('La terminal se ha reactivado correctamente', 'success');
                    });


                  });

                }
              });
            });
          } else if (vm.Comando.IdComando === 4) //Cancelar
          {
            var parametros = {};
						terminalFactory.getSequenceId().then(function (Sequence) {
							parametros.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;          
							parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);             
							parametros.status = 1;          
							terminalFactory.hughesCambiarStatusServicio(parametros).then(function (hughesData) {              
								if (hughesData.StandardResponse.Code != 5) {
									//Guarda el movimiento sin OrderID
									var Obj2 = {};
									Obj2.objMovimiento = {};
									Obj2.objMovimiento.SAN = vm.Terminal.SAN;
									Obj2.objMovimiento.IdComando = 4;//Hardcodeado a la tabla de Comando
									Obj2.objMovimiento.IdUsuario = 0;
									Obj2.objMovimiento.IdTicket = 0;
									Obj2.objMovimiento.OrderId = 0;
									vm.fechaAuxiliar = new Date();
									Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
									Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
									Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
									Obj2.objMovimiento.Detalle1 = '';
									Obj2.objMovimiento.Detalle2 = '';
									Obj2.objMovimiento.Exitoso = 0;
									terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
									});
									ngNotify.set('Error al cancelar la terminal. Consulte el movimiento para más información', 'error');
								}
								else {
									//Guarda el movimiento con OrderId
									var Obj2 = {};
									Obj2.objMovimiento = {};
									Obj2.objMovimiento.SAN = vm.Terminal.SAN;
									Obj2.objMovimiento.IdComando = 4;//Hardcodeado a la tabla de Comando
									Obj2.objMovimiento.IdUsuario = 0;
									Obj2.objMovimiento.IdTicket = 0;
									Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
									vm.fechaAuxiliar = new Date();
									Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
									Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
									Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
									Obj2.objMovimiento.Detalle1 = '';
									Obj2.objMovimiento.Detalle2 = '';
									Obj2.objMovimiento.Exitoso = 1;
									terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
									});
									//Actualiza el estatus en la base en caso de que haya sido exitoso
									var Obj3 = {};
									Obj3.objTerminal = {};
									Obj3.objTerminal.SAN = vm.Terminal.SAN;
									Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
									Obj3.objTerminal.IdServicio = vm.Terminal.IdServicio;
									Obj3.objTerminal.Latitud = vm.Terminal.Latitud;
									Obj3.objTerminal.Longitud = vm.Terminal.Longitud;
									Obj3.objTerminal.Estatus = 'Cancelada';
									Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
									Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
									Obj3.objTerminal.ESN = vm.Terminal.ESN;
									Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
									terminalFactory.updateTerminal(Obj3).then(function (data) {
										ngNotify.set('La terminal se ha cancelado correctamente', 'success');
									});
								}
							});
						});
					}
					else if (vm.Comando.IdComando === 5)//token
					{
            var parametros = {};
						parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
						parametros.cantidad = vm.cantidadToken;
						terminalFactory.hughesToken(parametros).then(function (hughesData) {						
							//Guarda el movimiento
							var Obj2 = {};
							Obj2.objMovimiento = {};
							Obj2.objMovimiento.SAN = vm.Terminal.SAN;
							Obj2.objMovimiento.IdComando = 5;//Hardcodeado a la tabla de Comando
							Obj2.objMovimiento.IdUsuario = 0;
							Obj2.objMovimiento.IdTicket = 0;
							Obj2.objMovimiento.OrderId = 0;
							vm.fechaAuxiliar = new Date();
							Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
							Obj2.objMovimiento.Mensaje = hughesData.envEnvelope.envBody.ManageFAPTokenResponseMsg.MessageText;
							Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
							Obj2.objMovimiento.Detalle1 = vm.cantidadToken;
							Obj2.objMovimiento.Detalle2 = '';
							//Vamos a procesar dependiendo del status obtenido de hughes
							if (hughesData.envEnvelope.envBody.ManageFAPTokenResponseMsg.Status == "FAILED") {
								ngNotify.set('Error al aplicar Token. Consulte el detalle del movimiento para más información', 'error');
								//Ponemos el movimiento como no exitoso
								Obj2.objMovimiento.Exitoso = 0;
							}
							else {
								ngNotify.set('Token aplicado correctamente', 'success');
								//Ponemos el movimiento como  exitoso
								Obj2.objMovimiento.Exitoso = 1;
							}
							terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
							});
						});
					}
					else if (vm.Comando.IdComando === 6)//Cambiar servicio
					{
            var parametrosAux = {};
            var parametros = {};
            var cont = 0;
            parametrosAux.IdServicio = vm.Servicio.IdServicio;
            parametrosAux.Beam = vm.Terminal.BeamID;
            terminalFactory.obtienePoolsServicioBeam(parametrosAux).then(function (hughesData) {
              vm.SubRed = hughesData.GetObtienePoolsBeamServicioResult;
              cont = hughesData.GetObtienePoolsBeamServicioResult.length;
           
  						if (vm.Servicio.Nombre.substr(0,3) == vm.Terminal.Servicio.substr(0,3))
  						{
                //Validamos que haya  un pool para ese servicio, sino lo mandamos normal
                if (vm.SubRed.length > 0)
                {
                
                  //vm.SubRed = vm.SubRed[0];
    							terminalFactory.getSequenceId().then(function (Sequence) {
    								parametros.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
    								terminalFactory.getSuscriptorById(vm.Terminal.IdSuscriptor).then(function (data) {
    									var suscriptor = data.GetSuscriptorResult;
    									parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
    								
    									parametros.email = suscriptor.Email;
    									parametros.servicio = vm.Servicio.Nombre;
                      //Los nuevos de IP
                      parametros.IPv4SubnetMask = vm.SubRed[0].MascaraRed4Terminal;
                      parametros.VlanID = 1;
                      parametros.MappedIPv4Subnet = vm.SubRed[0].IPTerminal;
                      parametros.IPv6PrefixLen = vm.SubRed[0].MascaraRed6Terminal;
                      parametros.MappedIPv6Prefix = vm.SubRed[0].IPv6Terminal;//vm.SubRed.MascaraIPv6;
                      parametros.MappedIPv4Prefix = vm.SubRed[0].MascaraRed4Terminal;
                      
    									terminalFactory.hughesCambioServicioIP(parametros).then(function (hughesData) {
    									
    										//Vamos a procesar dependiendo del status obtenido de hughes
    										if (hughesData.StandardResponse.OrderId == 0) {
    											//Guarda el movimiento con OrderId
    											var Obj2 = {};
    											Obj2.objMovimiento = {};
    											Obj2.objMovimiento.SAN = vm.Terminal.SAN;
    											Obj2.objMovimiento.IdComando = 6;//Hardcodeado a la tabla de Comando
    											Obj2.objMovimiento.IdUsuario = 0;
    											Obj2.objMovimiento.IdTicket = 0;
    											Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
    											vm.fechaAuxiliar = new Date();
    											Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
    											Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
    											Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
    											Obj2.objMovimiento.Detalle1 = vm.Terminal.Servicio;
    											Obj2.objMovimiento.Detalle2 = vm.Servicio.Nombre;
    											Obj2.objMovimiento.Exitoso = 0;
    											terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
    											});
    											ngNotify.set('Error al realizar cambio de servicio. Consulte el detalle del movimiento para más información', 'error');
    										}
    										else {
    											//Guarda el movimiento con OrderId
    											var Obj2 = {};
    											Obj2.objMovimiento = {};
    											Obj2.objMovimiento.SAN = vm.Terminal.SAN;
    											Obj2.objMovimiento.IdComando = 6;//Hardcodeado a la tabla de Comando
    											Obj2.objMovimiento.IdUsuario = 0;
    											Obj2.objMovimiento.IdTicket = 0;
    											Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
    											vm.fechaAuxiliar = new Date();
    											Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
    											Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
    											Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
    											Obj2.objMovimiento.Detalle1 = vm.Terminal.Servicio;
    											Obj2.objMovimiento.Detalle2 = vm.Servicio.Nombre;
    											Obj2.objMovimiento.Exitoso = 1;
    											terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
    											});
    											//Actualiza el servicio en la base en caso de que haya realizado con exito
    											var Obj3 = {};
    											Obj3.objTerminal = {};
    											Obj3.objTerminal.SAN = vm.Terminal.SAN;
    											Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
    											Obj3.objTerminal.IdServicio = vm.Servicio.IdServicio;
    											Obj3.objTerminal.Latitud = vm.Terminal.Latitud;
    											Obj3.objTerminal.Longitud = vm.Terminal.Longitud;
    											Obj3.objTerminal.Estatus = 'Activa';
    											Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
    											Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
    											Obj3.objTerminal.ESN = vm.Terminal.ESN;
    											Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
    											terminalFactory.updateTerminal(Obj3).then(function (data) {
                            var parametrosAux = {};
                            parametrosAux.Clv_IP = vm.SubRed[0].Clv_IP;
                            parametrosAux.Clv_IP6 = vm.SubRed[0].Clv_IP6;
                            parametrosAux.SAN = vm.Terminal.SAN;
                            terminalFactory.GetActualizaPoolTerminal(parametrosAux).then(function (data) {
                              ngNotify.set('Cambio de servicio realizado correctamente', 'success');
                            });
    											});
    										}
    									});
    								});
    							});
                }
                else{
                
                  terminalFactory.getSequenceId().then(function (Sequence) {
                    parametros.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
                    terminalFactory.getSuscriptorById(vm.Terminal.IdSuscriptor).then(function (data) {
                      var suscriptor = data.GetSuscriptorResult;
                      parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);                     
                      parametros.email = suscriptor.Email;
                      parametros.servicio = vm.Servicio.Nombre;
                      terminalFactory.hughesCambioServicio(parametros).then(function (hughesData) {
                       
                        //Vamos a procesar dependiendo del status obtenido de hughes
                        if (hughesData.StandardResponse.OrderId == 0) {
                          //Guarda el movimiento con OrderId
                          var Obj2 = {};
                          Obj2.objMovimiento = {};
                          Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                          Obj2.objMovimiento.IdComando = 6;//Hardcodeado a la tabla de Comando
                          Obj2.objMovimiento.IdUsuario = 0;
                          Obj2.objMovimiento.IdTicket = 0;
                          Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                          vm.fechaAuxiliar = new Date();
                          Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                          Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                          Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
                          Obj2.objMovimiento.Detalle1 = vm.Terminal.Servicio;
                          Obj2.objMovimiento.Detalle2 = vm.Servicio.Nombre;
                          Obj2.objMovimiento.Exitoso = 0;
                          terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
                          });
                          ngNotify.set('Error al realizar cambio de servicio. Consulte el detalle del movimiento para más información', 'error');
                        }
                        else {
                          //Guarda el movimiento con OrderId
                          var Obj2 = {};
                          Obj2.objMovimiento = {};
                          Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                          Obj2.objMovimiento.IdComando = 6;//Hardcodeado a la tabla de Comando
                          Obj2.objMovimiento.IdUsuario = 0;
                          Obj2.objMovimiento.IdTicket = 0;
                          Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                          vm.fechaAuxiliar = new Date();
                          Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                          Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                          Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
                          Obj2.objMovimiento.Detalle1 = vm.Terminal.Servicio;
                          Obj2.objMovimiento.Detalle2 = vm.Servicio.Nombre;
                          Obj2.objMovimiento.Exitoso = 1;
                          terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
                          });
                          //Actualiza el servicio en la base en caso de que haya realizado con exito
                          var Obj3 = {};
                          Obj3.objTerminal = {};
                          Obj3.objTerminal.SAN = vm.Terminal.SAN;
                          Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
                          Obj3.objTerminal.IdServicio = vm.Servicio.IdServicio;
                          Obj3.objTerminal.Latitud = vm.Terminal.Latitud;
                          Obj3.objTerminal.Longitud = vm.Terminal.Longitud;
                          Obj3.objTerminal.Estatus = 'Activa';
                          Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
                          Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
                          Obj3.objTerminal.ESN = vm.Terminal.ESN;
                          Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
                          terminalFactory.updateTerminal(Obj3).then(function (data) {
                            ngNotify.set('Cambio de servicio realizado correctamente', 'success');
                          });

                        }
                      });
                    });
                  });
                }
  						}
  						else{
  							ngNotify.set('No es posible hacer el cambio a un servicio de otro satélite', 'warn');
              }
            });
					}
					else if (vm.Comando.IdComando === 9)//Activar
					{
						terminalFactory.getSuscriptorById(vm.Terminal.IdSuscriptor).then(function (data) {
							var suscriptor = data.GetSuscriptorResult;
							parametros.telefono = suscriptor.Telefono.substring(6, 4);
							parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
							parametros.ESN = vm.Terminal.ESN;
							terminalFactory.hughesActivarTerminal(parametros).then(function (hughesData) {
						
								//Guarda el movimiento
								var Obj2 = {};
								Obj2.objMovimiento = {};
								Obj2.objMovimiento.SAN = vm.Terminal.SAN;
								Obj2.objMovimiento.IdComando = 9;//Hardcodeado a la tabla de Comando
								Obj2.objMovimiento.IdUsuario = 0;
								Obj2.objMovimiento.IdTicket = 0;
								Obj2.objMovimiento.OrderId = 0;
								vm.fechaAuxiliar = new Date();
								Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
								Obj2.objMovimiento.Mensaje = hughesData.envEnvelope.envBody.cmcActivationResponseMsg.MessageText;
								Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
								Obj2.objMovimiento.Detalle1 = '';
								Obj2.objMovimiento.Detalle2 = '';
								terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
								});
								//Vamos a procesar dependiendo del status obtenido de hughes
								if (hughesData.envEnvelope.envBody.cmcActivationResponseMsg.Status == "FAILED") {
									ngNotify.set('Error al activar la terminal. Consulte el detalle del movimiento para más información', 'error');
								}
								else {
									//Actualiza el estatus en la base en caso de que haya activado en Hughes
									var Obj3 = {};
									Obj3.objTerminal = {};
									Obj3.objTerminal.SAN = vm.Terminal.SAN;
									Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
									Obj3.objTerminal.IdServicio = vm.Terminal.IdServicio;
									Obj3.objTerminal.Latitud = vm.Terminal.Latitud;
									Obj3.objTerminal.Longitud = vm.Terminal.Longitud;
									Obj3.objTerminal.Estatus = 'Activa';
									Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
									Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
									Obj3.objTerminal.ESN = vm.Terminal.ESN;
									Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
									terminalFactory.updateTerminal(Obj3).then(function (data) {
										ngNotify.set('La terminal se ha activado correctamente', 'success');
									});


                }
              });
            });
          } else if (vm.Comando.IdComando === 10) //Swap
          {
            var parametros = {};
            parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
            terminalFactory.hughesSwap(parametros).then(function (hughesData) {           
              //Guarda el movimiento
              var Obj2 = {};
              Obj2.objMovimiento = {};
              Obj2.objMovimiento.SAN = vm.Terminal.SAN;
              Obj2.objMovimiento.IdComando = 10; //Hardcodeado a la tabla de Comando
              Obj2.objMovimiento.IdUsuario = 0;
              Obj2.objMovimiento.IdTicket = 0;
              Obj2.objMovimiento.OrderId = 0;
              vm.fechaAuxiliar = new Date();
              Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
              Obj2.objMovimiento.Mensaje = hughesData.responseMsg;
              Obj2.objMovimiento.IdOrigen = 2; //Hardcodeado a la tabla de OrigenMovimiento
              Obj2.objMovimiento.Detalle1 = "";
              Obj2.objMovimiento.Detalle2 = '';
              //Vamos a procesar dependiendo del status obtenido de hughes
              if (hughesData.status ==="false") {
                ngNotify.set('Error al aplicar comando Swap. Consulte el detalle del movimiento para más información', 'error');
                //Ponemos el movimiento como no exitoso
                Obj2.objMovimiento.Exitoso = 0;
              } else {
                ngNotify.set('Swap aplicado correctamente', 'success');
                //Ponemos el movimiento como  exitoso
                Obj2.objMovimiento.Exitoso = 1;
              }
              terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {});
            });
          }
          else if (vm.Comando.IdComando === 11) //Move
          {
            var parametros = {};
            if (vm.BeamIDNuevo != '' && vm.BeamIDNuevo != null) {
              parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
             
              terminalFactory.hughesCambioCoordenadas(parametros).then(function (hughesData) {               
                var Obj2 = {};
                Obj2.objMovimiento = {};
                Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                Obj2.objMovimiento.IdComando = 11; //Hardcodeado a la tabla de Comando
                Obj2.objMovimiento.IdUsuario = 0;
                Obj2.objMovimiento.IdTicket = 0;
                Obj2.objMovimiento.OrderId = 0;
                vm.fechaAuxiliar = new Date();
                Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                Obj2.objMovimiento.Mensaje = hughesData.message;
                Obj2.objMovimiento.IdOrigen = 2; //Hardcodeado a la tabla de OrigenMovimiento
                Obj2.objMovimiento.Detalle1 = vm.Terminal.Latitud + '/' + vm.Terminal.Longitud;
                Obj2.objMovimiento.Detalle2 = vm.LatitudNueva + '/' + vm.LongitudNueva;
                //Vamos a procesar dependiendo del status obtenido de hughes
                if (hughesData.message != "OK") {
                  ngNotify.set('Error al aplicar comando Move. Consulte el detalle del movimiento para más información', 'error');
                  //Ponemos el movimiento como no exitoso
                  Obj2.objMovimiento.Exitoso = 0;
                } else {
                  //Ponemos el movimiento como  exitoso
                  Obj2.objMovimiento.Exitoso = 1;
                  var Obj4 = {};
                  Obj4.objTerminal = {};
                  Obj4.objTerminal.SatellitedID = vm.SatelliteIDNuevo;
                  Obj4.objTerminal.BeamID = vm.BeamIDNuevo;
                  Obj4.objTerminal.Polarization = vm.PolarizationNuevo;
                  Obj4.objTerminal.SAN = vm.Terminal.SAN;
                  //Actualizamos información adicional de la terminal
                
                  terminalFactory.agregaInfoTerminal(Obj4).then(function (obj) {
                    //Actualiza el estatus en la base en caso de que haya sido exitoso
                    var Obj3 = {};
                    Obj3.objTerminal = {};
                    Obj3.objTerminal.SAN = vm.Terminal.SAN;
                    Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
                    Obj3.objTerminal.IdServicio = vm.Terminal.IdServicio;
                    Obj3.objTerminal.Latitud = vm.LatitudNueva;
                    Obj3.objTerminal.Longitud = vm.LongitudNueva;
                    Obj3.objTerminal.Estatus = vm.Terminal.Estatus;
                    Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
                    Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
                    Obj3.objTerminal.ESN = vm.Terminal.ESN;
                    Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
                    terminalFactory.updateTerminal(Obj3).then(function (data) {
                      ngNotify.set('Move aplicado correctamente', 'success');
                    });
                  });
                }
                terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {});
              });
            } else {
              ngNotify.set('Es necesario validar las nuevas coordenadas para aplicar el comando Move', 'info');
            }
          }
          else if (vm.Comando.IdComando === 12) //Cambio de IP
          {
            if(vm.SubRedesNuevas != undefined && vm.SubRedesNuevas.Error === 'Ok'){
              if(vm.Terminal.Estatus === 'Pendiente'){
                var parametros = {};
                terminalFactory.getSequenceId().then(function (Sequence) {
                  parametros.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
                  terminalFactory.getSuscriptorById(vm.Terminal.IdSuscriptor).then(function (data) {
                    var suscriptor = data.GetSuscriptorResult;
                    parametros.san = hughesGetSanCompuesto(vm.Terminal.SAN);
                    parametros.sanSolo = vm.Terminal.SAN;                  
                    parametros.email = suscriptor.Email;
                    parametros.telefono = data.GetSuscriptorResult.Telefono;
                    parametros.email = data.GetSuscriptorResult.Email;
                    parametros.latitude = vm.Terminal.Latitud;
                    parametros.longitude = vm.Terminal.Longitud;
                    //Los nuevos de IP
                    parametros.IPv4SubnetMask = vm.SubRedesNuevas.MascaraRed4Terminal;
                    parametros.VlanID = 1;
                    parametros.MappedIPv4Subnet = vm.SubRedesNuevas.IPTerminal;
                    parametros.IPv6PrefixLen = vm.SubRedesNuevas.MascaraRed6Terminal;
                    parametros.MappedIPv6Prefix = vm.SubRedesNuevas.IPv6Terminal;//vm.SubRed.MascaraIPv6;
                    parametros.MappedIPv4Prefix = vm.SubRedesNuevas.MascaraRed4Terminal;
                    
                    terminalFactory.hughesCambioIP(parametros).then(function (hughesData) {
                    
                      if (hughesData.StandardResponse.OrderId == 0) {
                        //Guarda el movimiento con OrderId
                        var Obj2 = {};
                        Obj2.objMovimiento = {};
                        Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                        Obj2.objMovimiento.IdComando = 12;//Hardcodeado a la tabla de Comando
                        Obj2.objMovimiento.IdUsuario = 0;
                        Obj2.objMovimiento.IdTicket = 0;
                        Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                        vm.fechaAuxiliar = new Date();
                        Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                        Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                        Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
                        Obj2.objMovimiento.Detalle1 = vm.DatosIP.IPTerminal + '/' + vm.DatosIP.MascaraRed4Terminal + ',' + vm.DatosIP.IPv6Terminal + '/' + vm.DatosIP.MascaraRed6Terminal;//IPs Anteriores
                        Obj2.objMovimiento.Detalle2 = vm.SubRedesNuevas.IPTerminal + '/' + vm.SubRedesNuevas.MascaraRed4Terminal + ',' + vm.SubRedesNuevas.IPv6Terminal + '/' + vm.SubRedesNuevas.MascaraRed6Terminal;
                        Obj2.objMovimiento.Exitoso = 0;
                        terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
                        });
                        ngNotify.set('Error al realizar cambio de IP. Consulte el detalle del movimiento para más información', 'error');
                      }
                      else {
                        //Guarda el movimiento con OrderId
                        var Obj2 = {};
                        Obj2.objMovimiento = {};
                        Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                        Obj2.objMovimiento.IdComando = 12;//Hardcodeado a la tabla de Comando
                        Obj2.objMovimiento.IdUsuario = 0;
                        Obj2.objMovimiento.IdTicket = 0;
                        Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                        vm.fechaAuxiliar = new Date();
                        Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                        Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                        Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
                        Obj2.objMovimiento.Detalle1 = vm.DatosIP.IPTerminal + '/' + vm.DatosIP.MascaraRed4Terminal + ',' + vm.DatosIP.IPv6Terminal + '/' + vm.DatosIP.MascaraRed6Terminal;//IPs Anteriores
                        Obj2.objMovimiento.Detalle2 = vm.SubRedesNuevas.IPTerminal + '/' + vm.SubRedesNuevas.MascaraRed4Terminal + ',' + vm.SubRedesNuevas.IPv6Terminal + '/' + vm.SubRedesNuevas.MascaraRed6Terminal;
                        Obj2.objMovimiento.Exitoso = 1;
                        terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
                        });
                        //Actualizamos los datos de la ip
                        var parametrosAux = {};
                        parametrosAux.Clv_IP = vm.SubRedesNuevas.Clv_IP;
                        parametrosAux.Clv_IP6 = vm.SubRedesNuevas.Clv_IP6;
                        parametrosAux.SAN = vm.Terminal.SAN;
                        
                        terminalFactory.GetActualizaPoolTerminal(parametrosAux).then(function (data) {                        
                          ngNotify.set('Cambio de IP realizado correctamente', 'success');
                        });
                      }
                    });
                  });
                });
              }
              else if(vm.Terminal.Estatus === 'Activa'){
                var parametros = {};
                terminalFactory.getSequenceId().then(function (Sequence) {
                  parametros.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
                  terminalFactory.getSuscriptorById(vm.Terminal.IdSuscriptor).then(function (data) {
                    var suscriptor = data.GetSuscriptorResult;
                    parametros.SAN = hughesGetSanCompuesto(vm.Terminal.SAN);
                    
                    parametros.email = suscriptor.Email;

                    //Metemos el servicio, si seleccionó la casilla de cambio de servicio
                    //Si tiene el check de cambio de servicio mandamos el nuevo cambio de servicio
                    if(vm.CambioIPServicio === true){
                      parametros.servicio = vm.Servicio.Nombre;
                    }
                    else{
                      parametros.servicio = vm.Terminal.Servicio;
                    }
                    //Los nuevos de IP
                    parametros.IPv4SubnetMask = vm.SubRedesNuevas.MascaraRed4Terminal;
                    parametros.VlanID = 1;
                    parametros.MappedIPv4Subnet = vm.SubRedesNuevas.IPTerminal;
                    parametros.IPv6PrefixLen = vm.SubRedesNuevas.MascaraRed6Terminal;
                    parametros.MappedIPv6Prefix = vm.SubRedesNuevas.IPv6Terminal;//vm.SubRed.MascaraIPv6;
                    parametros.MappedIPv4Prefix = vm.SubRedesNuevas.MascaraRed4Terminal;
                   
                    terminalFactory.hughesCambioServicioIP(parametros).then(function (hughesData) {                     
                      if (hughesData.StandardResponse.OrderId == 0) {
                        //Guarda el movimiento con OrderId
                        var Obj2 = {};
                        Obj2.objMovimiento = {};
                        Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                        Obj2.objMovimiento.IdComando = 12;//Hardcodeado a la tabla de Comando
                        Obj2.objMovimiento.IdUsuario = 0;
                        Obj2.objMovimiento.IdTicket = 0;
                        Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                        vm.fechaAuxiliar = new Date();
                        Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                        Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                        Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
                        Obj2.objMovimiento.Detalle1 = vm.DatosIP.IPTerminal + '/' + vm.DatosIP.MascaraRed4Terminal + ',' + vm.DatosIP.IPv6Terminal + '/' + vm.DatosIP.MascaraRed6Terminal;//IPs Anteriores
                        Obj2.objMovimiento.Detalle2 = vm.SubRedesNuevas.IPTerminal + '/' + vm.SubRedesNuevas.MascaraRed4Terminal + ',' + vm.SubRedesNuevas.IPv6Terminal + '/' + vm.SubRedesNuevas.MascaraRed6Terminal;
                        Obj2.objMovimiento.Exitoso = 0;
                        terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
                        });
                        ngNotify.set('Error al realizar cambio de IP. Consulte el detalle del movimiento para más información', 'error');
                      }
                      else {
                        //Guarda el movimiento con OrderId
                        var Obj2 = {};
                        Obj2.objMovimiento = {};
                        Obj2.objMovimiento.SAN = vm.Terminal.SAN;
                        Obj2.objMovimiento.IdComando = 12;//Hardcodeado a la tabla de Comando
                        Obj2.objMovimiento.IdUsuario = 0;
                        Obj2.objMovimiento.IdTicket = 0;
                        Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
                        vm.fechaAuxiliar = new Date();
                        Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                        Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                        Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
                        Obj2.objMovimiento.Detalle1 = vm.DatosIP.IPTerminal + '/' + vm.DatosIP.MascaraRed4Terminal + ',' + vm.DatosIP.IPv6Terminal + '/' + vm.DatosIP.MascaraRed6Terminal;//IPs Anteriores
                        Obj2.objMovimiento.Detalle2 = vm.SubRedesNuevas.IPTerminal + '/' + vm.SubRedesNuevas.MascaraRed4Terminal + ',' + vm.SubRedesNuevas.IPv6Terminal + '/' + vm.SubRedesNuevas.MascaraRed6Terminal;
                        Obj2.objMovimiento.Exitoso = 1;
                        terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {                         
                          if(vm.CambioIPServicio === true){
                            var Obj25 = {};
                            Obj25.objMovimiento = {};
                            Obj25.objMovimiento.SAN = vm.Terminal.SAN;
                            Obj25.objMovimiento.IdComando = 6;//Hardcodeado a la tabla de Comando
                            Obj25.objMovimiento.IdUsuario = 0;
                            Obj25.objMovimiento.IdTicket = 0;
                            Obj25.objMovimiento.OrderId = 0;
                            vm.fechaAuxiliar = new Date();
                            Obj25.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
                            Obj25.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
                            Obj25.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
                            Obj25.objMovimiento.Detalle1 = vm.Terminal.Servicio;
                            Obj25.objMovimiento.Detalle2 = vm.Servicio.Nombre;
                            Obj25.objMovimiento.Exitoso = 1;
                            terminalFactory.addMovimiento(Obj25).then(function (dataMovimiento) {                            
                              var Obj3 = {};
                              Obj3.objTerminal = {};
                              Obj3.objTerminal.SAN = vm.Terminal.SAN;
                              Obj3.objTerminal.IdSuscriptor = vm.Terminal.IdSuscriptor;
                              Obj3.objTerminal.IdServicio = vm.Servicio.IdServicio;
                              Obj3.objTerminal.Latitud = vm.Terminal.Latitud;
                              Obj3.objTerminal.Longitud = vm.Terminal.Longitud;
                              Obj3.objTerminal.Estatus = 'Activa';
                              Obj3.objTerminal.FechaAlta = vm.Terminal.FechaAlta;
                              Obj3.objTerminal.FechaSuspension = vm.Terminal.FechaSuspension;
                              Obj3.objTerminal.ESN = vm.Terminal.ESN;
                              Obj3.objTerminal.Comentarios = vm.Terminal.Comentarios;
                              terminalFactory.updateTerminal(Obj3).then(function (data) {
                               
                                var parametrosAux = {};
                                parametrosAux.Clv_IP = vm.SubRedesNuevas.Clv_IP;
                                parametrosAux.Clv_IP6 = vm.SubRedesNuevas.Clv_IP6;
                                parametrosAux.SAN = vm.Terminal.SAN;
                                terminalFactory.GetActualizaPoolTerminal(parametrosAux).then(function (data) {
                                 
                                  ngNotify.set('Cambio de IP realizado correctamente', 'success');
                                });
                              });
                            });
                          }
                          else{
                            var parametrosAux = {};
                            parametrosAux.Clv_IP = vm.SubRedesNuevas.Clv_IP;
                            parametrosAux.Clv_IP6 = vm.SubRedesNuevas.Clv_IP6;
                            parametrosAux.SAN = vm.Terminal.SAN;
                            terminalFactory.GetActualizaPoolTerminal(parametrosAux).then(function (data) {                                                           
                              ngNotify.set('Cambio de IP realizado correctamente', 'success');
                            });
                          }
                        });
                      }
                    });
                  });
                });
              }
            }
            else
            {
              ngNotify.set('Es necesario validar las IPs a cambiar existosamente', 'error');
            }
          }
        }
      });
    }

    function ok() {

    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function hughesGetSanCompuesto(obj) {
      var a = obj.toString();
      var i;
      for (i = a.length; i < 9; i++) {
        a = '0' + a;
      }      
      return globalService.getType() + a;
    };

    function BuscaLatLong() {
      var obj = {
        lat: 23.96617587126503,
        long: -101.953125
      };
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/provision/ModalGetLatLong.html',
        controller: 'ModalGetLatLongCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          datosGis: function () {
            return obj;
          }
        }
      });
    }

    $rootScope.$on('get_LatLong', function (e, detalle) {
      vm.LatitudNueva = detalle[0];
      vm.LongitudNueva = detalle[1];
    });

    function ValidarServicio() {
      if ((vm.LatitudNueva != '' && vm.LongitudNueva != '') && (vm.LatitudNueva != null && vm.LongitudNueva != null)) {
        var parametros = {};
        parametros.servicio = vm.Terminal.Servicio;
        parametros.latitud = vm.LatitudNueva;
        parametros.longitud = vm.LongitudNueva;
        //Obtiene el nombre del frupo de servicios disponibles en esa área
        terminalFactory.hughesValidaServicio(parametros).then(function (hughesData) {
        
          if (hughesData.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.AvailabilityFlag != 'true') {
            ngNotify.set('Sin área de cobertura', 'error');
          } else {
            ngNotify.set('Dentro del área de cobertura', 'success');
            vm.BeamIDNuevo = hughesData.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.BeamID;
            vm.SatelliteIDNuevo = hughesData.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.SatellitedID;
            vm.PolarizationNuevo = hughesData.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.Polarization;
          }
        });
      } else {
        ngNotify.set('Es necesario capturar las coordenadas para validar el servicio', 'info');
      }
    }

    function CambioComando(){
      
    }

    function ValidarIPs(){

      if(vm.IPv4Nueva != undefined && vm.IPv4Nueva != '' && vm.IPv6Nueva != undefined && vm.IPv6Nueva != '' && vm.MascaraRed4Nueva != undefined && vm.MascaraRed4Nueva != ''  && vm.MascaraRed6Nueva != undefined && vm.MascaraRed6Nueva != ''){
        if(vm.CambioIPServicio === true && (vm.Servicio === undefined || vm.Servicio.Nombre.substr(0,3) !== vm.Terminal.Servicio.substr(0,3))){
          ngNotify.set("Elije un servicio válido", 'warning');
        }
        else{
          var parametros = {};
          parametros.SAN = vm.Terminal.SAN;
          parametros.IPv4 = vm.IPv4Nueva;
          parametros.IPv6 = vm.IPv6Nueva;
          parametros.Mascara4 = vm.MascaraRed4Nueva;
          parametros.Mascara6 = vm.MascaraRed6Nueva;

          //Si tiene el check de cambio de servicio mandamos el nuevo cambio de servicio
          if(vm.CambioIPServicio === true){
            parametros.IdServicio = vm.Servicio.IdServicio;
          }
          else{
            parametros.IdServicio = vm.Terminal.IdServicio;
          }

       
          terminalFactory.GetValidaCambioIP(parametros).then(function (data) {          
            vm.SubRedesNuevas = data.GetValidaCambioIPResult;
            if(vm.SubRedesNuevas.Error !== 'Ok'){
              ngNotify.set(vm.SubRedesNuevas.Error, 'error');
            }
          });
        }
      }
      else{
        ngNotify.set('Es necesario llenar los datos correspondientes', 'error');
      }
    }

    var vm = this;
    vm.cancel = cancel;
    vm.ok = ok;
    initialData();
    vm.aplicaComando = aplicaComando;
    vm.BuscaLatLong = BuscaLatLong;
    vm.ValidarServicio = ValidarServicio;
    vm.CambioComando = CambioComando;
    vm.ValidarIPs = ValidarIPs;
    vm.CambioIPServicio = false;
  });
