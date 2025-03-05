  import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';



    window.goBack = function(){const urlParams = new URLSearchParams(window.location.search);
    const jointType = urlParams.get('joint');

    // Construct the href for the back button
    document.getElementById('back-button').onclick = function() {
        window.location.href = `menu.html?joint=${jointType.toLowerCase()}`;
    };
}






        let scene, camera, renderer, controls, mixer, clock;
        let animationSpeed=0.5;
        let initialCameraPosition, initialCameraRotation;
        let totalDuration = 1; // Store total duration of the animation
        let modelCenter = new THREE.Vector3();
        let isPlaying = false; // Track whether animation is playing
        let smaller=false;
        let previousTime = 0; // Initialize previousTime
        const minDistance = 0.1; // Minimum distance from the object
        const maxDistance=5;
        let boundingBox; // Declare this at the beginning with other global variables
        let upperLegJoint, footJoint; // Declare these as global variables
        const leftUpLegBones = [];
        const leftElbowBones=[];
        const leftKneeBones=[];
        const hipBones=[];
  
        const rightShoulderBones=[];
        const rightElbowBones=[];
        const rightUpLegBones=[];
        let showSkeleton=false;
        let skeletonHelpers = [];
       

        window.onload = function() {
            goBack();
    setMarkerPositions(); // Call it to set initial positions on load
    adjustRendererSize(); // Adjust size initially
    window.addEventListener('resize', adjustRendererSize); // Add resize event listener
    document.getElementById('ambient-light-control').addEventListener('input', function () {
                const intensity = parseFloat(this.value);
                ambientLight.intensity = intensity;
                document.getElementById('ambient-light-display').textContent = intensity.toFixed(1);
            });
};

function adjustRendererSize() {
    if (window.innerWidth <= 1100) {
        renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
        setMarkerPositions();
    } else {
        renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
        setMarkerPositions();
    }
}
        function init(modelFile, modelName) {
            scene = new THREE.Scene();
            const boneGroup = new THREE.Group(); // Initialize boneGroup
scene.add(boneGroup);

            scene.background = new THREE.Color(0xeeeeee);

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0.5, 3);

             // Set the camera's near and far clipping planes
             camera.near = 0.001; // Set to a small value
             camera.far = 1000; // Set far value as needed
 
              // Update the camera's projection matrix to apply the changes
              camera.updateProjectionMatrix();

            initialCameraPosition = camera.position.clone();
            initialCameraRotation = camera.rotation.clone();

            // renderer = new THREE.WebGLRenderer({ antialias: true });
            // renderer.setPixelRatio( window.devicePixelRatio );
            // Replace your current renderer with:
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                powerPreference: "high-performance",
                logarithmicDepthBuffer: true  // Helps with depth precision
            });
            renderer.setPixelRatio(window.devicePixelRatio * 1.5); // Increase pixel ratio

            //neww 

            renderer.domElement.id = 'threejs-canvas';
// document.getElementById('canvas-container').appendChild(renderer.domElement);



            renderer.outputEncoding = THREE.sRGBEncoding;
            //renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
            //document.getElementById('viewer-container').appendChild(renderer.domElement);
            document.getElementById('viewer-container').appendChild(renderer.domElement);

           

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = true;
            controls.enablePan = true;
            controls.panSpeed = 1.0;
            controls.minDistance = minDistance; //zoom distance
           controls.maxDistance = maxDistance; //zoom distance
          

controls.minPolarAngle = -Math.PI*2; // Looking straight up
controls.maxPolarAngle =Math.PI*2; // Looking straight down

