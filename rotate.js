var createScene = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3( .5, .5, .5);
  
    var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(5, 3, 0), scene);
    camera.setPosition(new BABYLON.Vector3(10.253, 5.82251, -9.45717));
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
    light.intensity = 0.8;
   
    var blueMat = new BABYLON.StandardMaterial("blue", scene);
    blueMat.emissiveColor = new BABYLON.Color3(0,0,1);
    
    var redMat = new BABYLON.StandardMaterial("red", scene);
    redMat.emissiveColor = new BABYLON.Color3(1,0,0);
    
    var body = BABYLON.MeshBuilder.CreateCylinder("body", { height: 0.75, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 6, subdivisions: 1 }, scene);
    var arm = BABYLON.MeshBuilder.CreateBox("arm", { height: 0.75, width: 0.3, depth: 0.1875 }, scene);
    arm.position.x = 0.125;
    
    var blueBlock = BABYLON.Mesh.MergeMeshes([body, arm], true);
    blueBlock.position = new BABYLON.Vector3(1, 3, 4);
    blueBlock.material = blueMat;

    var redBlock = blueBlock.clone("redBlock");
    redBlock.material = redMat;
    redBlock.position = new BABYLON.Vector3(4, 3, 4);
    
    /*****************Creation of Axes for Blocks***********************************************/
      
    var localOriginBlue = localAxes(1.5);
    var localOriginRed = localAxes(1.5);
  
    localOriginBlue.position = blueBlock.position;
      
    
    localOriginRed.position = redBlock.position;
    redBlock.setEnabled(false);
    
    localOriginBlue.setEnabled(false);
    localOriginRed.setEnabled(false);   

      var spaceWorld = true;
      var frameRate = 20;
      
      var rotationX = new BABYLON.Animation("rotationX", "rotation.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      var rotationY = new BABYLON.Animation("rotationY", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      var rotationZ = new BABYLON.Animation("rotationZ", "rotation.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotationX_keys = [];
      
      rotationX_keys.push({
          frame: 0,
          value: 0
      });
  
      rotationX_keys.push({
          frame: 5 * frameRate,
          value: 0
      });
  
      rotationX_keys.push({
          frame: 7 * frameRate,
          value: Math.PI/2
      });
      
      rotationX.setKeys(rotationX_keys);
      
      var rotationY_keys = [];
      
      rotationY_keys.push({
          frame: 0,
          value: 0
      });
  
      rotationY_keys.push({
          frame: 5 * frameRate,
          value: 0
      });
  
      rotationY_keys.push({
          frame: 7 * frameRate,
          value: Math.PI/2
      });
      
      rotationY.setKeys(rotationY_keys);
      
      var rotationZ_keys = [];
      
      rotationZ_keys.push({
          frame: 0,
          value: 0
      });
  
      rotationZ_keys.push({
          frame: 5 * frameRate,
          value: 0
      });
  
      rotationZ_keys.push({
          frame: 7 * frameRate,
          value: Math.PI/2
      });
      
      rotationZ.setKeys(rotationZ_keys);
      
      var qXStart = new BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, 0); 
      var qXEnd = new BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, Math.PI/2);
      var qYStart = new BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 0); 
      var qYEnd = new BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, Math.PI/2);
      var qZStart = new BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, 0); 
      var qZEnd = new BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, Math.PI/2);
      
      var qWorldXY = qYEnd.multiply(qXEnd);
      var qWorldXYZ = qZEnd.multiply(qWorldXY);
      var qLocalXY = qXEnd.multiply(qYEnd);
      var qLocalXYZ = qLocalXY.multiply(qZEnd);
      
      var qWorldXZ = qZEnd.multiply(qXEnd);
      var qWorldXZY = qYEnd.multiply(qWorldXZ);
      var qLocalXZ = qXEnd.multiply(qZEnd);
      var qLocalXZY = qLocalXZ.multiply(qYEnd);
      
      var qWorldYX = qXEnd.multiply(qYEnd);
      var qWorldYXZ = qZEnd.multiply(qWorldYX);
      var qLocalYX = qYEnd.multiply(qXEnd);
      var qLocalYXZ = qLocalYX.multiply(qZEnd);
      
      var qWorldYZ = qZEnd.multiply(qYEnd);
      var qWorldYZX = qXEnd.multiply(qWorldYZ);
      var qLocalYZ = qYEnd.multiply(qZEnd);
      var qLocalYZX = qLocalYZ.multiply(qXEnd);
      
      var qWorldZY = qYEnd.multiply(qZEnd);
      var qWorldZYX = qXEnd.multiply(qWorldZY);
      var qLocalZY = qZEnd.multiply(qYEnd);
      var qLocalZYX = qLocalZY.multiply(qXEnd);
      
      var qWorldZX = qXEnd.multiply(qZEnd);
      var qWorldZXY = qYEnd.multiply(qWorldZX);
      var qLocalZX = qZEnd.multiply(qXEnd);
      var qLocalZXY = qLocalZX.multiply(qYEnd);
      
      var rotationMsg = true;
      
      //_______________________XYZ Start___________________________________
      var rotateWorldXYZ = new BABYLON.Animation("rotateX", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateWorldXYZ_keys = [];
      
      rotateWorldXYZ_keys.push({
          frame: 0,
          value: qXStart
      });
      
      rotateWorldXYZ_keys.push({
          frame: 1 * frameRate,
          value: qXStart
      });
      
      rotateWorldXYZ_keys.push({
          frame: 3 * frameRate,
          value: qXEnd
      });
  
      rotateWorldXYZ_keys.push({
          frame: 5 * frameRate,
          value: qWorldXY
      });
  
      rotateWorldXYZ_keys.push({
          frame: 7 * frameRate,
          value: qWorldXYZ
      });
      
      rotateWorldXYZ.setKeys(rotateWorldXYZ_keys);
      
      var rotateLocalXYZ = new BABYLON.Animation("rotateX", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateLocalXYZ_keys = [];
      
      rotateLocalXYZ_keys.push({
          frame: 0,
          value: qXStart
      });
      
      rotateLocalXYZ_keys.push({
          frame: 1 * frameRate,
          value: qXStart
      });
      
      rotateLocalXYZ_keys.push({
          frame: 3 * frameRate,
          value: qXEnd
      });
  
      rotateLocalXYZ_keys.push({
          frame: 5 * frameRate,
          value: qLocalXY
      });
  
      rotateLocalXYZ_keys.push({
          frame: 7 * frameRate,
          value: qLocalXYZ
      });
      
      rotateLocalXYZ.setKeys(rotateLocalXYZ_keys);
      
      
      var XYZ = function() {          
         pbt.editOn();
         var newLines = '    blueBlock.rotation.x = Math.PI/2;\r\n';
         newLines += '    blueBlock.rotation.y = Math.PI/2;\r\n';
         newLines += '    blueBlock.rotation.z = Math.PI/2;';
         pbt.replaceLines([30, 32], newLines);
         
          rotationMsg	= !rotationMsg;
          if(rotationMsg) {
            tutorial.setText("With .rotate the red block rotates in the given order.");
          }
          else {
            tutorial.setText("With .rotation the blue block's orientation is dependent only on the three angles and not the order given.");
          }
          if(spaceWorld) {
              scene.beginDirectAnimation(blueBlock, [rotationX], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationY], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationZ], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateWorldXYZ], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);';
              pbt.replaceLines([34, 36], newLines);
          }
          else {
              scene.beginDirectAnimation(blueBlock, [rotationY], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationX], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationZ], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateLocalXYZ], 0 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(localOriginRed, [rotateLocalXYZ], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.LOCAL);';
              pbt.replaceLines([34, 36], newLines);
          }
          pbt.editOff();
      }
      //_______________________XYZ End___________________________________
      
      //_______________________YZX Start___________________________________
  var rotateWorldYZX = new BABYLON.Animation("rotateY", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateWorldYZX_keys = [];
      
      rotateWorldYZX_keys.push({
          frame: 0,
          value: qYStart
      });
      
      rotateWorldYZX_keys.push({
          frame: 1 * frameRate,
          value: qYStart
      });
      
      rotateWorldYZX_keys.push({
          frame: 3 * frameRate,
          value: qYEnd
      });
  
      rotateWorldYZX_keys.push({
          frame: 5 * frameRate,
          value: qWorldYZ
      });
  
      rotateWorldYZX_keys.push({
          frame: 7 * frameRate,
          value: qWorldYZX
      });
      
      rotateWorldYZX.setKeys(rotateWorldYZX_keys);
      
      var rotateLocalYZX = new BABYLON.Animation("rotateY", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateLocalYZX_keys = [];
      
      rotateLocalYZX_keys.push({
          frame: 0,
          value: qYStart
      });
      
      rotateLocalYZX_keys.push({
          frame: 1 * frameRate,
          value: qYStart
      });
      
      rotateLocalYZX_keys.push({
          frame: 3 * frameRate,
          value: qYEnd
      });
  
      rotateLocalYZX_keys.push({
          frame: 5 * frameRate,
          value: qLocalYZ
      });
  
      rotateLocalYZX_keys.push({
          frame: 7 * frameRate,
          value: qLocalYZX
      });
      
      rotateLocalYZX.setKeys(rotateLocalYZX_keys);
      
      
      var YZX = function() {
        pbt.editOn();
        var newLines = '    blueBlock.rotation.y = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.z = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.x = Math.PI/2;';
        pbt.replaceLines([30, 32], newLines,);
        
          rotationMsg	= !rotationMsg;
          if(rotationMsg) {
            tutorial.setText("With .rotate the red block rotates in the given order.");
          }
          else {
            tutorial.setText("With .rotation the blue block's orientation is dependent only on the three angles and not the order given.");
          }
          if(spaceWorld) {
              scene.beginDirectAnimation(blueBlock, [rotationY], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationZ], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationX], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateWorldYZX], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);';
              pbt.replaceLines([34, 36], newLines);
          }
          else {
              scene.beginDirectAnimation(blueBlock, [rotationZ], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationY], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationX], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateLocalYZX], 0 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(localOriginRed, [rotateLocalYZX], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.LOCAL);';
              pbt.replaceLines([34, 36], newLines,);              
          }
          pbt.editOff();
      }
      
      //______________YZX END_____________________________________________________________
      
      //_______________________YZX Start___________________________________
  var rotateWorldYXZ = new BABYLON.Animation("rotateY", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateWorldYXZ_keys = [];
      
      rotateWorldYXZ_keys.push({
          frame: 0,
          value: qYStart
      });
      
      rotateWorldYXZ_keys.push({
          frame: 1 * frameRate,
          value: qYStart
      });
      
      rotateWorldYXZ_keys.push({
          frame: 3 * frameRate,
          value: qYEnd
      });
  
      rotateWorldYXZ_keys.push({
          frame: 5 * frameRate,
          value: qWorldYX
      });
  
      rotateWorldYXZ_keys.push({
          frame: 7 * frameRate,
          value: qWorldYXZ
      });
      
      rotateWorldYXZ.setKeys(rotateWorldYXZ_keys);
      
      var rotateLocalYXZ = new BABYLON.Animation("rotateY", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateLocalYXZ_keys = [];
      
      rotateLocalYXZ_keys.push({
          frame: 0,
          value: qYStart
      });
      
      rotateLocalYXZ_keys.push({
          frame: 1 * frameRate,
          value: qYStart
      });
      
      rotateLocalYXZ_keys.push({
          frame: 3 * frameRate,
          value: qYEnd
      });
  
      rotateLocalYXZ_keys.push({
          frame: 5 * frameRate,
          value: qLocalYX
      });
  
      rotateLocalYXZ_keys.push({
          frame: 7 * frameRate,
          value: qLocalYXZ
      });
      
      rotateLocalYXZ.setKeys(rotateLocalYXZ_keys);
      
      
      var YXZ = function() {
        pbt.editOn();
        var newLines = '    blueBlock.rotation.y = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.x = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.z = Math.PI/2;';
        pbt.replaceLines([30, 32], newLines);
        	
          rotationMsg	= !rotationMsg;
          if(rotationMsg) {
            tutorial.setText("With .rotate the red block rotates in the given order.");
          }
          else {
            tutorial.setText("With .rotation the blue block's orientation is dependent only on the three angles and not the order given.");
          }
          if(spaceWorld) {
              scene.beginDirectAnimation(blueBlock, [rotationY], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationX], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationZ], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateWorldYXZ], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);';
              pbt.replaceLines([34, 36], newLines);
          }
          else {
              scene.beginDirectAnimation(blueBlock, [rotationX], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationY], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationZ], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateLocalYXZ], 0 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(localOriginRed, [rotateLocalYXZ], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.LOCAL);';
              pbt.replaceLines([34, 36], newLines);
  
          }
          pbt.editOff();
      }
      
      //______________YZX END_____________________________________________________________
      
      //_______________________ZYX Start___________________________________
  var rotateWorldZYX = new BABYLON.Animation("rotateZ", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateWorldZYX_keys = [];
      
      rotateWorldZYX_keys.push({
          frame: 0,
          value: qZStart
      });
      
      rotateWorldZYX_keys.push({
          frame: 1 * frameRate,
          value: qZStart
      });
      
      rotateWorldZYX_keys.push({
          frame: 3 * frameRate,
          value: qZEnd
      });
  
      rotateWorldZYX_keys.push({
          frame: 5 * frameRate,
          value: qWorldZY
      });
  
      rotateWorldZYX_keys.push({
          frame: 7 * frameRate,
          value: qWorldZYX
      });
      
      rotateWorldZYX.setKeys(rotateWorldZYX_keys);
      
      var rotateLocalZYX = new BABYLON.Animation("rotateZ", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateLocalZYX_keys = [];
      
      rotateLocalZYX_keys.push({
          frame: 0,
          value: qZStart
      });
      
      rotateLocalZYX_keys.push({
          frame: 1 * frameRate,
          value: qZStart
      });
      
      rotateLocalZYX_keys.push({
          frame: 3 * frameRate,
          value: qZEnd
      });
  
      rotateLocalZYX_keys.push({
          frame: 5 * frameRate,
          value: qLocalZY
      });
  
      rotateLocalZYX_keys.push({
      
      frame: 7 * frameRate,
          value: qLocalZYX
      });
      
      rotateLocalZYX.setKeys(rotateLocalZYX_keys);
      
      
      var ZYX = function() {
        pbt.editOn();
        var newLines = '    blueBlock.rotation.z = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.y = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.x = Math.PI/2;';
        pbt.replaceLines([30, 32], newLines);	
          rotationMsg	= !rotationMsg;
          if(rotationMsg) {
            tutorial.setText("With .rotate the red block rotates in the given order.");
          }
          else {
            tutorial.setText("With .rotation the blue block's orientation is dependent only on the three angles and not the order given.");
          }
          if(spaceWorld) {
              scene.beginDirectAnimation(blueBlock, [rotationZ], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationY], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationX], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateWorldZYX], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);';
              pbt.replaceLines([34, 36], newLines);
          }
          else {
              scene.beginDirectAnimation(blueBlock, [rotationY], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationZ], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationX], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateLocalZYX], 0 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(localOriginRed, [rotateLocalZYX], 0 * frameRate , 7 * frameRate, false);
  
              newLines = '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.LOCAL);';
              pbt.replaceLines([34, 36], newLines);
          }
          pbt.editOff();
      }
      
      //______________ZYX END_____________________________________________________________
      
      //_______________________ZXY Start___________________________________
  var rotateWorldZXY = new BABYLON.Animation("rotateZ", "rotationQuaternion", frameRate,  BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateWorldZXY_keys = [];
      
      rotateWorldZXY_keys.push({
          frame: 0,
          value: qZStart
      });
  
      rotateWorldZXY_keys.push({
          frame: 1 * frameRate,
          value: qZStart
      });
      
      rotateWorldZXY_keys.push({
          frame: 3 * frameRate,
          value: qZEnd
      });
  
      rotateWorldZXY_keys.push({
          frame: 5 * frameRate,
          value: qWorldZX
      });
  
      rotateWorldZXY_keys.push({
          frame: 7 * frameRate,
          value: qWorldZXY
      });
      
      rotateWorldZXY.setKeys(rotateWorldZXY_keys);
      
      var rotateLocalZXY = new BABYLON.Animation("rotateZ", "rotationQuaternion", frameRate,  BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateLocalZXY_keys = [];
      
      rotateLocalZXY_keys.push({
          frame: 0,
          value: qZStart
      });
      
      rotateLocalZXY_keys.push({
          frame: 1 * frameRate,
          value: qZStart
      });
      
      rotateLocalZXY_keys.push({
          frame: 3 * frameRate,
          value: qZEnd
      });
  
      rotateLocalZXY_keys.push({
          frame: 5 * frameRate,
          value: qLocalZX
      });
  
      rotateLocalZXY_keys.push({
          frame: 7 * frameRate,
          value: qLocalZXY
      });
      
      rotateLocalZXY.setKeys(rotateLocalZXY_keys);
      
      
      var ZXY = function() {
        pbt.editOn();
        var newLines = '    blueBlock.rotation.z = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.x = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.y = Math.PI/2;';
        pbt.replaceLines([30, 32], newLines);	
          rotationMsg	= !rotationMsg;
          if(rotationMsg) {
            tutorial.setText("With .rotate the red block rotates in the given order.");
          }
          else {
            tutorial.setText("With .rotation the blue block's orientation is dependent only on the three angles and not the order given.");
          }
          if(spaceWorld) {
              scene.beginDirectAnimation(blueBlock, [rotationZ], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationX], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationY], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateWorldZXY], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);';
              pbt.replaceLines([34, 36], newLines);
          }
          else {
              scene.beginDirectAnimation(blueBlock, [rotationX], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationZ], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationY], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateLocalZXY], 0 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(localOriginRed, [rotateLocalZXY], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);';
              pbt.replaceLines([34, 36], newLines);  
              
          }
          pbt.editOff();
      }
      
      //______________ZXY END_____________________________________________________________
      
      //_______________________XZY Start___________________________________
  var rotateWorldXZY = new BABYLON.Animation("rotateX", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateWorldXZY_keys = [];
      
      rotateWorldXZY_keys.push({
          frame: 0,
          value: qXStart
      });
      
      rotateWorldXZY_keys.push({
          frame: 1 * frameRate,
          value: qXStart
      });
      
      rotateWorldXZY_keys.push({
          frame: 3 * frameRate,
          value: qXEnd
      });
  
      rotateWorldXZY_keys.push({
          frame: 5 * frameRate,
          value: qWorldXZ
      });
  
      rotateWorldXZY_keys.push({
          frame: 7 * frameRate,
          value: qWorldXZY
      });
      
      rotateWorldXZY.setKeys(rotateWorldXZY_keys);
      
      var rotateLocalXZY = new BABYLON.Animation("rotateX", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      
      var rotateLocalXZY_keys = [];
      
      rotateLocalXZY_keys.push({
          frame: 0,
          value: qXStart
      });
      
      rotateLocalXZY_keys.push({
          frame: 1 * frameRate,
          value: qXStart
      });
      
      rotateLocalXZY_keys.push({
          frame: 3 * frameRate,
          value: qXEnd
      });
  
      rotateLocalXZY_keys.push({
          frame: 5 * frameRate,
          value: qLocalXZ
      });
  
      rotateLocalXZY_keys.push({
          frame: 7 * frameRate,
          value: qLocalXZY
      });
      
      rotateLocalXZY.setKeys(rotateLocalXZY_keys);
      
      
      var XZY = function() {
        pbt.editOn();
        var newLines = '    blueBlock.rotation.x = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.z = Math.PI/2;\r\n';
        newLines += '    blueBlock.rotation.y = Math.PI/2;';
        pbt.replaceLines([30, 32], newLines);	
          rotationMsg	= !rotationMsg;
          if(rotationMsg) {
            tutorial.setText("With .rotate the red block rotates in the given order.");
          }
          else {
            tutorial.setText("With .rotation the blue block's orientation is dependent only on the three angles and not the order given.");
          }
          if(spaceWorld) {
              scene.beginDirectAnimation(blueBlock, [rotationX], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationZ], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationY], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateWorldXZY], 0 * frameRate , 7 * frameRate, false);

              newLines = '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);';
              pbt.replaceLines([34, 36], newLines);
          }
          else {
              scene.beginDirectAnimation(blueBlock, [rotationZ], 4 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationX], 2 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(blueBlock, [rotationY], 0 * frameRate , 7 * frameRate, false);
              
              scene.beginDirectAnimation(redBlock, [rotateLocalXZY], 0 * frameRate , 7 * frameRate, false);
              scene.beginDirectAnimation(localOriginRed, [rotateLocalXZY], 0 * frameRate , 7 * frameRate, false);
  
              newLines = '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.LOCAL);\r\n';
              newLines += '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);';
              pbt.replaceLines([34, 36], newLines);
          }
          pbt.editOff();
      }
      
      //______________XZY END_____________________________________________________________
      
    var localSpace = function() {
        spaceWorld = false;
        localOriginRed.rotationQuaternion = qXStart.multiply(qYStart).multiply(qZStart);
        blueBlock.rotation = BABYLON.Vector3.Zero();
        redBlock.rotationQuaternion = qXStart.multiply(qYStart).multiply(qZStart);
        tutorial.setText("The rotation axes are LOCAL to the block and move with it.");
        pbt.editOn();
        var lineText = pbt.getLineText(34);
        lineText = lineText.replace("WORLD", "LOCAL");
        pbt.replaceLines([34, 34], lineText);
        lineText = pbt.getLineText(35);
        lineText = lineText.replace("WORLD", "LOCAL");
        pbt.replaceLines([35, 35], lineText);  
        lineText = pbt.getLineText(36);
        lineText = lineText.replace("WORLD", "LOCAL");
        pbt.replaceLines([36, 36], lineText);
        pbt.editOff();
    }
      
    var worldSpace = function() {
        spaceWorld = true;
        localOriginRed.rotationQuaternion = qXStart.multiply(qYStart).multiply(qZStart);
        blueBlock.rotation = BABYLON.Vector3.Zero();
        redBlock.rotationQuaternion = qXStart.multiply(qYStart).multiply(qZStart);
        tutorial.setText("The rotation axes are fixed and parallel to the WORLD axes.");
        pbt.editOn();
        pbt.replaceText(34, 62, 67, "WORLD");
        pbt.replaceText(35, 62, 67, "WORLD");
        pbt.replaceText(36, 62, 67, "WORLD");
        pbt.editOff();
    }
      
    // GUI
    var pbt = new PBT();
    optionsSD = {
        left: "4px",
        top: "4px",
        text: "Read on for the difference between .rotation and .rotate and follow to the end for examples."
    }
    var tutorial = new pbt.StandardDialog(optionsSD);  
    tutorial.hidePrev();

    var tutorIndex = 0;
    var tutorTexts = [
        "Read on for the difference between .rotation and .rotate and follow to the end for examples.",
        "Let's use this asymmetric mesh to show what's going on. Keep checking the code on the left.",
        "To show the two method, .rotation and .rotate, we need a second block.",
        "Now to help lets use some axes with hidden code to keep the seen code less cluttered.",
        "We do need to see the code for rotating, the blue block with .rotation and the red block with .rotate .",
        "Notice that the orientations of the blocks are different even though the order of axes, X, Y, Z is the same.",
        "Euler angles are used with .rotation which produced a fixed orientation whatever order is given.",
        "Order is important with .rotate as well as setting WORLD or LOCAL space. Examples coming up soon.",
        "For the examples you can choose the order of rotation about XYZ axes and in WORLD or LOCAL space.",
        "So you can see them happening the rotations will be slown down and you can now make your choices."
    ];

    tutorial.getNextButton().onPointerUpObservable.add(function() {       
        tutorIndex++;   
        tutorial.setText(tutorTexts[tutorIndex]);
        nextAction(tutorIndex);
    });

    var orderGroup = new pbt.ButtonGroup("Order", "R");    
    orderGroup.addButton("XYZ", XYZ);
    orderGroup.addButton("YXZ", YXZ);
    orderGroup.addButton("YZX", YZX);
    orderGroup.addButton("ZYX", ZYX);
    orderGroup.addButton("ZXY", ZXY);
    orderGroup.addButton("XZY", XZY);

    var spaceGroup = new pbt.ButtonGroup("Space", "R");  
    spaceGroup.addButton("WORLD", worldSpace, true);
    spaceGroup.addButton("LOCAL", localSpace);

    var selector = new pbt.SelectionDialog({groups:[orderGroup, spaceGroup]});
    selector.setHorizontalAlignment(BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT);
    selector.setTop("-4px");
    selector.setLeft("-4px");
    selector.hide();

    var nextAction = function(index) {                 
        switch(index) {
            case 1: 
                pbt.clearDecorLines();
                pbt.setDecorLines([18, 24]);
            break
            case 2:
                redBlock.setEnabled(true);
                pbt.editOn();
                var newLines = '    redBlock = blueBlock.clone("redBlock");\r\n';
                newLines += '    redBlock.material = redMat;\r\n';
                newLines += '    redBlock.position = new BABYLON.Vector3(4, 3, 4);\r\n';
                pbt.clearDecorLines();
                pbt.replaceLines([26, 26], newLines);
                pbt.setDecorLines([26, 28]);
                pbt.hideLines([30, 1011]);
                pbt.editOff();
            break
            case 3:
                axisX.setEnabled(true);
                xChar.setEnabled(true);
                axisY.setEnabled(true);
                yChar.setEnabled(true);
                axisZ.setEnabled(true);
                zChar.setEnabled(true);
                localOriginRed.setEnabled(true);
            break
            case 4:
                  pbt.editOn();
                  var newLines = '\r\n    blueBlock.rotation.x = Math.PI/2;\r\n';
                  newLines += '    blueBlock.rotation.y = Math.PI/2;\r\n';
                  newLines += '    blueBlock.rotation.z = Math.PI/2;\r\n';
                  newLines += '\r\n';
                  newLines += '    redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);\r\n';
                  newLines += '    redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);\r\n';
                  newLines += '    redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);\r\n';
                  pbt.clearDecorLines();
                  pbt.replaceLines([29, 29], newLines);
                  pbt.setDecorLines([30, 32, 34, 36]);
                  pbt.hideLines([38, 1019]);
                  pbt.editOff();
                  blueBlock.rotation = new BABYLON.Vector3(Math.PI/2, Math.PI/2, Math.PI/2);
                  redBlock.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
                  redBlock.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
                  redBlock.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);
            break
            case 9:
                selector.show();
                tutorial.hideNext();
            break
        }
    }
      
    // show axis
    var axisX, axisY, axisZ;
    var xChar, yChar, zChar;
    
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
    
      axisX = BABYLON.Mesh.CreateLines("axisX", [ 
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], scene);
      axisX.color = new BABYLON.Color3(1, 0, 0);
      xChar = makeTextPlane("X", "red", size / 10);
      axisX.setEnabled(false);
      xChar.setEnabled(false);
      xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
      axisY = BABYLON.Mesh.CreateLines("axisY", [
          new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
          new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
          ], scene);
      axisY.color = new BABYLON.Color3(0, 1, 0);
      yChar = makeTextPlane("Y", "green", size / 10);
      axisY.setEnabled(false);
      yChar.setEnabled(false);
      yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
      axisZ = BABYLON.Mesh.CreateLines("axisZ", [
          new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
          new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
          ], scene);
      axisZ.color = new BABYLON.Color3(0, 0, 1);
      zChar = makeTextPlane("Z", "blue", size / 10);
      zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
      axisZ.setEnabled(false);
      zChar.setEnabled(false);
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
    pbt.hideMenu();
    pbt.editOff();
    pbt.hideLines([26, 1008]);
    
    return scene;
  };
 
   