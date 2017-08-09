// Anima Fotos AR v0.4
// Creado readaptando el script escrito por Stephen Sprinkles para PixelBump
//
// ToDo:
// mover Precomps a carpeta
//
//
//---------------------------------------------------------------
// COMP SETTINGS:

// FrameRate de la Comp
var dUserFR = 25

// Tamaño de la Comp
var dCompDim = [720, 576]

// Duración de la Comp (en segundos)
var dCompDur = 12

// Pixel Aspect ratio (usar . para decimal)
var dPAR = 1.46

// Duración del Fade In/Out (en segundos)
var dFadeDur = 1

// CONFIGURACION:

// Blur del fondo
var dBlurAmount = 9

// ZOOM: Escala inicial y final de la foto con respecto al cuadro (en porcentaje)
var dIOscale = [70, 106]

// PAN: Escala de la foto con respecto al cuadro (en porcentaje)
var dForeScale = 106

// SombraDura: Opacidad, Distancia y Suavizado de la Sombra
var dShadowConf = [35, 15, 60]

// SombraSuave: Opacidad, Distancia y Suavizado
var dShadowSoftConf = [35, 0, 90]

// IOR 
var userIOR = 0.7
//---------------------------------------------------------------

// Crear la UI
var myWin = new Window("palette", "Animamos Fotos, Señora!", undefined);

var groupOne = myWin.add("group", undefined, "GroupOne");
    groupOne.orientation = "row";
    groupOne.add("statictext", undefined, "Framerate:");
    var userFrameRateField = groupOne.add("edittext", undefined, dUserFR);
    userFrameRateField.characters = 5;
var groupTwo = myWin.add("group", undefined, "GroupTwo");
    groupTwo.add("statictext", undefined, "Dimensiones Composición:");
var groupThree = myWin.add("group", undefined, "GroupThree");
    var compWidthField = groupThree.add("edittext", undefined, dCompDim[0]);
    compWidthField.characters = 5;
    groupThree.add("statictext", undefined, "x");
    var compHeightField = groupThree.add("edittext", undefined, dCompDim[1]);
    compHeightField.characters = 5;
var groupFour = myWin.add("group", undefined, "GroupFour");
    groupFour.add("statictext", undefined, "Duracion Composición (seg):");
    var compDurationField = groupFour.add("edittext", undefined, dCompDur);
    compDurationField.characters = 5;
var groupFive = myWin.add("group", undefined, "GroupFour");
    groupFive.add("statictext", undefined, "Pixel aspect ratio:");
    var compPixAspectField = groupFive.add("edittext", undefined, dPAR);
    compPixAspectField.characters = 5;
var groupSix = myWin.add("group", undefined, "GroupFour");
    groupSix.add("statictext", undefined, "Fade In/Out (seg):");
    var myFadeInField = groupSix.add("edittext", undefined, dFadeDur);
    myFadeInField.characters = 5;
 var groupSixbis = myWin.add("group", undefined, "GroupFour");
    var myFadeInChk = groupSixbis.add("checkbox", undefined, "Activar Fade In");
        myFadeInChk.value = true;   
 var groupSixbisbis = myWin.add("group", undefined, "GroupFour");
       var myFadeOutChk = groupSixbisbis.add("checkbox", undefined, "Activar Fade Out");
    myFadeOutChk.value = false;   
var groupSeven = myWin.add("group", undefined, "GroupFour");
    groupSeven.add("statictext", undefined, "Tipo de animación");
    var myZoomAnim = groupSeven.add("radiobutton", undefined, "Zoom");
    var myPanAnim = groupSeven.add("radiobutton", undefined, "Pan");
    myZoomAnim.value = true;
var groupEight = myWin.add("group", undefined, "GroupFour");
    groupEight.add("statictext", undefined, "Tratamiento Fondo");
    var myBGvanilla = groupEight.add("radiobutton", undefined, "Ninguno");
    var myBGwhite = groupEight.add("radiobutton", undefined, "Blanqueado");
    var myBGblack = groupEight.add("radiobutton", undefined, "Ennegrecido");
    myBGvanilla.value = true;
