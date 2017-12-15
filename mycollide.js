var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    var light = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), scene);

    var camera = new BABYLON.UniversalCamera("MyCamera", new BABYLON.Vector3(0, 1, 0), scene);
    camera.minZ = 0.0001;
    camera.attachControl(canvas, true);
    camera.speed = 0.02;
    camera.angularSpeed = 0.05;
    camera.angle = Math.PI/2;
    camera.direction = new BABYLON.Vector3(Math.cos(camera.angle), 0, Math.sin(camera.angle));
    
    var viewCamera = new BABYLON.UniversalCamera("viewCamera", new BABYLON.Vector3(0, 3, -3), scene);
    viewCamera.parent = camera;
    viewCamera.setTarget(new BABYLON.Vector3(0, -0.0001, 1));
    
    scene.activeCameras.push(viewCamera);
    scene.activeCameras.push(camera);

    camera.viewport = new BABYLON.Viewport(0, 0.5, 1.0, 0.5);
    viewCamera.viewport = new BABYLON.Viewport(0, 0, 1.0, 0.5);  
    
    var cone = BABYLON.MeshBuilder.CreateCylinder("dummyCamera", {diameterTop:0.01, diameterBottom:0.2, height:0.2}, scene);
    cone.parent = camera;
    cone.rotation.x = Math.PI/2;

    //Ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    ground.material.backFaceCulling = false;

    var lowerGround = ground.clone("lowerGround");
    lowerGround.scaling.x = 4;
    lowerGround.scaling.z = 4;
    lowerGround.position.y = -16;
    lowerGround.material = ground.material.clone("lowerMat");
    lowerGround.material.diffuseColor = new BABYLON.Color3(0, 1, 0);

    var randomNumber = function (min, max) {
		if (min == max) {
			return (min);
		}
		var random = Math.random();
		return ((random * (max - min)) + min);
	};

    var box = new BABYLON.MeshBuilder.CreateBox("crate", {size: 2}, scene);
    box.material = new BABYLON.StandardMaterial("Mat", scene);
    box.material.diffuseTexture = new BABYLON.Texture("textures/crate.png", scene);
    box.checkCollisions = true;

    var boxNb = 6;
    var theta = 0;
    var radius = 6;
    box.position = new BABYLON.Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));

    var boxes = [box];
    for (var i = 1; i < boxNb; i++) {
        theta += 2 * Math.PI / boxNb;
        var newBox = box.clone("box" + i);
        boxes.push(newBox);
        newBox.position = new BABYLON.Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));
    }

    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    scene.collisionsEnabled = true;

    camera.checkCollisions = true;
    camera.applyGravity = true;

    camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
    camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0); 

    var a = 0.5;
    var b = 1;
    var points = [];
    for(var theta = -Math.PI/2; theta < Math.PI/2; theta += Math.PI/36) {
        points.push(new BABYLON.Vector3(0, b * Math.sin(theta), a * Math.cos(theta)));
    }

    var ellipse = [];
    ellipse[0] = BABYLON.MeshBuilder.CreateLines("e", {points:points}, scene);
    ellipse[0].color = BABYLON.Color3.Red();
    ellipse[0].parent = camera;
    ellipse[0].rotation.y = 5 * Math.PI/ 16;
    for(var i = 1; i < 23; i++) {
            ellipse[i] = ellipse[0].clone("el" + i);
            ellipse[i].parent = camera;
            ellipse[i].rotation.y = 5 * Math.PI/ 16 + i * Math.PI/16;
    }
    

    ground.checkCollisions = true;
    lowerGround.checkCollisions = true;

    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    camera.inputs.removeByType("FreeCameraMouseInput");
     
    var FreeCameraKeyboardWalkInput = function () {
        this._keys = [];
        this.keysUp = [38];
        this.keysDown = [40];
        this.keysLeft = [37];
        this.keysRight = [39];
    }
    
    FreeCameraKeyboardWalkInput.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            if (!this._onKeyDown) {
                element.tabIndex = 1;
                this._onKeyDown = function (evt) {                 
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index === -1) {
                            _this._keys.push(evt.keyCode);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                };
                this._onKeyUp = function (evt) {
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index >= 0) {
                            _this._keys.splice(index, 1);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                };
                element.addEventListener("keydown", this._onKeyDown, false);
                element.addEventListener("keyup", this._onKeyUp, false);
                BABYLON.Tools.RegisterTopRootEvents([
                    { name: "blur", handler: this._onLostFocus }
                ]);
            }
        };

        FreeCameraKeyboardWalkInput.prototype.detachControl = function (element) {
            if (this._onKeyDown) {
                element.removeEventListener("keydown", this._onKeyDown);
                element.removeEventListener("keyup", this._onKeyUp);
                BABYLON.Tools.UnregisterTopRootEvents([
                    { name: "blur", handler: this._onLostFocus }
                ]);
                this._keys = [];
                this._onKeyDown = null;
                this._onKeyUp = null;
            }
        };

        FreeCameraKeyboardWalkInput.prototype.checkInputs = function () {
            if (this._onKeyDown) {
                var camera = this.camera;
                for (var index = 0; index < this._keys.length; index++) {
                    var keyCode = this._keys[index];
                    var speed = camera.speed;
                    if (this.keysLeft.indexOf(keyCode) !== -1) {
                        camera.rotation.y -= camera.angularSpeed;
                        camera.direction.copyFromFloats(0, 0, 0);                
                    }
                    else if (this.keysUp.indexOf(keyCode) !== -1) {
                        camera.direction.copyFromFloats(0, 0, speed);               
                    }
                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                        camera.rotation.y += camera.angularSpeed;
                        camera.direction.copyFromFloats(0, 0, 0);
                    }
                    else if (this.keysDown.indexOf(keyCode) !== -1) {
                        camera.direction.copyFromFloats(0, 0, -speed);
                    }
                    if (camera.getScene().useRightHandedSystem) {
                        camera.direction.z *= -1;
                    }
                    camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
                    BABYLON.Vector3.TransformNormalToRef(camera.direction, camera._cameraTransformMatrix, camera._transformedDirection);
                    camera.cameraDirection.addInPlace(camera._transformedDirection);
                }
            }
        };

        FreeCameraKeyboardWalkInput.prototype._onLostFocus = function (e) {
            this._keys = [];
        };
        
        FreeCameraKeyboardWalkInput.prototype.getTypeName = function () {
            return "FreeCameraKeyboardWalkInput";
        };

        FreeCameraKeyboardWalkInput.prototype.getSimpleName = function () {
            return "keyboard";
        };
 
     camera.inputs.add(new FreeCameraKeyboardWalkInput());

    var FreeCameraSearchInput = function (touchEnabled) {
        if (touchEnabled === void 0) { touchEnabled = true; }
        this.touchEnabled = touchEnabled;
        this.buttons = [0, 1, 2];
        this.angularSensibility = 2000.0;
        this.restrictionX = 100;
        this.restrictionY = 60;
    }

    FreeCameraSearchInput.prototype.attachControl = function (element, noPreventDefault) {
        var _this = this;
        var engine = this.camera.getEngine();
        var angle = {x:0, y:0};
        if (!this._pointerInput) {
            this._pointerInput = function (p, s) {
                var evt = p.event;
                if (!_this.touchEnabled && evt.pointerType === "touch") {
                    return;
                }
                if (p.type !== BABYLON.PointerEventTypes.POINTERMOVE && _this.buttons.indexOf(evt.button) === -1) {          
                    return;
                }
                if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {          
                    try {
                        evt.srcElement.setPointerCapture(evt.pointerId);
                    }
                    catch (e) {
                        //Nothing to do with the error. Execution will continue.
                    }
                    _this.previousPosition = {
                        x: evt.clientX,
                        y: evt.clientY
                    };
                    if (!noPreventDefault) {
                        evt.preventDefault();
                        element.focus();
                    }
                }
                else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {          
                    try {
                        evt.srcElement.releasePointerCapture(evt.pointerId);
                    }
                    catch (e) {
                        //Nothing to do with the error.
                    }
                    _this.previousPosition = null;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
                else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {            
                    if (!_this.previousPosition || engine.isPointerLock) {
                        return;
                    }
                    var offsetX = evt.clientX - _this.previousPosition.x;
                    var offsetY = evt.clientY - _this.previousPosition.y;                   
                    angle.x +=offsetX;
                    angle.y -=offsetY;  
                    if(Math.abs(angle.x) > _this.restrictionX )  {
                        angle.x -=offsetX;
                    }
                    if(Math.abs(angle.y) > _this.restrictionY )  {
                        angle.y +=offsetY;
                    }       
                    if (_this.camera.getScene().useRightHandedSystem) {
                        if(Math.abs(angle.x) < _this.restrictionX )  {
                            _this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
                        }
                    }
                    else {
                        if(Math.abs(angle.x) < _this.restrictionX )  {
                            _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
                        }
                    }
                    if(Math.abs(angle.y) < _this.restrictionY )  {
                        _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
                    }
                    _this.previousPosition = {
                        x: evt.clientX,
                        y: evt.clientY
                    };
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
        }
        this._onSearchMove = function (evt) {       
            if (!engine.isPointerLock) {
                return;
            }       
            var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
            var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
            if (_this.camera.getScene().useRightHandedSystem) {
                _this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
            }
            else {
                _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
            }
            _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
            _this.previousPosition = null;
            if (!noPreventDefault) {
                evt.preventDefault();
            }
        };
        this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP | BABYLON.PointerEventTypes.POINTERMOVE);
        element.addEventListener("mousemove", this._onSearchMove, false);
    };

    FreeCameraSearchInput.prototype.detachControl = function (element) {
        if (this._observer && element) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            element.removeEventListener("mousemove", this._onSearchMove);
            this._observer = null;
            this._onSearchMove = null;
            this.previousPosition = null;
        }
    };

    FreeCameraSearchInput.prototype.getTypeName = function () {
        return "FreeCameraSearchInput";
    };

    FreeCameraSearchInput.prototype.getSimpleName = function () {
        return "MouseSearchCamera";
    };

    camera.inputs.add(new FreeCameraSearchInput());

    
    var holder = document.createElement("div");
    holder.style.position = "absolute";
    holder.style.top = "45%";
    holder.style.right = "5px";
    holder.style.width = "45%";
    holder.style.height = "70px";
    holder.style.backgroundColor = "#CDC8F9";
    holder.style.color = "#364249";
    holder.style.border = "solid 3px #364249";
    var prev = document.createElement("div");
    prev.style.width = "5%";
    prev.style.height = "95%";
    prev.innerHTML = "&#9664;"
    prev.style.fontSize = "2em";
    prev.style.cssFloat = "left";
    prev.style.cursor = "pointer";
    holder.appendChild(prev);
    var textBox = document.createElement("div");
    textBox.style.width = "80%";
    textBox.style.height = "95%";
    textBox.innerHTML = "Some Text"
    textBox.style.cssFloat = "left";
    textBox.style.marginLeft = "1em";
    holder.appendChild(textBox);
    var next = document.createElement("div");
    next.style.width = "5%";
    next.style.height = "95%";
    next.innerHTML = "&#9654;"
    next.style.fontSize = "2em";
    next.style.cssFloat = "left";
    next.style.cursor = "pointer";
    holder.appendChild(next);
    var extra = document.createElement("div");
    extra.style.width = "5%";
    extra.style.height = "95%";
    extra.style.marginTop = "20px";
    extra.style.marginLeft = "5px";
    extra.innerHTML = "&#9660;"
    extra.style.fontSize = "2em";
    extra.style.cssFloat = "left";
    extra.style.cursor = "pointer";
    holder.appendChild(extra);
    extra.active = false;
    sceneReset = false;

    document.body.appendChild(holder);

    var setExtra = function() {
        if (extra.active) {
            extra.innerHTML = "&#9660;"
            holder.style.backgroundColor = "#CDC8F9";
            tutorialAction();
        }
        else {
            extra.index = 100 * tutIndex;
            extra.innerHTML = "&#9650;"
            holder.style.backgroundColor = "#BBD18F";
            extraAction();
        }
        extra.active = !extra.active;
    }
    
    extra.addEventListener("click", setExtra, false);

    var pbt = new PBT();

    var tutIndex = 0;

    var goBack = function() {
        if(extra.active) {
            extra.index--
            extraAction();
        }
        else {
            tutIndex--
            tutorialAction();
        }
    }

    var goForward = function() {
        if(sceneReset) {
            camera.angle = Math.PI/2;
            camera.direction = new BABYLON.Vector3(Math.cos(camera.angle), 0, Math.sin(camera.angle));
            camera.position = new BABYLON.Vector3(0, 1, 0);
            camera.setTarget = new BABYLON.Vector3(0, 0, 1);
        }
        else {
            if(extra.active) {
                extra.index++
                extraAction();
            }
            else {
                tutIndex++;
                tutorialAction();
            }
        }
    }

    var interval;

    var extraFlash = function() {
        var theta = -Math.PI/2;
        interval = setInterval(function(){
            extra.style.color = "rgb(" + 255 * Math.cos(theta)+","+255 * Math.cos(theta)+","+255 * Math.cos(theta)+")";           
            theta += 0.05;
            if(theta > Math.PI/2) {
                theta = -Math.PI/2;
            } 
        } , 100)
    }

    var extraStopFlash = function() {
        clearInterval(interval);
        extra.style.color = "#364249";
    }

    prev.addEventListener("click", goBack, false);
    next.addEventListener("click", goForward, false);

    var tutorialAction = function() {
        switch(tutIndex) {
            case 0:
                prev.style.visibility = "hidden";
                next.style.visibility = "visible";     
                textBox.innerHTML = "<br>Camera Collisions and Input Management Tutorial";
                textBox.style.align = "center";
                holder.style.top = "80px";
                camera.detachControl(canvas);
                ground.setEnabled(false);
                lowerGround.setEnabled(false);
                cone.setEnabled(false);
                for(var i = 0; i < 23; i++) {
                    ellipse[i].setEnabled(false);
                }
                for(var i = 0; i < boxNb; i++) {
                    boxes[i].setEnabled(false);
                }
                extraFlash();
                pbt.clearDecorLines();
                pbt.hideLines([2, 1141]);
            break
            case 1:
                extraStopFlash();
                prev.style.visibility = "visible";
                next.style.visibility = "visible";
                extra.style.visibility = "visible";
                sceneReset = false;
                next.innerHTML = "&#9654;";
                textBox.innerHTML = "We will create a first person shooter type scene where you can turn using &larr; and &rarr; and move backwards and forwards with &darr; and &uarr;.";
                textBox.style.align = "left";
                holder.style.top = "80px";
                holder.style.width = "45%";
                holder.style.height = "70px";
                holder.style.right = "5px";
                camera.detachControl(canvas);
                ground.setEnabled(false);
                lowerGround.setEnabled(false);
                for(var i = 0; i < boxNb; i++) {
                    boxes[i].setEnabled(false);
                }
                pbt.clearDecorLines();
                pbt.hideLines([2, 1141]);
            break
            case 2:
                extra.style.visibility = "hidden";
                textBox.innerHTML = "Movement will be blocked by crates and looking around using the mouse will be limited.";
                pbt.clearDecorLines();
                pbt.hideLines([2, 1141]);
            break
            case 3:
                extra.style.visibility = "hidden";    
                textBox.innerHTML = "This is not the default so new input management scripts will be needed. Now we need to add in the camera and scene objects."
                pbt.clearDecorLines();
                pbt.hideLines([2, 1141]);
            break
            case 4:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";    
                extra.style.visibility = "visible";
                textBox.innerHTML = "Add the camera but not yet attatching control to the canvas...";
                pbt.clearDecorLines();
                pbt.setDecorLines([6, 7]);
                pbt.hideLines([]);
                pbt.hideLines([8, 1141])
            break
            case 5:
                extra.style.visibility = "hidden";    
                textBox.innerHTML = "... and the ability to collide and react to gravity.";
                pbt.clearDecorLines();
                pbt.setDecorLines([6, 6, 67, 68, 70, 71]);
                pbt.hideLines([]);
                pbt.hideLines([7, 65, 72, 1141])
            break
            case 6: 
                extra.style.visibility = "hidden";  
                textBox.innerHTML = "Surround the camera with the collision detecting ellipsoid imposter";
                cone.setEnabled(false);
                holder.style.top = "80px";
                holder.style.height = "70px";
                for(var i = 0; i < 23; i++) {
                    ellipse[i].setEnabled(false);
                }
                pbt.clearDecorLines();
                pbt.setDecorLines([6, 6, 73, 74]);
                pbt.hideLines([]);
                pbt.hideLines([7, 71, 75, 1141])
            break
            case 7:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";    
                extra.style.visibility = "visible";
                textBox.innerHTML = "Split the screen into two with the lower using a dummy camera and ellipsoid to show their position. ";
                holder.style.top = "45%";
                holder.style.height = "60px";
                ground.setEnabled(false);
                lowerGround.setEnabled(false);
                for(var i = 0; i < boxNb; i++) {
                    boxes[i].setEnabled(false);
                }
                cone.setEnabled(true);
                for(var i = 0; i < 23; i++) {
                    ellipse[i].setEnabled(true);
                }
            break
            case 8:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";
                extra.style.visibility = "visible";
                textBox.innerHTML = "Add in the grounds and boxes to collide with ...";
                ground.setEnabled(true);
                lowerGround.setEnabled(true);
                for(var i = 0; i < boxNb; i++) {
                    boxes[i].setEnabled(true);
                }
                pbt.clearDecorLines();
                pbt.setDecorLines([29, 29, 34, 34, 49, 49]);
                pbt.hideLines([]);
                pbt.hideLines([7, 26, 30, 32, 35, 47, 50, 1141]);
            break
            case 9:
                extra.style.visibility = "hidden"; 
                textBox.innerHTML = "... and make them collidable.";
                pbt.clearDecorLines();
                pbt.setDecorLines([29, 29, 34, 34, 49, 49, 52, 52, 95, 96]);
                pbt.hideLines([]);
                pbt.hideLines([7, 26, 30, 32, 35, 47, 50, 51, 54, 94, 97, 1141]);
            break
            case 10:
                extra.style.visibility = "hidden";    
                textBox.innerHTML = "Now for the input management. First remove the default management.";
                pbt.clearDecorLines();
                pbt.setDecorLines([98, 99]);
                pbt.hideLines([]);
                pbt.hideLines([7, 96, 100, 1141])
            break
            case 11:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";
                extra.style.visibility = "visible";    
                textBox.innerHTML = "First the Key Input Manager...";
                pbt.clearDecorLines();
                pbt.setDecorLines([101, 107]);
                pbt.hideLines([]);
                pbt.hideLines([7, 99, 108, 1141])
            break
            case 12:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";
                textBox.innerHTML = "... add attachment control....";
                pbt.clearDecorLines();
                pbt.setDecorLines([109, 147]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 148, 1141])
            break
            case 13:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";
                textBox.innerHTML = "...and add detachment control.";
                pbt.clearDecorLines();
                pbt.setDecorLines([149, 160]);
                pbt.hideLines([]);
                pbt.hideLines([7, 147, 161, 1141])
            break
            case 14:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";
                textBox.innerHTML = "Before adding keys movement control set camera parameters.";
                pbt.clearDecorLines();
                pbt.setDecorLines([9, 12]);
                pbt.hideLines([]);
                pbt.hideLines([7, 7, 13, 1141])
            break
            case 15:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";
                extra.style.visibility = "visible";
                textBox.innerHTML = "Now the keys movement control by checking inputs....";
                pbt.clearDecorLines();
                pbt.setDecorLines([162, 190]);
                pbt.hideLines([]);
                pbt.hideLines([2, 160, 191, 1141])
            break
            case 16:
                extra.style.visibility = "hidden";    
                textBox.innerHTML = "... and onLostFocus function...";
                pbt.clearDecorLines();
                pbt.setDecorLines([192, 194]);
                pbt.hideLines([]);
                pbt.hideLines([7, 191, 195, 1141])
            break
            case 17:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";
                extra.style.visibility = "visible"; 
                textBox.innerHTML = "... and the two required functions...";
                pbt.clearDecorLines();
                pbt.setDecorLines([196, 198, 200, 202]);
                pbt.hideLines([]);
                pbt.hideLines([7, 191, 203, 1141])
            break
            case 18:
                extra.style.visibility = "hidden";     
                textBox.innerHTML = "...and finally add the new keys input manager to the camera.";
                pbt.clearDecorLines();
                pbt.setDecorLines([204, 204]);
                pbt.hideLines([]);
                pbt.hideLines([7, 191, 205, 1141])
            break
            case 19:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";
                extra.style.visibility = "visible"; 
                textBox.innerHTML = "Secondly the Mouse Manager...";
                pbt.clearDecorLines();
                pbt.setDecorLines([206, 213]);
                pbt.hideLines([]);
                pbt.hideLines([7, 204, 214, 1141])
            break
            case 20:
                next.style.visibility = "visible"; 
                textBox.innerHTML = "... add attachment control which also contains the code to react to the input from the mouse ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([215, 313]);
                pbt.hideLines([]);
                pbt.hideLines([7, 213, 314, 1141])
            break
            case 21:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible";    
                textBox.innerHTML = "...and add detachment control....";
                pbt.clearDecorLines();
                pbt.setDecorLines([315, 323]);
                pbt.hideLines([]);
                pbt.hideLines([7, 313, 324, 1141])
            break
            case 22:
                next.style.visibility = "visible"; 
                prev.style.visibility = "visible"; 
                extra.style.visibility = "visible"; 
                textBox.innerHTML = "... and the two required functions...";
                pbt.clearDecorLines();
                pbt.setDecorLines([325, 327, 329, 331]);
                pbt.hideLines([]);
                pbt.hideLines([7, 323, 332, 1141])
            break
            case 23:
                extra.style.visibility = "hidden";
                textBox.innerHTML = "...and finally add the new mouse input manager to the camera...";
                camera.detachControl(canvas);
                pbt.clearDecorLines();
                pbt.setDecorLines([333, 333]);
                pbt.hideLines([]);
                pbt.hideLines([7, 331, 334, 1141])
            break
            case 24:
                sceneReset = false;
                next.innerHTML = "&#9654;";     
                textBox.innerHTML = "...and attach the control of the camera to the canvas. Remember to click on the canvas before using keys for movement.";
                camera.attachControl(canvas, true);
                pbt.clearDecorLines();
                pbt.setDecorLines([8, 8]);
                pbt.hideLines([]);
                pbt.hideLines([7, 7, 9, 1141]);
                
            break
            case 25:
                sceneReset = true;
                next.innerHTML = "&#8635;";
                textBox.innerHTML = "Now ready for your testing. Use &#8635; to reset if you fall off the edge";            
                pbt.clearDecorLines();
                pbt.hideLines([]);
                pbt.hideLines([334, 1141]); 
            break

        }
    }

    var extraAction = function() {
        switch(extra.index) {
            case 0:
                extraStopFlash();
                prev.style.visibility = "hidden";
                next.style.visibility = "hidden";    
                textBox.innerHTML = "&#9660; will bring up options or further details. &#9650; returns to main tutorial.";
                textBox.style.align = "left";
            break
            case 100:
                prev.style.visibility = "hidden";   
                textBox.innerHTML = "&#9654; to try out the scene.";
            break
            case 101:
                sceneReset = true;
                next.innerHTML = "&#8635;";
                textBox.innerHTML = "<p>Click inside scene before moving with keys</p>";    
                textBox.innerHTML += "Turn using &larr; and &rarr; and move backwards and forwards with &darr; and &uarr;<p> &#8635; will reset when you fall off the edge. </p>";
                textBox.innerHTML += "<p>Use the mouse to turn the camera. The turn is limited to represent limited head movement. After turning with the camera forward and backward movements will ";
                textBox.innerHTML += "be relative to the facing direction. The use of gravity will keep the camera from vertical movement when on the ground but will cause it to fall when moving off the ground. ";
                textBox.innerHTML += "The first fall will land on the green area. A fall off the green area is into space.</p>";
                holder.style.top = "49%";
                holder.style.width = "50%";
                holder.style.height = "49%";
                holder.style.right = "0px";
                camera.attachControl(canvas, true);
                ground.setEnabled(true);
                lowerGround.setEnabled(true);
                for(var i = 0; i < boxNb; i++) {
                    boxes[i].setEnabled(true);
                }
            break
            case 400:
                next.style.visibility = "hidden"; 
                prev.style.visibility = "hidden";    
                textBox.innerHTML = "camera.minZ needs to be a small non zero positive number to ensure collided objects remain in the camera's view.";
            break
            case 700:
                prev.style.visibility = "hidden";   
                textBox.innerHTML = "The dummy camera and ellipse are created using ...";
            break
            case 701:
                prev.style.visibility = "visible";   
                textBox.innerHTML = "...a cone mesh for the dummy camera parented to the camera and ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([24, 26]);
                pbt.hideLines([]);
                pbt.hideLines([7, 22, 27, 1141]);
            break
            case 702:
                prev.style.visibility = "visible";   
                textBox.innerHTML = "...a series of elliptical lines, parented to the camera, for the dummy ellipse.";
                pbt.clearDecorLines();
                pbt.setDecorLines([76, 81, 83, 92]);
                pbt.hideLines([]);
                pbt.hideLines([7, 74, 93, 1141]);
            break
            case 703:
                next.style.visibility = "visible";
                textBox.innerHTML = "The viewing camera of the dummy camera is set behind and above the main camera and parented to it. It looks forward and slightly down towards the main camera.";
                pbt.clearDecorLines();
                pbt.setDecorLines([14, 16]);
                pbt.hideLines([]);
                pbt.hideLines([7, 12, 17, 1141]);
            break
            case 704:
                next.style.visibility = "hidden";  
                textBox.innerHTML = "The screen is spilt into two by making both cameras active and using viewports.";
                pbt.clearDecorLines();
                pbt.setDecorLines([18, 19, 21, 22]);
                pbt.hideLines([]);
                pbt.hideLines([7, 16, 23, 1141]);
            break
            case 800:
                prev.style.visibility = "hidden";    
                next.style.visibility = "hidden";  
                textBox.innerHTML = "In fact several boxes are created by cloning the first box in a random circular pattern.";
                pbt.clearDecorLines();
                pbt.setDecorLines([49, 52, 54, 57, 59, 65]);
                pbt.hideLines([]);
                pbt.hideLines([7, 47, 66, 1141]);
            break
            case 1100:
                prev.style.visibility = "hidden";    
                next.style.visibility = "visible";  
                textBox.innerHTML = "Renamed for walking this is a direct copy of the <span style = 'font-weight:bold'>FreeCameraKeyboardMoveInput</span> used in the Babylon.js engine";
            break
            case 1101:
                prev.style.visibility = "visible";    
                next.style.visibility = "visible";  
                textBox.innerHTML = "The <span style = 'font-weight:bold'>_keys</span> property stores the one or more keys pressed.";
                pbt.clearDecorLines();
                pbt.setDecorLines([102, 102]);
                pbt.hideLines([]);
                pbt.hideLines([7, 99, 108, 1141]);
            break
            case 1102:   
                next.style.visibility = "hidden";  
                textBox.innerHTML = "Add properties for a range of key controls. For example the <span style = 'font-weight:bold'>keyUp</span> property stores the key code for the &uarr; and other key codes can be added in the array for the same result.";
                pbt.clearDecorLines();
                pbt.setDecorLines([103, 106]);
                pbt.hideLines([]);
                pbt.hideLines([7, 99, 108, 1141]);
            break
            case 1200:
                prev.style.visibility = "hidden";    
                next.style.visibility = "visible";  
                textBox.innerHTML = "Also a direct copy of the Babylon.js code this method attaches what happens when keys are pressed when a particular element has focus. For this project the element that will be later attached is the canvas element.";
            break
            case 1201:
                prev.style.visibility = "visible";    
                next.style.visibility = "visible";  
                textBox.innerHTML = "The <span style = 'font-weight:bold'>noPreventDefault</span> parameter determines if preventDefault() is called for the key press event. The default is to call it.";
                pbt.clearDecorLines();
                pbt.setDecorLines([109, 109, 122, 124]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 127, 1141]);
            break
            case 1202:    
                textBox.innerHTML = "Here <span style = 'font-weight:bold'>this</span> refers to the <span style = 'font-weight:bold'>FreeCameraKeyboardWalkInput</span> object and needs to be referenced by the <span style = 'font-weight:bold'>_this</span> variable ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([110, 110]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 127, 1141]);
            break
            case 1203:  
                textBox.innerHTML = "...because when the <span style = 'font-weight:bold'>keydown</span> or <span style = 'font-weight:bold'>keyup</span> occurs on the element any reference to <span style = 'font-weight:bold'>this</span> in the callback function refers to the listening element. ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([141, 142]);
                pbt.hideLines([]);
                pbt.hideLines([2, 140, 143, 1141]);
            break
            case 1204:     
                textBox.innerHTML =  "so the methods triggered by the listening element use the reference <span style = 'font-weight:bold'>_this</span> in <span style = 'font-weight:bold'>FreeCameraKeyboardWalkInput</span>";
                pbt.clearDecorLines();
                pbt.setDecorLines([113, 118, 120, 120, 127, 132, 134, 134]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 148, 1141]);
            break
            case 1205:     
                textBox.innerHTML =  "When the onKeyDown method does not exist for <span style = 'font-weight:bold'>FreeCameraKeyboardWalkInput</span> both onKeyDown and onKeyUp methods need to be added as well as the event listening.";
                pbt.clearDecorLines();
                pbt.setDecorLines([111, 111, 113, 113, 126, 127, 140, 147]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 110, 110, 112, 112, 114, 125, 128, 138, 148, 1141]);
            break
            case 1206:   
                next.style.visibility = "visible";  
                textBox.innerHTML = "To ensure the DOM element passed to <span style = 'font-weight:bold'>FreeCameraKeyboardWalkInput</span> can receive focus, as for example by default the canvas element cannot, set its tab index.";
                pbt.clearDecorLines();
                pbt.setDecorLines([112, 112]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 148, 1141]);
            break
            case 1207:  
                textBox.innerHTML = "When a key is down its code is checked to see if it is in any of the keysUp, keysDown, keysLeft and keysRight arrays ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([114, 117]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 141, 146, 148, 1141]);
            break
            case 1208:     
                textBox.innerHTML =  "... and if it is any of these check if it is already in the _keys array and if not put it in.";
                pbt.clearDecorLines();
                pbt.setDecorLines([118, 121]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 127, 146, 148, 1141]);
            break
            case 1209:   
                next.style.visibility = "visible";  
                textBox.innerHTML = "On key up checks if the key code is in one of the Up, Down, Left, or Right key arrays and if it is in the _keys array remove it.";
                pbt.clearDecorLines();
                pbt.setDecorLines([127, 135]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 141, 145, 148, 1141]);
            break
            case 1210:   
                next.style.visibility = "hidden";  
                textBox.innerHTML = "A built in Babylon.js tool us used to control the method used when focus is lost on the canvas.";
                pbt.clearDecorLines();
                pbt.setDecorLines([143, 145]);
                pbt.hideLines([]);
                pbt.hideLines([2, 107, 110, 140, 148, 1141]);
            break
            case 1300:
                prev.style.visibility = "hidden";    
                next.style.visibility = "hidden";  
                textBox.innerHTML = "Event listeners,registrations and methods removed, and array emptied. ";
            break
            case 1400:
                prev.style.visibility = "hidden";    
                next.style.visibility = "hidden"; 
                textBox.innerHTML = "Camera speed controls the distance forward or backward on a key press. Angular speed controls the angle turned. The smaller the value the less distance or angle travelled. Direction is the way the camera is looking.";
            break
            case 1500: 
                prev.style.visibility = "hidden";
                textBox.innerHTML = "A modified copy of the Babylon.js code for the <span style = 'font-weight:bold'>checkInputs</span> method it first checks for a key press ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([162, 163, 189, 190]);
                pbt.hideLines([]);
                pbt.hideLines([2, 160, 191, 1141])
            break
            case 1501: 
                prev.style.visibility = "visible";
                textBox.innerHTML = "... and assigns a camera variable rather than continually using <span style = 'font-weight:bold'>this.camera</span>.";
                pbt.clearDecorLines();
                pbt.setDecorLines([164, 164]);
                pbt.hideLines([]);
                pbt.hideLines([2, 160, 191, 1141])
            break
            case 1502: 
                textBox.innerHTML = "Any key being pressed is held in the <span style = 'font-weight:bold'>this._keys</span> array. All key codes in the array are looked at in turn ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([165, 166, 188, 188]);
                pbt.hideLines([]);
                pbt.hideLines([2, 160, 191, 1141])
            break
            case 1503: 
                prev.style.visibility = "visible";
                textBox.innerHTML = "... and should these be Up or Down keys the camera direction is set to forward or backward taking into account the speed ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([167, 167, 172, 174, 179, 181]);
                pbt.hideLines([]);
                pbt.hideLines([2, 160, 191, 1141])
            break
            case 1504: 
                textBox.innerHTML = "... and if they are Left and Right keys the direction is set to 0 and the camera rotation about y incremented.";
                pbt.clearDecorLines();
                pbt.setDecorLines([168, 171, 175, 178]);
                pbt.hideLines([]);
                pbt.hideLines([2, 160, 191, 1141])
            break
            case 1505:
                next.style.visibility = "visible"; 
                textBox.innerHTML = "When a right hnded system has been set the z direction of the camera is switched.";
                pbt.clearDecorLines();
                pbt.setDecorLines([182, 184]);
                pbt.hideLines([]);
                pbt.hideLines([2, 160, 191, 1141])
            break
            case 1506: 
                next.style.visibility = "hidden";
                textBox.innerHTML = "The final camera setting is achieved via its view matrix and its transformation matrix."
                pbt.clearDecorLines();
                pbt.setDecorLines([185, 187]);
                pbt.hideLines([]);
                pbt.hideLines([2, 160, 191, 1141])
            break
            case 1700:
                next.style.visibility = "hidden"; 
                prev.style.visibility = "hidden";
                textBox.innerHTML = "The getTypeName method giving the full name of the input manager and the getSimpleName should always be added.";
                pbt.clearDecorLines();
                pbt.setDecorLines([196, 198, 200, 202]);
                pbt.hideLines([]);
                pbt.hideLines([7, 191, 203, 1141])
            break
            case 1900:
                prev.style.visibility = "hidden";    
                next.style.visibility = "visible";  
                textBox.innerHTML = "Renamed for searching this method is a modified copy of <span style = 'font-weight:bold'>FreeCameraMouseInput</span>.";
                pbt.clearDecorLines();
                pbt.setDecorLines([206, 213]);
                pbt.hideLines([]);
                pbt.hideLines([7, 204, 214, 1141])
            break
            case 1901:
                prev.style.visibility = "visible";    
                next.style.visibility = "hidden";  
                textBox.innerHTML = "Restriction values have been added to limit local rotations about X and Y";
                pbt.clearDecorLines();
                pbt.setDecorLines([211, 212]);
                pbt.hideLines([]);
                pbt.hideLines([7, 204, 214, 1141]);
            break
            case 2000:
                prev.style.visibility = "hidden";    
                next.style.visibility = "visible";    
                textBox.innerHTML = "A modified copy of the Babylon.js code this method attaches what happens when the mouse moves over a particular element. For this project the element that will be later attached is the canvas element.";
                pbt.clearDecorLines();
                pbt.setDecorLines([215, 313]);
                pbt.hideLines([]);
                pbt.hideLines([2, 213, 314, 1141])
            break
            case 2001:
                prev.style.visibility = "visible";  
                textBox.innerHTML = "The <span style = 'font-weight:bold'>noPreventDefault</span> parameter determines if preventDefault() is called for a mouse event. The default is to call it.";
                pbt.clearDecorLines();
                pbt.setDecorLines([215, 215, 239, 242, 252, 254, 287, 289, 307, 309]);
                pbt.hideLines([]);
                pbt.hideLines([2, 213, 314, 1141]);
            break
            case 2002:     
                textBox.innerHTML =  "Here <span style = 'font-weight:bold'>this</span> refers to the <span style = 'font-weight:bold'>FreeCameraSearchInput</span> object and needs to be referenced by the <span style = 'font-weight:bold'>_this</span> variable ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([216, 216]);
                pbt.hideLines([]);
                pbt.hideLines([2, 213, 217, 310, 314, 1141]);
            break
            case 2003:     
                textBox.innerHTML =  "...because when a <span style = 'font-weight:bold'>mouse event</span> occurs on the element any reference to <span style = 'font-weight:bold'>this</span> in the callback functions refer to the listening element or observer...";
                pbt.clearDecorLines();
                pbt.setDecorLines([311, 312]);
                pbt.hideLines([]);
                pbt.hideLines([2, 213, 217, 310, 314, 1141]);
            break
            case 2004:     
                textBox.innerHTML =  "So the methods triggered by the listening and observer object use the reference <span style = 'font-weight:bold'>_this</span> in <span style = 'font-weight:bold'>FreeCameraSearchInput</span>";
                pbt.clearDecorLines();
                pbt.setDecorLines([216, 216, 222, 222, 225, 225, 235, 235, 251, 251, 257, 257, 260, 261, 264, 264, 267, 267, 270, 272, 276, 277, 280, 281, 283, 283, 299, 300, 303, 303, 305, 306]);
                pbt.hideLines([]);
                pbt.hideLines([2, 213, 308, 1141]);
            break
            case 2005:     
                textBox.innerHTML =  "When the _pointerInput method does not exist for the observer it needs to be added.";
                pbt.clearDecorLines();
                pbt.setDecorLines([219, 292]);
                pbt.hideLines([]);
                pbt.hideLines([2, 213, 216, 218, 293, 312, 314, 1141]);
            break
            case 2006:     
                textBox.innerHTML = "The <span style = 'font-weight:bold'>_pointerInput</span> method checks on three state Up, Down and Move.";
                pbt.clearDecorLines();
                pbt.setDecorLines([225, 225, 228, 228, 244, 244, 256, 256]);
                pbt.hideLines([]);
                pbt.hideLines([2, 213, 216, 224, 229, 242, 245, 254, 257, 289, 291, 312, 314, 1141]);
            break
            case 2007:  
                textBox.innerHTML = "POINTERDOWN for a mouse down or touched event captures the pointer position before it moves. ";
                pbt.clearDecorLines();
                pbt.setDecorLines([228, 228, 235, 238]);
                pbt.hideLines([]);
                pbt.hideLines([2, 227, 244, 1141]);
            break
            case 2008:     
                textBox.innerHTML =  "POINTERUP stops capturing movement and position";
                pbt.clearDecorLines();
                pbt.setDecorLines([244, 244, 251, 251]);
                pbt.hideLines([]);
                pbt.hideLines([2, 243, 256, 1141]);
            break
            case 2009:     
                textBox.innerHTML = "POINTERMOVE requires a mouse down or touched event to move the camera ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([256, 256, 290, 290]);
                pbt.hideLines([]);
                pbt.hideLines([2, 255, 291, 1141]);
            break
            case 2010:     
                textBox.innerHTML = "... because if <span style = 'font-weight:bold'>engine.isPointerLock</span> is <span style = 'font-weight:bold'>true</span> the function is not entered.";
                pbt.clearDecorLines();
                pbt.setDecorLines([256, 259, 290, 290]);
                pbt.hideLines([]);
                pbt.hideLines([2, 255, 291, 1141]);
            break
            case 2011:
                textBox.innerHTML = "To limit the camera movement an angle object is zeroed on entry ... ";
                pbt.clearDecorLines();
                pbt.setDecorLines([218, 218]);
                pbt.hideLines([]);
                pbt.hideLines([2, 213, 216, 217, 219, 255, 291, 1141]);
            break
            case 2012:
                textBox.innerHTML =  "... and when outside the range angle.x and angle.y are kept on the outer edge just beyond the range...";
                pbt.clearDecorLines();
                pbt.setDecorLines([260, 269, 283, 286]);
                pbt.hideLines([]);
                pbt.hideLines([2, 255, 291, 1141]);
            break
            case 2013:     
                textBox.innerHTML = "While POINTERMOVE deals with <span style = 'font-weight:bold'>engine.isPointerLock = false</span> the <span style = 'font-weight:bold'>_onSearchMove</span> method deals with the alternative ...";
                pbt.clearDecorLines();
                pbt.setDecorLines([293, 310]);
                pbt.hideLines([]);
                pbt.hideLines([2, 292, 311, 1141]);
            break
            case 2014:
                next.style.visibility = "visible";     
                textBox.innerHTML = "... since <span style = 'font-weight:bold'>engine.isPointerLock</span> is <span style = 'font-weight:bold'>false</span> by default the function returns without further execution.";
                pbt.clearDecorLines();
                pbt.setDecorLines([294, 296]);
                pbt.hideLines([]);
                pbt.hideLines([2, 292, 311, 1141]);
            break
            case 2015:
                next.style.visibility = "hidden";     
                textBox.innerHTML = "No restrictions are set for camera movement as this method is not used by default.";
                pbt.clearDecorLines();
                pbt.setDecorLines([297, 306]);
                pbt.hideLines([]);
                pbt.hideLines([2, 292, 311, 1141]);
            break
            case 2100:
                prev.style.visibility = "hidden";    
                next.style.visibility = "hidden";  
                textBox.innerHTML = "Observer, event listener and their methods removed. ";
            break
            case 2200:
                next.style.visibility = "hidden"; 
                prev.style.visibility = "hidden";
                textBox.innerHTML = "The getTypeName method giving the full name of the input manager and the getSimpleName should always be added.";
            break
        }
    }

    tutorialAction();    

    pbt.hideMenu();
    pbt.editOff();

    return scene;
}