controls.minAzimuthAngle = -Infinity; // Rotate left
controls.maxAzimuthAngle = Infinity; // Rotate right
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 10, 7.5);
            scene.add(directionalLight);

            clock = new THREE.Clock();

            const loader = new FBXLoader();
            const urlParams = new URLSearchParams(window.location.search);

            loader.load(modelFile, (object) => {
                mixer = new THREE.AnimationMixer(object);
                 // Create a group to hold the specific bones
  

                 
                if (object.animations && object.animations.length > 0) {
                    const action = mixer.clipAction(object.animations[0]);
                    action.play();
                    totalDuration = action.getClip().duration;
                    document.getElementById('timeline').max = totalDuration;
                }
                

    //               // Create a skeleton helper to visualize the bones
    // const skeletonHelper = new THREE.SkeletonHelper(object);
    // skeletonHelper.visible = true; // Set to true to see the skeleton
    // scene.add(skeletonHelper);
                   

  

                // Fix the comparison operator
                
                if (urlParams.get('joint') === 'ankle' && urlParams.get('choice') === 'injury') {
                    object.scale.set(0.005, 0.005, 0.005);
                   
                    if(urlParams.get('modelName') === 'Inversion')
                    {
                //object.position.z = 2.5;
                  //   object.position.x = 2;  
                    object.position.y = 0.3;
                        object.rotation.y = 0.1;
                        object.rotation.z = -0.025;
                      
                       
                    }
                    if(urlParams.get('modelName') === 'Eversion Abduction')
                    {object.position.z = -1.5;
                       // object.position.x = 0.5;
                       // object.position.y = 0.2; // Lower the model's y position
                        object.rotation.y = -0.1;
                       // object.scale.set(0.0045, 0.0045, 0.0045);
                                        
                       
                    }

                    if(urlParams.get('modelName') === 'Eversion')
                    { object.position.y = 0.3;
                        object.rotation.y = 0.1;
                        object.rotation.z = -0.025;
                        
                      
                       
                    }
                    if(urlParams.get('modelName') === 'Eversion Plantarflexion')
                     {
                         object.position.y = 0.7;
                    //     object.position.x = -0.5;
                        object.rotation.y = 0.1;
                     //object.position.z = -1;
                      object.scale.set(0.005, 0.005, 0.005);
                        
                    }

                    if(urlParams.get('modelName') === 'Inversion Abduction Dorsiflexion')
                    { 
                        object.scale.set(0.0045, 0.0045, 0.0045);
                        object.position.z = -1;
                        

                        
                        
                    }

                } else {
                    object.scale.set(0.01, 0.01, 0.01);
                    object.position.y = -0.3; // Lower the model's y position
                    if(urlParams.get('modelName') === 'ACL Injury')
                    { 
                        object.scale.set(0.007, 0.007, 0.007);
                        object.position.z = -1;                     
                        
                    }
                    if(urlParams.get('modelName') === 'Posterior Dislocation')
                    { 
                       // object.scale.set(0.007, 0.007, 0.007);
                        object.position.z = -3;                     
                        
                    }

                }

                if (urlParams.get('joint') === 'ankle' && urlParams.get('choice') === 'movement') {
                    if(urlParams.get('modelName') === 'Plantarflexion'||urlParams.get('modelName') === 'Dorsiflexion'){
                        object.rotation.y =1.5;
                        object.rotation.x =0;
                        object.position.y= 0.2;
                        object.position.z = 1.1;
                    

                    }
                    else{
                    object.rotation.y =0;
                    object.rotation.x =1.7;
                    object.position.z = -0.2;
                    object.position.y= 0.2;
                    object.scale.set(0.015, 0.015, 0.015);
                    }
                    // object.rotation.y =0.6;
                  
                    // object.position.y = 0.2;
                    console.log('Position after setting:', object.position); // Debugging line
                  }
                // Traverse the loaded object
    object.traverse((child) => {

        console.log('Traversing child:', child); // Debugging line
        if (!child) {
            console.error('Child is undefined');
            return;
        }

        child.frustumCulled = false; // Disable frustum culling

        if (child.isBone){
            if(urlParams.get('joint') === 'ankle' && child.name=== 'LeftUpLeg' ) { 
                console.log("bone found");
                
                leftUpLegBones.push(child); // Add bone to the array
                console.log("bone pushed", leftUpLegBones); 
            //     const label = createJointLabel('Left Up Leg', child.position.clone());
            // scene.add(label);       
            }

            if(urlParams.get('joint') === 'ankle' && child.name=== 'RightUpLeg' ) { 
                console.log("bone found");
                
                rightUpLegBones.push(child); // Add bone to the array
                console.log("bone pushed", rightUpLegBones);    
                // const label = createJointLabel('Right Up Leg', child.position.clone());
                // scene.add(label);    
            }



            if(urlParams.get('joint') === 'knee' && child.name=== 'RightUpLeg' ) { 
                console.log("bone found");
                
                leftKneeBones.push(child); // Add bone to the array
                console.log("bone pushed", leftKneeBones);        
            }

            if(urlParams.get('joint') === 'hip' && child.name=== 'LeftUpLeg' ) { 
                console.log("bone found");
                
                hipBones.push(child); // Add bone to the array
                console.log("bone pushed", hipBones);        
            }


            if(urlParams.get('joint') === 'elbow' && child.name=== 'LeftArm' ) { 
                console.log("bone found");
                
                leftElbowBones.push(child); // Add bone to the array
                console.log("bone pushed", leftElbowBones);        
            }

            if(urlParams.get('joint') === 'elbow' && child.name=== 'RightArm' ) { 
                console.log("bone found");
                
                rightElbowBones.push(child); // Add bone to the array
                console.log("bone pushed", rightElbowBones);        
            }

            if(urlParams.get('joint') === 'shoulder' && child.name=== 'RightShoulder' ) { 
                console.log("bone found");
                
                rightShoulderBones.push(child); // Add bone to the array
                console.log("bone pushed", hipBones);        
            }
        }

        
        
    
    
        if (child.isMesh) {
            // Check if the mesh has one or multiple materials
            if (Array.isArray(child.material)) {
                // If there are multiple materials
                child.material.forEach((material) => {
                    material.depthTest = true; // Enable depth testing
                    material.transparent = false; // Set to true if transparency is needed
                    child.frustumCulled = false; 
                   material.side = THREE.DoubleSide; // Use double-sided rendering
                });
            } else {
                // If there is a single material
                child.material.depthTest = true; // Enable depth testing
                child.material.transparent = false; // Set to true if transparency is needed
                child.frustumCulled = false; 
                child.material.side = THREE.DoubleSide; // Use double-sided rendering
            }
        }

        
    });
                 
                 
    document.getElementById('highlight').addEventListener('click', function() {

        
        if (showSkeleton ==false){showSkeleton =true;          
            document.getElementById('highlight').innerHTML = '👁️Highlight';
            
           
            } 
        else if(showSkeleton ==true){showSkeleton =false;
            document.getElementById('highlight').innerHTML = '🚫Highlight';
            
        } // Toggle showSkeleton
    
        // Clear existing skeleton helpers from the scene
        if (!showSkeleton) {
            skeletonHelpers.forEach(helper => {
                scene.remove(helper);
            });
            skeletonHelpers = []; // Clear the array
        } else {

if(urlParams.get('joint') === 'ankle'){

    if ( urlParams.get('choice') === 'injury'){
        leftUpLegBones.forEach(bone => {
            const skeletonHelper = new THREE.SkeletonHelper(bone);
        skeletonHelper.visible = true; // Set to true to see the skeleton
        scene.add(skeletonHelper);
        skeletonHelpers.push(skeletonHelper);
    });    
     }
     else{  
        rightUpLegBones.forEach(bone => {
        const skeletonHelper = new THREE.SkeletonHelper(bone);
    skeletonHelper.visible = true; // Set to true to see the skeleton
    scene.add(skeletonHelper);
    skeletonHelpers.push(skeletonHelper);});

}


}


if(urlParams.get('joint') === 'shoulder'){

    rightShoulderBones.forEach(bone => {
        const skeletonHelper = new THREE.SkeletonHelper(bone);
    skeletonHelper.visible = true; // Set to true to see the skeleton
    scene.add(skeletonHelper);
    skeletonHelpers.push(skeletonHelper);
});
  console.log('BoneGroup contents:', boneGroup.children); // Debugging line
}

if(urlParams.get('joint') === 'hip'){

    hipBones.forEach(bone => {
        const skeletonHelper = new THREE.SkeletonHelper(bone);
    skeletonHelper.visible = true; // Set to true to see the skeleton
    scene.add(skeletonHelper);
    skeletonHelpers.push(skeletonHelper);
});
  console.log('BoneGroup contents:', boneGroup.children); // Debugging line
}

if(urlParams.get('joint') === 'knee'){

    leftKneeBones.forEach(bone => {
        const skeletonHelper = new THREE.SkeletonHelper(bone);
    skeletonHelper.visible = true; // Set to true to see the skeleton
    scene.add(skeletonHelper);
    skeletonHelpers.push(skeletonHelper);
});
  console.log('BoneGroup contents:', boneGroup.children); // Debugging line
}





if(urlParams.get('joint') === 'elbow'){
 if ( urlParams.get('choice') === 'injury'){
    leftElbowBones.forEach(bone => {
        const skeletonHelper = new THREE.SkeletonHelper(bone);
    skeletonHelper.visible = true; // Set to true to see the skeleton
    scene.add(skeletonHelper);
    skeletonHelpers.push(skeletonHelper);
});    
 }
 else{  
    rightElbowBones.forEach(bone => {
    const skeletonHelper = new THREE.SkeletonHelper(bone);
skeletonHelper.visible = true; // Set to true to see the skeleton
scene.add(skeletonHelper);
skeletonHelpers.push(skeletonHelper);});
}
    
  console.log('BoneGroup contents:', boneGroup.children); // Debugging line
}

}
});

    scene.add(object);
  
            }, undefined, (error) => {
                console.error('An error occurred while loading the FBX model:', error);
            });

            window.addEventListener('resize', onWindowResize, false);
            animate();
            setMarkerPositions();
            checkCameraDistance();


            
