function createUserInterface (thisObj,userInterfaceString,scriptName){
    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName,
								undefined,{resizeable: true});
    if (pal == null) return pal;

    var UI=pal.add(userInterfaceString);

    pal.layout.layout(true);
    pal.layout.resize();
    pal.onResizing = pal.onResize = function () {
        this.layout.resize();
    }
    if ((pal != null) && (pal instanceof Window)) {
            pal.show();
	}
    return UI;
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////// Main

var resourceString =
"group{orientation:'column', alignment:['fill','fill'],alignChildren:['left','top']\
    mainTextGroup: Group{orientation:'row',\
        mainTextLabel:StaticText{text:'main text', preferredSize:[80,-1]},\
        mainText: EditText{text:'enter main text here', characters:40}\
    },\
    secondaryTextGroup: Group{orientation:'row',\
        secondaryTextLabel:StaticText{text:'secondary text', preferredSize:[80,-1]},\
        secondaryText: EditText{text:'enter secondary text here', characters:40}\
    },\
    iconGroup: Group{orientation:'row',\
        iconLabel:StaticText{text:'icon', preferredSize:[80,-1]},\
        iconMamworld: RadioButton{text:'mamoworld', value:true},\
        iconMochaImport: RadioButton{text:'MochaImport'},\
        iconiExpressions: RadioButton{text:'iExpressions'}\
        },\
    colorGroup: Group{orientation:'row',\
        colorLabel:StaticText{text:'color (RGB)', preferredSize:[80,-1]},\
        redText: EditText{text:'243', characters:3},\
        greenText: EditText{text:'151', characters:3},\
        blueText: EditText{text:'27', characters:3},\
    },\
    fadeDurationGroup: Group{orientation:'row',\
        fadeDurationLabel:StaticText{text:'fade duration', preferredSize:[80,-1]},\
        fadeDurationText: EditText{text:'1.0', characters:3}\
    },\
	checkBoxSampleGrp: Group{orientation:'row',\
        cbSample1Box: Checkbox {text:'sample1', value:true, preferredSize:[100,23]}\
        cbSample2Box: Checkbox {text:'sample2'}\
    },\
    applyButton: Button{text:'Apply', alignment:['center', 'bottom']}\
}";


var UI = createUserInterface(this,resourceString,"lower third script");

UI.fadeDurationGroup.fadeDurationText.onChange = function(){
    var myVal = parseFloat(UI.fadeDurationGroup.fadeDurationText.text);
    if(isNaN(myVal)){
        UI.fadeDurationGroup.fadeDurationText.text = 0;
     }
};

UI.applyButton.onClick = function(){

    var lowerThirdParameters = {
        mainText : UI.mainTextGroup.mainText.text,
        secondaryText : UI.secondaryTextGroup.secondaryText.text,
        fillColor : [
            parseFloat(UI.colorGroup.redText.text)/255,
            parseFloat(UI.colorGroup.greenText.text)/255,
            parseFloat(UI.colorGroup.blueText.text)/255
            ],
        fadeInDuration : parseFloat(UI.fadeDurationGroup.fadeDurationText.text),
        fadeStartTime : 0,
        icon: undefined
        };

    if(UI.iconGroup.iconMamworld.value){
            lowerThirdParameters.icon = "mamoworld";
    }
    else if(UI.iconGroup.iconMochaImport.value){
            lowerThirdParameters.icon = "mochaimport";
    }
    else if(UI.iconGroup.iconiExpressions.value){
            lowerThirdParameters.icon = "iexpressions";
    }
    lowerThirdParameters.fadeEndTime = lowerThirdParameters.fadeStartTime+lowerThirdParameters.fadeInDuration;

    ///////////// here follow the commands that do the job

    var comp = app.project.activeItem;

    if(comp instanceof CompItem){
        adjustLowerThird(comp,lowerThirdParameters);
    }
    else {
        alert("Please select a composition with lower third");
    }
}
