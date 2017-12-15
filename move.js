var createScene = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3( .5, .5, .5);

    // camera
    var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(5, 3, 0), scene);
    camera.setPosition(new BABYLON.Vector3(10.253, 5.82251, -9.45717));
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
	
    var localOrigin = localAxes(2);	
		  
    localOrigin.parent = box;
    box.rotation.y = Math.PI/4;
    box.position = new BABYLON.Vector3(0, 0, 0);

    var pstn = 0;
    var x = 2;
    var z = 2;
    scene.registerAfterRender(function(){
        box.position.x = x;
        box.position.z = z;
        pstn += 0.007;
        pstn %= 3;
      
        x = pstn ;
        z = pstn ;      
    });
    
    //PBT and GUI
    var pbt = new PBT();
        
    pbt.clearDecorLines();
    pbt.setDecorLines([29, 29, 37, 48]);
        
    var hideBoxCode = function() {
        var ranges = [13, 28];
        if(boxHideCode) {
            pbt.hideRange(ranges);
        }
        else {
            pbt.showRange(ranges);
        }
        boxHideCode = !boxHideCode;
    }

    var hideAnimCode = function() {
        var ranges = [37, 48];
        if(animHideCode) {
            pbt.hideRange(ranges);
        }
        else {
            pbt.showRange(ranges);
        }
        
        animHideCode = !animHideCode;
    }


    var boxH = new pbt.ButtonGroup("Box Code");
    var boxHideCode = true;
    boxH.addButton("Hide", hideBoxCode, true);

    var animH = new pbt.ButtonGroup("Anim Code");
    var animHideCode = true; 
    animH.addButton("Hide", hideAnimCode, true);


    var selector = new pbt.SelectionDialog({groups:[boxH, animH]});

    pbt.hideLines([13, 28, 30, 35, 37, 48, 49, 162]);
    pbt.hideMenu();

    // show axis
    var showAxis = function(size) {
        var makeTextPlane = function(text, color, size) {
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
            var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
            plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
            plane.material.backFaceCulling = false;
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
            plane.material.diffuseTexture = dynamicTexture;
            return plane;
        };
  
        var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var xChar = makeTextPlane("X", "red", size / 10);
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
        var axisY = BABYLON.Mesh.CreateLines("axisY", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
            ], scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
            ], scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        var zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    };
  
    //Local Axes
    function localAxes(size) {
        var pilot_local_axisX = BABYLON.Mesh.CreateLines("pilot_local_axisX", [ 
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], scene);
        pilot_local_axisX.color = new BABYLON.Color3(1, 0, 0);

        pilot_local_axisY = BABYLON.Mesh.CreateLines("pilot_local_axisY", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
	    ], scene);
        pilot_local_axisY.color = new BABYLON.Color3(0, 1, 0);

        var pilot_local_axisZ = BABYLON.Mesh.CreateLines("pilot_local_axisZ", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
            ], scene);
        pilot_local_axisZ.color = new BABYLON.Color3(0, 0, 1);

	    var local_origin = BABYLON.MeshBuilder.CreateBox("local_origin", {size:1}, scene);
	    local_origin.isVisible = false;
	
	    pilot_local_axisX.parent = local_origin;
  	    pilot_local_axisY.parent = local_origin;
  	    pilot_local_axisZ.parent = local_origin; 
	  
        return local_origin;
	
    }
	
    showAxis(8);
   
    return scene;
};