//description
if (urlParams.get('joint') === 'shoulder' && urlParams.get('choice') === 'movement') {
    const modelName = urlParams.get('modelName');

    switch (modelName) {
        case 'Abduction':
            document.getElementById('description-content').innerHTML = "<b>Shoulder Action:</b> Abduction <br> <b>Kinematic Plane:</b> Frontal plane &nbsp; <b>Range of Motion:</b> 0°- 180°";
            break;
        case 'Adduction':
            document.getElementById('description-content').innerHTML = "<b>Shoulder Action:</b> Adduction <br> <b>Kinematic Plane:</b> Frontal plane &nbsp; <b>Range of Motion:</b> 0°- 30°";
            break;
        case 'Flexion':
            document.getElementById('description-content').innerHTML = "<b>Shoulder Action:</b> Flexion <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 0°- 180°";
            break;
        case 'Extension':
            document.getElementById('description-content').innerHTML = "<b>Shoulder Action:</b> Extension <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 0°- 65°(actively)/80°（passively)";
            break;
        case 'Internal Rotation':
            document.getElementById('description-content').innerHTML = "<b>Shoulder Action:</b> Internal rotation <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 75°/80°";
            break;
        case 'External Rotation':
            document.getElementById('description-content').innerHTML = "<b>Shoulder Action:</b> External rotation <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 60°/70°";
            break;
        // case 'Horizontal abduction':
        //     document.getElementById('description-content').innerHTML = "<b>Shoulder Action:</b> Horizontal abduction <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 40°";
        //     break;
        // case 'Horizontal adduction':
        //     document.getElementById('description-content').innerHTML = "<b>Shoulder Action:</b> Horizontal adduction <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 130°";
        //     break;
        default:
            document.getElementById('description-content').innerHTML = "Invalid action selected.";
            break;
    }
}
if (urlParams.get('joint') === 'elbow' && urlParams.get('choice') === 'movement') {
    const modelName = urlParams.get('modelName');

    switch (modelName) {
        case 'Flexion':
            document.getElementById('description-content').innerHTML = "<b>Elbow Action:</b> Flexion (elbow) <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 0°- 150°";
            break;
        case 'Extension':
            document.getElementById('description-content').innerHTML = "<b>Elbow Action:</b> Extension (elbow) <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 150°- 0°";
            break;
        case 'Pronation':
            document.getElementById('description-content').innerHTML = "<b>Elbow Action:</b> Pronation (radioulnar) <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 75°";
            break;
        case 'Supination':
            document.getElementById('description-content').innerHTML = "<b>Elbow Action:</b> Supination (radioulnar) <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 85°";
            break;
        default:
            document.getElementById('description-content').innerHTML = "Invalid action selected.";
            break;
    }
}

