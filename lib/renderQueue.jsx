////////////////USER VARIABLES ////////////////

var RenderSettingsTemplate = "DV Settings";
var OutputModuleTemplate = "Lossless w Audio";
var OutputPath = "~/Desktop/";

//////////////////////////////////////////////////



//Add to RenderQueue
var myRQItem = app.project.renderQueue.items.add(myComp) ;   // cambiar myComp

//get render setting templates
var myRSTemplates = app.project.renderQueue.item(1).templates;
var foundTemplate = false;

for (var h=0; h < myRSTemplates.length; h++) {
	if (myRSTemplates[h] == RenderSettingsTemplate) {
		foundTemplate = true;
		break;
		}
	}

//Apply Render Settings
if (foundTemplate) {
myRQItem.applyTemplate(RenderSettingsTemplate);
} else {
	alert ("Could not find Render Setting: " + RenderSettingsTemplate);
	}

//get output module templates
var myOMTemplates = app.project.renderQueue.item(1).outputModule(1).templates;
var foundOMTemplate = false;

for (var h=0; h < myOMTemplates.length; h++) {
	if (myOMTemplates[h] == OutputModuleTemplate) {
		foundOMTemplate = true;
		break;
		}
	}

//Apply Render Settings
if (foundOMTemplate) {
myRQItem.outputModules[1].applyTemplate(OutputModuleTemplate);
} else {
	alert ("Could not find Output Module template: " + OutputModuleTemplate);
	}


//Set output name and path
var projName = app.project.file.name;

var myFile = new File(OutputPath + projName.substring(0,projName.length-4) + "_" + myComp.name) ; //cambiar myComp
myRQItem.outputModules[1].file = myFile;


// app.project.renderQueue.render() ; //uncomment para lanzar render desde el script
