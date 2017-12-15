var createScene = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3( .5, .5, .5);

    // camera
    var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 1, -2.5));
    camera.attachControl(canvas, true);
    // lights
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
    light.intensity = 0.8;
 
  
    var faceColors = [];
	faceColors[0]=BABYLON.Color3.Blue();
	faceColors[1]=BABYLON.Color3.Red();
	faceColors[2]=BABYLON.Color3.Green();
	faceColors[3]=BABYLON.Color3.White();
	faceColors[4]=BABYLON.Color3.Yellow();
	faceColors[5] = BABYLON.Color3.Black();

	var options = {
	    width: 0.5,
        height: 0.5,
        depth: 0.5,
        faceColors: faceColors
    };

    var box = BABYLON.MeshBuilder.CreateBox("Box", options, scene, true);

    
    //PBT and GUI
    var pbt = new PBT();
        
    pbt.clearDecorLines();
    pbt.setDecorLines([29, 29, 37, 48]);
        
    var boxAboutX = function(angle) {
        box.rotation.x = angle;
    }

    var updateLabelX = function(angle) {
        return BABYLON.Tools.ToDegrees(angle) | 0;  //0 decimal places
    }

    var boxAboutY = function(angle) {
        box.rotation.y = angle;
    }

    var updateLabelY = function(angle) {
        return BABYLON.Tools.ToDegrees(angle) | 0;  //0 decimal places
    }

    var boxAboutZ = function(angle) {
        box.rotation.z = angle;
    }

    var updateLabelZ = function(angle) {
        return BABYLON.Tools.ToDegrees(angle) | 0;  //0 decimal places
    }

    var slid = new pbt.ButtonGroup("Angle", "S");
    slid.addSlider("X axis", boxAboutX, "degs", updateLabelX, 0, 2 * Math.PI, 0);
    slid.addSlider("Y axis", boxAboutY, "degs", updateLabelY, 0, 2 * Math.PI, 0);
    slid.addSlider("Z axis", boxAboutZ, "degs", updateLabelZ, 0, 2 * Math.PI, 0);

    var selector = new pbt.SelectionDialog({groups: [slid]});

    pbt.hideLines([13, 28, 30, 69]);
   
    return scene;
};