if (urlParams.get('joint') === 'hip' && urlParams.get('choice') === 'movement') {
    const modelName = urlParams.get('modelName');

    switch (modelName) {
        case 'Flexion':
            document.getElementById('description-content').innerHTML = "<b>Hip Action:</b> Flexion <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 0°- 120°";
            break;
        case 'Extension':
            document.getElementById('description-content').innerHTML = "<b>Hip Action:</b> Extension <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 0°- 30°";
            break;
        case 'Abduction':
            document.getElementById('description-content').innerHTML = "<b>Hip Action:</b> Abduction <br> <b>Kinematic Plane:</b> Frontal plane &nbsp; <b>Range of Motion:</b> 0°- 45°";
            break;

        case 'Adduction':
            document.getElementById('description-content').innerHTML = "<b>Hip Action:</b> Abduction <br> <b>Kinematic Plane:</b> Frontal plane &nbsp; <b>Range of Motion:</b> 0°- 20°";
            break;
        case 'Internal Rotation':
            document.getElementById('description-content').innerHTML = "<b>Hip Action:</b> Internal rotation <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 35°";
            break;
        case 'External Rotation':
            document.getElementById('description-content').innerHTML = "<b>Hip Action:</b> External rotation <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 45°";
            break;
        default:
            document.getElementById('description-content').innerHTML = "Invalid action selected.";
            break;
    }
}

if (urlParams.get('joint') === 'knee' && urlParams.get('choice') === 'movement') {
    const modelName = urlParams.get('modelName');

    switch (modelName) {
        case 'Flexion':
            document.getElementById('description-content').innerHTML = "<b>Knee Action:</b> Flexion <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 0°- 140°";
            break;
        case 'Extension':
            document.getElementById('description-content').innerHTML = "<b>Knee Action:</b> Extension <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 5°- 10° hyperextension";
            break;
        case 'External Rotation':
            document.getElementById('description-content').innerHTML = "<b>Knee Action:</b> External rotation (only when knee is flexed 20°- 30° or more) <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 30°";
            break;
        case 'Internal Rotation':
            document.getElementById('description-content').innerHTML = "<b>Knee Action:</b> Internal rotation (only when knee is flexed 20°- 30° or more) <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 15°";
            break;
        case 'Abduction':
            document.getElementById('description-content').innerHTML = "<b>Knee Action:</b> Abduction <br> <b>Kinematic Plane:</b> Not Valid &nbsp; <b>Range of Motion:</b> Not Valid";
            break;
        case 'Adduction':
            document.getElementById('description-content').innerHTML = "<b>Knee Action:</b> Adduction <br> <b>Kinematic Plane:</b> Not Valid &nbsp; <b>Range of Motion:</b> Not Valid";
            break;
        default:
            document.getElementById('description-content').innerHTML = "Invalid action selected.";
            break;
    }
}

