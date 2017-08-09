var fileToRead = File.openDialog("Please select a text file");

var readOK = fileToRead.open("r");

if (readOK) {
	
	var fileContents = fileToRead.read();
	var itemsArray = fileContents.split(/\n|\r/);  //array por lineas
	var itemsObject = new Object(); 
	for (var i=0; i < itemsArray.length; i++) { // en array por linea nuevo array por ","
		itemsArray[i]= itemsArray[i].split(",");
		itemsObject["Station"+i] = {
			name: itemsArray[i][0], 
			time: itemsArray[i][1], 
			color: itemsArray[i][2]
			}
		}
    
	} else {
		alert("Error opening file");
    }
	