var groupLast = myWin.add("group", undefined, "GroupSix");
    var btnGo = groupLast.add("button", undefined, "Dale!");


btnGo.onClick = function () {

  ///BEGIN UNDO GROUP///
  app.beginUndoGroup("AnimaFotos");

  ///SELECTION OF ITEMS IN PROJECT WINDOW////
  var selection = app.project.selection;

  if (selection == "") {
    alert("No has seleccionado nada de nada... Anda, selecciona unas fotillos");
  } else {

    var chooseRenderFolder = Folder.selectDialog("Elige la carpeta de exportación");
    var preCompFolder = app.project.items.addFolder("precomps-folder")


    for (var i=0; i < selection.length; i++) {

      ////BEGIN PARSE USER INPUT//////
      var userFrameRate = parseInt(userFrameRateField.text);
      var compHeight = parseInt(compHeightField.text);
      var compWidth = parseInt(compWidthField.text);
      var compDuration = parseInt(compDurationField.text);
      var compPixAspect = parseFloat(compPixAspectField.text);
      var myFadeIn = parseInt(myFadeInField.text)*userFrameRate;
      var myFrameConversion = currentFormatToTime(myFadeIn,userFrameRate);
      ////END PARSE USER INPUT//////

      //Crear Comp y Layer
      var compName = selection[i].name.substring(0,selection[i].name.length-4);
      var newComp = app.project.items.addComp(compName, compWidth, compHeight, compPixAspect, compDuration, userFrameRate);
      if (myBGwhite.value) {   
      var myBGSolid = newComp.layers.addSolid([1, 1, 1], "BG Solid", compWidth, compHeight, compPixAspect) ;
      } else if (myBGblack.value) {
      var myBGSolid = newComp.layers.addSolid([0, 0, 0], "BG Solid", compWidth, compHeight, compPixAspect) ;
      }
      var backLayer = newComp.layers.add(selection[i]) ;
      var newLayer = newComp.layers.add(selection[i]) ;
      
      if (myBGwhite.value || myBGblack.value) {   
      backLayer.opacity.setValue(80);
      }

      //      var backLayer = rawbackLayer.precompose([1],"Background",true) ;
      //     var newLayer = rawnewLayer.precompose([1],"Foreground",true) ;

      ///CALCULAMOS REESCALADO BACKGROUND

      var ourRatio = (compWidth*compPixAspect)/compHeight;
      var backRatio = selection[i].width/selection[i].height;
      if (backRatio < ourRatio) {
        var scaleBack = (((compWidth*compPixAspect)/selection[i].width)*106);
        backLayer.scale.setValue([scaleBack,scaleBack]);
      }  else {
        var scaleBack = ((compHeight/selection[i].height)*106);
        backLayer.scale.setValue([scaleBack,scaleBack]);

      }

      //FADE IN-OUT OPACIDAD
 if (myFadeInChk.value) {
      newLayer.opacity.setValueAtTime(newLayer.inPoint,0);
      newLayer.opacity.setValueAtTime((newLayer.inPoint+myFrameConversion),100);
      }
   if (myFadeOutChk.value) {
      newLayer.opacity.setValueAtTime((newLayer.outPoint-myFrameConversion),100);
      newLayer.opacity.setValueAtTime(newLayer.outPoint,0);
  }

      //CHECK TIPO DE ANIMACION
      if (myPanAnim.value) {
        //PAN

        //Calcula Ratio de Ocupacion ;-)
        var frameIOR = (compWidth*compPixAspect)*compHeight
        var maxIOR = frameIOR * userIOR

        if (backRatio < ourRatio) {

          var scaleWFore = ((compHeight/selection[i].height)*dForeScale);
          var pictureIOR = ((selection[i].width*scaleWFore)/100)*((selection[i].height*scaleWFore)/100)
          var fixIOR = 1
          if (pictureIOR > maxIOR) {
            fixIOR = maxIOR/pictureIOR
          }
          newLayer.scale.setValue([scaleWFore*fixIOR,scaleWFore*fixIOR]);

        }  else {

          var scaleHFore = (((compWidth*compPixAspect)/selection[i].width));
          var fixScaleHFore = (scaleHFore*userIOR)*100;
          newLayer.scale.setValue([fixScaleHFore,fixScaleHFore]);

        }
        var posStartSqr = ((selection[i].width*(newLayer.scale.value[0]/100))/2) //+(compWidth/6)
        var posStart = ( posStartSqr * compWidth ) / ( compWidth * compPixAspect )
        var posEnd = compWidth - posStart

        newLayer.position.setValueAtTime(newLayer.inPoint,[posStart,compHeight/2]);
        newLayer.position.setValueAtTime(newLayer.outPoint,[posEnd,compHeight/2]);


      } else {
        //ZOOM
/*        if (backRatio < ourRatio) {

          var scaleStart = (((compWidth*compPixAspect)/selection[i].width)*dIOscale[0]);
          var scaleEnd = (((compWidth*compPixAspect)/selection[i].width)*dIOscale[1]);
          newLayer.scale.setValueAtTime(newLayer.inPoint,[scaleStart,scaleStart]);
          newLayer.scale.setValueAtTime(newLayer.outPoint,[scaleEnd,scaleEnd]);
        } else {
*/          var scaleStart = ((compHeight/selection[i].height)*dIOscale[0]);
          var scaleEnd = ((compHeight/selection[i].height)*dIOscale[1]);
          newLayer.scale.setValueAtTime(newLayer.inPoint,[scaleStart,scaleStart]);
          newLayer.scale.setValueAtTime(newLayer.outPoint,[scaleEnd,scaleEnd]);
//        }

      }

      ///BLUR FONDO

      newComp.layers.precompose([2],"Background" + i,true);
      var backBlur = newComp.layer(2).property("Effects").addProperty("ADBE Fast Blur");
      backBlur.property("ADBE Fast Blur-0001").setValue(dBlurAmount);
      backBlur.property("ADBE Fast Blur-0003").setValue(true);

      ///DROP SHADOW Soft
      newComp.layers.precompose([1],"Foreground" + i,true);
      newComp.layer(1).Effects.addProperty("Drop Shadow");
      newComp.layer(1).Effects.property('Drop Shadow').property('Opacity').setValue((dShadowSoftConf[0]*255)/100);
      newComp.layer(1).Effects.property('Drop Shadow').property('Distance').setValue(dShadowSoftConf[1]);
      newComp.layer(1).Effects.property('Drop Shadow').property('Softness').setValue(dShadowSoftConf[2]);


      ///DROP SHADOW Dura
      newComp.layer(1).Effects.addProperty("Drop Shadow");
      newComp.layer(1).Effects.property('Drop Shadow 2').property('Opacity').setValue((dShadowConf[0]*255)/100);
      newComp.layer(1).Effects.property('Drop Shadow 2').property('Distance').setValue(dShadowConf[1]);
      newComp.layer(1).Effects.property('Drop Shadow 2').property('Softness').setValue(dShadowConf[2]);

      //Mover precomps a su Folder

for(var j = 1; j <= app.project.numItems; j++) {
if(app.project.item(j) instanceof CompItem && app.project.item(j).name.match(/^(Fore|Back)/)) {
app.project.item(j).parentFolder = preCompFolder;
}
}

      //ADD TO RENDER QUEUE

      //var chooseRenderFolder = Folder.selectDialog("Elige la carpeta de exportación");
      var myRenderFile = chooseRenderFolder.fsName + "/"  + compName;
      var theRender = app.project.renderQueue.items.add(newComp);

      theRender .outputModule(1).file = File(myRenderFile);

    }   // end ->  for (var i=0; i < selection.length; i++)

    }
    //myWin.close();
    app.endUndoGroup();

  }

  myWin.center();
  myWin.show();