if (urlParams.get('joint') === 'ankle' && urlParams.get('choice') === 'movement') {
    const modelName = urlParams.get('modelName');

    switch (modelName) {
        case 'Dorsiflexion':
            document.getElementById('description-content').innerHTML = "<b>Ankle Action:</b> Dorsiflexion <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 0°- 20°";
            break;
        case 'Plantarflexion':
            document.getElementById('description-content').innerHTML = "<b>Ankle Action:</b> Plantar flexion <br> <b>Kinematic Plane:</b> Sagittal plane &nbsp; <b>Range of Motion:</b> 0°- 50°";
            break;
        case 'Inversion':
            document.getElementById('description-content').innerHTML = "<b>Ankle Action:</b> Inversion <br> <b>Kinematic Plane:</b> Frontal plane &nbsp; <b>Range of Motion:</b> 0°- 25°";
            break;
        case 'Eversion':
            document.getElementById('description-content').innerHTML = "<b>Ankle Action:</b> Eversion <br> <b>Kinematic Plane:</b> Frontal plane &nbsp; <b>Range of Motion:</b> 0°- 12°";
            break;
        case 'Pronation':
            document.getElementById('description-content').innerHTML = "<b>Ankle Action:</b> Pronation <br> <b>Kinematic Plane:</b> (Cannot be measured accurately) Eversion + Dorsiflexion + Abduction";
            break;
        case 'Supination':
            document.getElementById('description-content').innerHTML = "<b>Ankle Action:</b> Supination <br> <b>Kinematic Plane:</b> (Cannot be measured accurately) Inversion + Plantarflexion + Adduction";
            break;
        case 'Abduction':
            document.getElementById('description-content').innerHTML = "<b>Ankle Action:</b> Abduction <br> <b>Kinematic Plane:</b> Horizontal plane plane &nbsp; <b>Range of Motion:</b> 0°- 10°/15°";
            break;
        case 'Adduction':
            document.getElementById('description-content').innerHTML = "<b>Ankle Action:</b> Adduction <br> <b>Kinematic Plane:</b> Horizontal plane &nbsp; <b>Range of Motion:</b> 0°- 20°/30°";
            break;
        default:
            document.getElementById('description-content').innerHTML = "Invalid action selected.";
            break;
    }
}





//update document title, aniamtion speed, ui
            if (modelName === "Eversion") {
                document.title = "Eversion";
                animationSpeed = 0.3; 
                document.getElementById('speed-control').value = animationSpeed; // Update slider value
                document.getElementById('speed-display').textContent = animationSpeed + "x"; // Update display
            } else if (modelName === "Inversion") {
                document.title = "Inversion";
                animationSpeed = 0.3; // Set to 0.3 for Injury 2
                document.getElementById('speed-control').value = animationSpeed; // Update slider value
                document.getElementById('speed-display').textContent = animationSpeed + "x"; // Update display
            } 
            else if (modelName === "Elbow Fully Extended") {
                document.title = "Outstretched Hand";
                document.getElementById('speed-control').value = animationSpeed; // Update slider value
                document.getElementById('speed-display').textContent = animationSpeed + "x"; // Update display
            }
            
            else {
                document.title = modelName;
                animationSpeed = 0.5; // Default value for other models
                document.getElementById('speed-control').value = animationSpeed; // Update slider value
                document.getElementById('speed-display').textContent = animationSpeed + "x"; // Update display
            }

            document.getElementById('ambient-light-control').addEventListener('input', function () {
                const intensity = parseFloat(this.value);
                ambientLight.intensity = intensity;
                document.getElementById('ambient-light-display').textContent = intensity.toFixed(1);
            });
            
            // Timeline control event
            const timeline = document.getElementById('timeline');
            timeline.addEventListener('input', function () {
                const time = parseFloat(this.value);
                if (mixer) {
                    mixer.setTime(time);
                }
                const percentage = (time / totalDuration) * 100;
                document.getElementById('timeline-value').textContent = `${Math.round(percentage)}%`;
            });

            // Play button event
            document.getElementById('play-button').addEventListener('click', function() {
                isPlaying = true; // Set isPlaying to true
            });

            // Stop button event
            document.getElementById('stop-button').addEventListener('click', function() {
                isPlaying = false; // Set isPlaying to false
            });
        }

        function adjustlight(){
            const intensity = parseFloat(this.value);
                ambientLight.intensity = intensity;
                document.getElementById('ambient-light-display').textContent = intensity.toFixed(1);
        }

        const urlParams = new URLSearchParams(window.location.search);
