function asignarPremios() {
    var url = "https://docs.google.com/spreadsheets/d/1FxtqO0kpIlDhytNnQdxlDrQMOHCpU6moxenXs5JfCRc/edit#gid=0";
    var hoja = SpreadsheetApp.openByUrl(url);
  
    var pestanaParticipantes = hoja.getSheetByName("Participantes");
    var participantesHoja = pestanaParticipantes.getDataRange().getValues();
    var participantes = [];
    var asesores = {};
  
    for (var j = 2; j < participantesHoja.length; j++) {
      if (participantesHoja[j][0] != "") {
        participante = {
          "boleto": participantesHoja[j][0],
          "agencia": participantesHoja[j][2],
          "asesor": participantesHoja[j][3],
          "premio": undefined
        }
  
        participantes.push(participante)
      }
    }
  
    var pestanaPremios = hoja.getSheetByName("Premios");
  
    var premiosHoja = pestanaPremios.getDataRange().getValues();
    var premios = [];
    for (var i = 1; i < premiosHoja.length; i++) {
      var premio = premiosHoja[i][0];
      var cantidad = parseInt(premiosHoja[i][1]);
      premios = [...premios, ...Array(cantidad).fill(premio)]
    }
  
    var maxInterval = Math.round(participantes.length / premios.length);
    var iteradorPremiado = -1;
    var longSpaces = [];
  
    while (premios.length > 0 && (iteradorPremiado+maxInterval) < participantes.length) {
      var proxPremiado = getRandomInt(1, maxInterval + 2);
      if(proxPremiado == maxInterval + 1){
        longSpaces.push(iteradorPremiado + 1);
      }
      var particPremiado = (iteradorPremiado + proxPremiado) >= participantes.length ? participantes.length - 1 : (iteradorPremiado + proxPremiado);
      iteradorPremiado = particPremiado;
    
      var proxPremio = getRandomInt(0, premios.length);
      participantes[particPremiado].premio = premios[proxPremio];
  
      premios.splice(proxPremio, 1);
  
    }
  
    for (var l = 0; l<premios.length; l++){
      participantes[longSpaces[l]].premio = premios[l];
    }
  
    //Logger.log(participantes);
    //Logger.log(longSpaces);
    Logger.log(premios);
    var pestanaAsignacion = hoja.getSheetByName("Asignacion");
  
    pestanaAsignacion.clearContents();
    pestanaAsignacion.appendRow(["Premio", "N° Boleta", "Agencia", "Correo Asesor"]);
  
    for (var k = 0; k < participantes.length; k++) {
      var premio = participantes[k].premio ? participantes[k].premio : "No premiado";
      pestanaAsignacion.appendRow([premio, participantes[k].boleto, participantes[k].agencia, participantes[k].asesor]);
    }
  
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }