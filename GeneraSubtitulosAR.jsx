/*
GeneraSubtitulosAR - v0.2



Notas de Uso:
Preparar en TextEdit el texto --> para evitar problemas menú Fomato->convertir a texto sin formato
Por defecto tiene que existir un xml en el Escritorio de nombre plantilla.xml (se puede modificar en VARIABLES)
La plantilla se tendrá que modificar con cada cambio de temporada de grafismo (abrir xml en FCP y paste atributes
de la nueva pastilla, luego exportar como xml)
Abrir este script AbrirCon->ExtendScript Toolkit y ejecutarlo
Tras elegir el archivo que preparamos en TextEdit, genera por defecto mySubs.xml en Escritorio.
Importar en FCP Import->xml

Regalazo - Agosto de 2.017
dani.urdiales at g-mail dot com
*/

//// VARIABLES

var oneLineMaxChars = 42;
var twoLineMaxChars = 90;
var plantillaXMLPath = "~/Desktop/plantilla.xml";
var finalXMLPath = "~/Desktop/mySubs.xml";

//TEST VARIABLES
var restToSoft = 0.3

// ABRIR ARCHIVO
var fileToRead = File.openDialog("Elige un archivo de texto");

var readOK = fileToRead.open("r");

if (readOK) {

	var fileContents = fileToRead.read();

	//array por parrafos
	var parrafoArray = fileContents.split(/\n\n\n|\r\r\r/);

	fileToRead.close ();

	//array por lineas
	var lineaArray = new Array();
	for (i in parrafoArray) {
		var tempArray = parrafoArray[i].split(/\n|\r/);
		for (h in tempArray) {
			lineaArray[lineaArray.length] = tempArray[h];
		}
	}

	//array por pastillas
	var pastillaArray = new Array()
	for (i in lineaArray) {
		if ( lineaArray[i].length <= twoLineMaxChars ) {
			pastillaArray[pastillaArray.length] = lineaArray[i];
		} else {
			//MEJORAR si el decimal cerca de 0 multiplicar twoLineMaxChars por un indice de correccion
			var numOfCuts = Math.ceil(lineaArray[i].length / twoLineMaxChars);
			var corrFactor = 1;
			var pastCutRest = (lineaArray[i].length % twoLineMaxChars) / twoLineMaxChars;
			if (pastCutRest < restToSoft){
				corrFactor = 1 - (restToSoft-pastCutRest);
			}
             var corrMaxChars = twoLineMaxChars * corrFactor;
			alert("pastCutRest = " + pastCutRest + " / corrFactor = " + corrFactor + " / corrMaxChars = " + corrMaxChars);
			var startIndex = 0;
             var dirtyFix = lineaArray[i] + " ";

			for (var j=1; j <= numOfCuts; j++) {
				var cutIndex = dirtyFix.lastIndexOf (" ", corrMaxChars* j);
				pastillaArray[pastillaArray.length] = lineaArray[i].substring (startIndex, cutIndex);
				startIndex = cutIndex+1;
			}
		}
	}

	///// 2 LINEAS ??
	for (i in pastillaArray) {
		if (pastillaArray[i].length > oneLineMaxChars) {
			//pasalo a make2lines
			pastillaArray[i] = make2lines (pastillaArray[i]);

		}
	}

	creaXMLplease (pastillaArray);

} else {

	alert("Error al abrir el archivo");

}


////////////////// FUNCIONES

function creaXMLplease (pastillaArray) {
	var plantillaXML = File (plantillaXMLPath);
	var readXML = new File ();
	var finalXML = new File (finalXMLPath);

	plantillaXML.open ("r");
	readXML = plantillaXML.read();
	plantillaXML.close();
	finalXML.encoding = "UTF8";
	finalXML.open ("w", "TEXT", "????");
	// unicode signature, this is UTF16 but will convert to UTF8 "EF BB BF"
	// optional
	//finalXML.write("\uFEFF");
	finalXML.lineFeed = "unix";

	for (i in pastillaArray) {
		var iToSub = parseInt(i) + 1;
		var replaceStr = ( ">" + pastillaArray[i] + "<" );
		var searchStr = (">PLANTILLASUBS-"+ iToSub+ "<");
		readXML = readXML.replace (searchStr, replaceStr);
	}

	finalXML.writeln(readXML);
	finalXML.close();

}

function make2lines (str) {
	var midChar = parseInt ( str.length / 2 ) ;
	var indexOfCutAlt1 = str.indexOf ( " ", midChar ) ;
	var indexOfCutAlt2 = str.lastIndexOf ( " ", midChar ) ;
	var distAlt1 = indexOfCutAlt1 - midChar;
	var distAlt2 = midChar - indexOfCutAlt2;
	if (distAlt1<=distAlt2) {
		var indexOfCut = indexOfCutAlt1;
	} else {
		var indexOfCut = indexOfCutAlt2;
	}

	var twoLineStr = str.substring (0, indexOfCut) + "&#13;" + str.substring ((indexOfCut+1), str.length);

	return twoLineStr
}