let specialMoments = {
    shoulder: {
        "Anterior Dislocation": [
            { time: 31, label: "Injury<br>Start" },
            { time: 51, label: "Injury<br>End" }
        ], 
        "Posterior Dislocation": [
            { time: 77, label: "Injury<br>Start" },
            { time: 100, label: "Injury<br>End" }
        ]
    }, 
    elbow: {
        "Valgus Overload": [
            { time: 40, label: "Injury<br>Start" },
            { time: 57, label: "Injury<br>End" }
        ], 
        "Elbow Fully Extended": [
            { time: 59, label: "Injury<br>Start" },
            { time: 70, label: "Injury<br>End" }
        ],
    },

    knee: {
        "ACL Injury": [
            { time: 60, label: "Injury<br>Start" },
            { time: 71, label: "Injury<br>End" }
        ], 
        
    },

    ankle: {
        "Eversion": [
            { time: 65, label: "Injury<br>Start" },
            { time: 77, label: "Injury<br>End" }
        ], 
        "Eversion Abduction": [
            { time: 64, label: "Injury<br>Start" },
            { time: 85, label: "Injury<br>End" }
        ],

        "Eversion Dorsiflexion": [
            { time: 52, label: "Injury<br>Start" },
            { time: 74, label: "Injury<br>End" }
        ],

        "Eversion Plantarflexion": [
            { time: 11, label: "Injury<br>Start" },
            { time: 38, label: "Injury<br>End" }
        ],

        "Inversion": [
            { time: 74, label: "Injury<br>Start" },
            { time: 85, label: "Injury<br>End" }
        ],

        "Inversion Abduction Dorsiflexion": [
            { time: 69, label: "Injury<br>Start" },
            { time: 92, label: "Injury<br>End" }
        ],

        "Inversion Adduction Plantarflexion": [
            { time: 62, label: "Injury<br>Start" },
            { time: 88, label: "Injury<br>End" }
        ],

        "Inversion Dorsiflexion": [
            { time: 54, label: "Injury<br>Start" },
            { time: 74, label: "Injury<br>End" }
        ],
    }



};

let totaltimeline = 100; // Example total duration for calculation



function hasSpecialMoments(bodyPart, name, choice) {
    if (!specialMoments[bodyPart] || choice=="movement") {
        console.warn(`No special moments found for body part: ${bodyPart}`);
        return false;
    }
    if (!specialMoments[bodyPart][name]||choice=="movement") {
        console.warn(`No special moments found for model: ${name} in body part: ${bodyPart}`);
        return false;
    }
    return true;
}


function setMarkerPositions() {
    const markersContainer = document.getElementById('markers-container');
    
    
    const timeline = document.getElementById('timeline');
    const timelineWidth = timeline.offsetWidth;

    markersContainer.innerHTML = ''; // Clear existing markers

    if (hasSpecialMoments(urlParams.get('joint'),urlParams.get('modelName'), urlParams.get('choice') )){
        let moments = specialMoments[urlParams.get('joint')][urlParams.get('modelName')];
        moments.forEach(moment => {
            // Create marker
            const marker = document.createElement('div');
            marker.className = 'marker';
           

            // Calculate position based on total duration
            const positionPercentage = (moment.time / totaltimeline) * 100;
            const positionPixels = (positionPercentage / 100) * timelineWidth;

            // Set marker position
            marker.style.left = `${positionPixels}px`;
           // marker.title = moment.label;

            // Create label for the marker
            const label = document.createElement('div');
            label.className = 'marker-label'; // Add a class for styling
            label.innerHTML = moment.label; // Set the text to the marker's label
            label.style.position = 'absolute'; // Position it absolutely
            label.style.left = `${positionPixels- (positionPercentage / 100) * timelineWidth*0.005}px`;
            label.style.top = `${-marker.clientHeight-32}px`; // Adjust this value to position it below the marker
            label.style.zIndex = '10'; // Ensure label is on top
            label.style.pointerEvents = 'auto'; // Ensure pointer events are enabled
            marker.style.left = `${positionPixels-(positionPercentage / 100) * timelineWidth*0.005}px`;
            //marker.title = moment.label;

            // Function to update the mixer and timeline
            const updateTimeline = () => {
                const timeInSeconds = (moment.time / 100) * totalDuration; // Convert time to seconds
                if (mixer) {
                    mixer.setTime(timeInSeconds); // Update the mixer with the new time
                    document.getElementById('timeline').value = (moment.time / 100) * totalDuration; // Update the timeline input value
                    document.getElementById('timeline-value').textContent = `${moment.time}%`; // Update displayed percentage
                } else {
                    console.error('Mixer is not defined');
                }
            };

            // Add click event to the marker
            marker.addEventListener('click', () => {
                console.log(`Marker clicked: ${moment.label} at time: ${moment.time}`);
                
                updateTimeline(); // Call the update function
            });

            // Add click event to the label
            label.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the click from bubbling up to the marker
                console.log(`Label clicked: ${moment.label} at time: ${moment.time}`);
                console.log(`marker height: ${marker.clientHeight} at time: ${moment.time}`);
                updateTimeline(); // Call the update function
            });

            // Append marker and label to the container
            markersContainer.appendChild(marker);
            markersContainer.appendChild(label);
        });
    } else {
        console.log('No moments found for the specified joint and model.');
    }
}

