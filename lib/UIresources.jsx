var scriptTitle = "Search for layers in proj and do...";

var myPalette = buildUI(this);

if (myPalette != null && myPalette instanceof Window) {
	myPalette.show();
	}

function buildUI (thisObject) {

if (thisObject instanceof Panel) {
	var myPalette = thisObject;
	} else { 
    var myPalette = new Window ("palette", scriptTitle, undefined, {resizeable:true});
	}

if (myPalette != null ) {
	
	var res =
	"Group { \
		orientation: 'column', \
		alignment: ['fill','fill'], \
		alignChildren: ['left','top'], \
		searchTxt: StaticText {text:'Search string:'}, \
		searchBox: EditText {alignment: ['fill','top']}, \
		searchProj: RadioButton {text:'Search entire project'}, \
		searchComps: RadioButton {text: 'Search selected comps only'},\
		searchBtn: Button {text:'Search', alignment: ['right','top']}, \
		}";
	
	myPalette.grp = myPalette.add(res);
	myPalette.layout.layout(true);
	myPalette.layout.resize();
	
	myPalette.grp.searchProj.value = true;
	myPalette.grp.searchBtn.onClick = function () {
		searchForLayer (myPalette);
		}
	
	myPalette.onResizing = myPalette.onRize = function () {this.layout.resize();}

	} //if (myPalette != null ) 
return myPalette;
} //function buildUI (thisObject) 

function searchForLayer (palObj) {
	var searchString = palObj.grp.searchBox.text;
	var searchProj = palObj.grp.searchProj.value;
	//alert(searchProj);
	
	if (searchString == "") {
		alert("Please enter a search string");
		return;
		}
	
	var myWin = new Window ("window", "Matching Layers", undefined, {resizeable:true});
	
	if (myWin != null) {
		
		var res = 
		"Group { \
		orientation: 'column', \
		alignment: ['fill','fill'], \
		alignChildren: ['left','top'], \
			layersGrp: Group { \
			alignment: ['fill','fill'], \
			alignChildren: ['fill','fill'], \
			layersTree: TreeView {} \
			} \
			optionsGrp: Group { \
			orientation: 'column', \
			alignment: ['fill','bottom'], \
			alignChildren: ['fill','bottom'], \
				deleteGrp: Group { \
					deleteCheck: Checkbox {text:'Delete'} \
				} \
				enableGrp: Group { \
					enableCheck: Checkbox {text:'Enable'} \
					disableCheck: Checkbox {text:'Disable'} \
				} \
				renameGrp: Group { \
					renameCheck: Checkbox {text:'Rename',alignment: ['left','top']} \
					renameString: EditText {alignment: ['fill','top'], enabled:false} \
				} \
				propertyGrp: Group { \
					propertyCheck: Checkbox {text:'Property',alignment: ['left','top']} \
					propertyString: EditText {alignment: ['fill','top'], enabled:false} \
					propertyLoadBtn: Button {text: 'Load',alignment: ['right','top'], enabled:false} \
				} \
				newValueGrp: Group { \
					newValueTxt: StaticText {text:'New value:',alignment: ['left','top']} \
					newValue0: EditText {alignment: ['fill','top']}, \
					newValue1: EditText {alignment: ['fill','top']}, \
					newValue2: EditText {alignment: ['fill','top']}, \
					newValue3: EditText {alignment: ['fill','top']}, \
					newValueUnits: StaticText {text:'units',alignment: ['right','top']} \
				} \
				doItGrp: Group { \
					doItBtn: Button {text: 'Do It', alignment: ['right','top']} \
				} \
			} \
		}"; 
		
		myWin.grp = myWin.add(res);
		myWin.layout.layout(true);
		myWin.layout.resize();
		myWin.show();
		palObj.hide();
		
		myWin.grp.optionsGrp.newValueGrp.visible = false;
		myWin.grp.optionsGrp.newValueGrp.enabled = false;
		
		myWin.onClose = function () {
			palObj.show();
			}
		myWin.onResizing = myWin.Resize = function () {this.layout.resize();}  //there was a typo on this line in the live class recording.  It said myWin.Rize when it should be myWin.Resize
		
		myWin.grp.optionsGrp.deleteGrp.deleteCheck.onClick = function () {
				myWin.grp.optionsGrp.enableGrp.enabled = !this.value;
				myWin.grp.optionsGrp.renameGrp.enabled = !this.value;
				myWin.grp.optionsGrp.propertyGrp.enabled = !this.value;
				myWin.grp.optionsGrp.newValueGrp.enabled = !this.value;
			}
		myWin.grp.optionsGrp.renameGrp.renameCheck.onClick = function () {
			this.parent.renameString.enabled = this.value;
			}
		myWin.grp.optionsGrp.propertyGrp.propertyCheck.onClick = function () {
			myWin.grp.optionsGrp.newValueGrp.visible = this.value;
			myWin.grp.optionsGrp.propertyGrp.propertyString.enabled = this.value;
			myWin.grp.optionsGrp.propertyGrp.propertyLoadBtn.enabled = this.value;
			}
		
		} //if (myWin != null)
	} //function searchForLayer ()