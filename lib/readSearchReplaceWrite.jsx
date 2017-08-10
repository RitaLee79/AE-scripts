var plantillaXMLPath = "~/Desktop/plantilla1.xml";
var finalXMLPath = "~/Desktop/plantilla-extended.xml";

var plantillaXML = File (plantillaXMLPath);
var readXML = new File ();
var finalXML = new File (finalXMLPath);

plantillaXML.open ("r");
readXML = plantillaXML.read();
finalXML.encoding = "UTF8";
finalXML.open ("w", "TEXT", "????");
// unicode signature, this is UTF16 but will convert to UTF8 "EF BB BF"
// optional
//finalXML.write("\uFEFF");
finalXML.lineFeed = "unix";
var numOfRepeats = readXML.match (/>PLANTILLASUBS-32</g);
for (i in numOfRepeats) {
    var iToFirst = parseInt(i) + 33;
    var replaceStr = ( ">PLANTILLASUBS-" + iToFirst + "<" );
    var searchStr = (">PLANTILLASUBS-32<");
    readXML = readXML.replace (searchStr, replaceStr);
}
finalXML.writeln(readXML);
plantillaXML.close();
finalXML.close();
//readXML.close();