// Call setMarkerPositions on initial load
setMarkerPositions();

// Add event listener for window resize
// window.addEventListener('resize', setMarkerPositions);
window.addEventListener('resize', () => {
    setMarkerPositions(); // Call this to update markers
    onWindowResize(); // Adjust the camera and renderer
});

const timeline = document.getElementById('timeline');
timeline.addEventListener('input', function () {
    const time = parseFloat(this.value);
    if (mixer) {
        mixer.setTime(time);
    }
    const percentage = (time / totalDuration) * 100;
    document.getElementById('timeline-value').textContent = `${Math.round(percentage)}%`;

    // Update markers' positions
    setMarkerPositions();
});


        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
            renderer.setPixelRatio(window.devicePixelRatio);
        }
        
        
        function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    leftUpLegBones.forEach((bone) => {
        const label = scene.getObjectByName('Left Up Leg');
        if (label) label.position.copy(bone.getWorldPosition(new THREE.Vector3()));
    });
    
    rightUpLegBones.forEach((bone) => {
        const label = scene.getObjectByName('Right Up Leg');
        if (label) label.position.copy(bone.getWorldPosition(new THREE.Vector3()));
    });
    if (mixer && mixer._actions.length > 0) {
        const action = mixer._actions[0];
        if (isPlaying) {
            mixer.update(delta * animationSpeed);

           

            // Only update the UI if the current time has changed significantly
            const currentTime = action.time;
            if (currentTime !== previousTime) { // Store previousTime at a higher scope
                document.getElementById('timeline').value = currentTime;
                const percentage = (currentTime / totalDuration) * 100;
                document.getElementById('timeline-value').textContent = `${Math.round(percentage)}%`;
                previousTime = currentTime; // Update previousTime
            }

            // Check if the animation has ended
            if (currentTime >= totalDuration) {
                isPlaying = false; // Stop playing
                document.getElementById('timeline').value = 0;
                document.getElementById('timeline-value').textContent = '0%';
            }
        }
    }
    controls.update();
    checkCameraDistance();
   
    renderer.render(scene, camera);

            // Prevent camera from going inside the object
           
}


function createJointLabel(name, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.fillText(name, 0, 24); // Adjust positioning as needed

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(0.1, 0.1, 0.1); // Adjust size as needed

    return sprite;
}
function checkCameraDistance() {
    // Create a bounding box for the object
    const box = new THREE.Box3().setFromObject(scene.children[0]); // Assuming the first child is your model

    // Calculate the bounding sphere from the bounding box
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere); // Get the bounding sphere

    // Calculate the distance from the camera to the sphere center
    const distanceToCenter = camera.position.distanceTo(sphere.center);

    // If the camera is too close, adjust its position
    if (distanceToCenter < minDistance + sphere.radius) {
        // Calculate the direction from the sphere center to the camera
        const direction = camera.position.clone().sub(sphere.center).normalize();
        // Move the camera to be minDistance + sphere.radius away from the sphere center
        camera.position.copy(sphere.center).add(direction.multiplyScalar(minDistance + sphere.radius));
    }
}


        
        document.addEventListener("DOMContentLoaded", function() {
            const urlParams = new URLSearchParams(window.location.search);
            const modelFile = urlParams.get('modelFile') || 'default.fbx'; // Replace with your model file
            const modelName=urlParams.get('modelName') ; 

//model header/title


            if (urlParams.get('modelName') === "Eversion") {
                document.getElementById('model-title').textContent= "Eversion"|| '3D Model Viewer'; // Assign directly to modelName
            } else if (urlParams.get('modelName') === "Inversion") {
                document.getElementById('model-title').textContent = "Inversion"|| '3D Model Viewer';
            } else  if (modelName=== "Elbow Fully Extended") {
                document.getElementById('model-title').textContent= "Outstretched Hand"|| '3D Model Viewer'; // Assign directly to modelName
            } 
            else           
            
            {
                document.getElementById('model-title').textContent = modelName || '3D Model Viewer'; // Assign directly to modelName
            }
            

            document.getElementById('speed-control').addEventListener('input', function () {
                animationSpeed = parseFloat(this.value);
                document.getElementById('speed-display').textContent = animationSpeed + "x";
            });

            document.getElementById('reset-camera').addEventListener('click', function() {
                camera.position.copy(initialCameraPosition);
                camera.rotation.copy(initialCameraRotation);
                controls.target.copy(modelCenter);
                controls.update();
            });


            document.getElementById('description').addEventListener('click', function() {
                const descriptionContent = document.getElementById('description-content');
                const triangleDescription = document.getElementById('triangle-description');
            
                const isVisible = descriptionContent.classList.toggle('show');
            
                if (isVisible) {
                    triangleDescription.innerHTML = '▲'; // Change to up arrow
                    descriptionContent.style.display = "block"; // Show content
                } else {
                    triangleDescription.innerHTML = '▼'; // Change to down arrow
                    descriptionContent.style.display = "none"; // Hide content
                }
            });


            document.getElementById('howtouse-button').addEventListener('click', function() {
                const howtouse = document.getElementById('howtouse-content');
                const triangleHowtouse = document.getElementById('triangle-howtouse');
            
                const isVisible = howtouse.classList.toggle('show');
            
                if (isVisible) {
                    triangleHowtouse.innerHTML = '▲'; // Change to up arrow
                    howtouse.style.display = "block"; // Show content
                } else {
                    triangleHowtouse.innerHTML = '▼'; // Change to down arrow
                    howtouse.style.display = "none"; // Hide content
                }
            });

            
            document.getElementById('control-button').addEventListener('click', function() {
                const controlsContent = document.getElementById('controls');
                const triangleControl = document.getElementById('triangle-control');
            
                const isVisible = controlsContent.classList.toggle('show');
            
                if (isVisible) {
                    triangleControl.innerHTML = '▲'; // Change to up arrow
                    controlsContent.style.display="flex" // Show content
                } else {
                    triangleControl.innerHTML = '▼'; // Change to down arrow
                    controlsContent.style.display = "none"; // Hide content
                }
            });

           
        
          






            initTouchControls();
        
            init(modelFile, modelName);
        });
        function initTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;
    let previousDistance = null;

    const viewerContainer = document.getElementById('viewer-container');

    viewerContainer.addEventListener('touchstart', function(event) {
        if (event.touches.length === 1) {
            isDragging = true;
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        }
    });

    viewerContainer.addEventListener('touchmove', function(event) {
        if (isDragging && event.touches.length === 1) {
            const deltaX = event.touches[0].clientX - touchStartX;
            const deltaY = event.touches[0].clientY - touchStartY;

            // // Rotate the model using the OrbitControls' methods
            // controls.rotateLeft(deltaX * 0.005); // Adjust sensitivity as needed
            // controls.rotateUp(deltaY * 0.005); // Adjust sensitivity as needed

            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        } else if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            const distX = touch2.clientX - touch1.clientX;
            const distY = touch2.clientY - touch1.clientY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            // Pinch to zoom
            if (previousDistance) {
                const deltaDistance = distance - previousDistance;
                controls.dollyIn(Math.pow(0.95, deltaDistance * 0.1)); // Zoom in
                controls.dollyOut(Math.pow(0.95, -deltaDistance * 0.1)); // Zoom out
            }

            previousDistance = distance; // Store the current distance for the next move

            // Pan the model with two fingers
            const midPointX = (touch1.clientX + touch2.clientX) / 2;
            const midPointY = (touch1.clientY + touch2.clientY) / 2;

            if (this.previousMidPoint) {
                const deltaMidX = midPointX - this.previousMidPoint.x;
                const deltaMidY = midPointY - this.previousMidPoint.y;

                // Update controls to pan
                controls.pan(new THREE.Vector3(deltaMidX * 0.01, -deltaMidY * 0.01, 0)); // Adjust sensitivity as needed
            }

            this.previousMidPoint = { x: midPointX, y: midPointY }; // Store the current midpoint for the next move
        }
    });

    viewerContainer.addEventListener('touchend', function(event) {
        if (event.touches.length < 2) {
            previousDistance = null; // Reset distance tracking
            this.previousMidPoint = null; // Reset midpoint tracking
        }
        if (event.touches.length === 0) {
            isDragging = false; // Reset dragging state
        }
    });
}


