 const urlParams = new URLSearchParams(window.location.search);
        const jointType = urlParams.get('joint'); // Get the joint type from the URL

        // Define options based on the joint type
        const options = {
            shoulder: {
                movement: [
                    { name: "Abduction", file: "/shoulder/abduction_shoulder.fbx" },
                    { name: "Adduction", file: "/shoulder/adduction_shoulder.fbx" },
                    { name: "Extension", file: "/shoulder/extension_shoulder.fbx" },
                    { name: "Flexion", file: "/shoulder/flexion_shoulder.fbx" },
                    { name: "External Rotation", file: "/shoulder/external_rotation_shoulder.fbx" },
                    { name: "Internal Rotation", file: "/shoulder/internal_rotation_shoulder.fbx" }
                ],
                injuries: [
                    // { name: "Anterior Dislocation", file: "/shoulder/shoulder1_v2.fbx" },
                    { name: "Posterior Dislocation", file: "/shoulder/shoulder4_v2.fbx" }
                ]
            },
            elbow: {
                movement: [
                    { name: "Extension", file: "/elbow/extension.fbx" },
                    { name: "Flexion", file: "/elbow/flexion.fbx" },
                    { name: "Pronation", file: "/elbow/pronation.fbx" },
                    { name: "Supination", file: "/elbow/supination.fbx" }
                  
                ],
                injuries: [
                    // { name: "Valgus Overload", file: "/elbow/elbow2.fbx" },
                    { name: "Elbow Fully Extended", file: "/elbow/elbow3.fbx" }
                ]
            },
            hip: {
                movement: [
                { name: "Abduction", file: "/hip/hip_abduction.fbx" },
                    { name: "Adduction", file: "/hip/hip_adduction.fbx" },
                    { name: "Extension", file: "/hip/hip_extension.fbx" },
                    { name: "Flexion", file: "/hip/hip_flexion.fbx" },
                    { name: "Lateral Rotation", file: "/hip/hip_lateral_rotation.fbx" },
                    { name: "Medial Rotation", file: "/hip/hip_medial_rotation.fbx" }
                ]
               

            },
            knee: {
                movement: [
                { name: "Abduction", file: "/knee/demo_abduction.fbx" },
                    { name: "Adduction", file: "/knee/demo_adduction.fbx" },
                    { name: "Extension", file: "/knee/demo_extension.fbx" },
                    { name: "Flexion", file: "/knee/demo_flexion.fbx" },
                    { name: "Lateral Rotation", file: "/knee/demo_lateralrotation.fbx" },
                    { name: "Medial Rotation", file: "/knee/demo_medialrotation.fbx" }
                ],
                injuries: [
                    { name: "ACL Injury", file: "/knee/acl_2.fbx" }
                   
                ]
            },
            ankle: {
                movement: [
              //  { name: "Abduction", file: "/ankle/abduction_demo.fbx" },
                 //   { name: "Adduction", file: "/ankle/adduction_demo.fbx" },
                   // { name: "Eversion", file: "/ankle/eversion_demo.fbx" },
                    //{ name: "Inversion", file: "/ankle/inversion_demo.fbx" },
                    //{ name: "Plantarflexion", file: "/ankle/plantar_flexion_demo.fbx" },
                    //{ name: "Dorsiflexion", file: "/ankle/dorsiflexion_demo.fbx" },
                    //{ name: "Pronation", file: "/ankle/pronation_demo.fbx" },
                    //{ name: "Supination", file: "/ankle/supination_demo.fbx" }


                    { name: "Abduction", file: "/ankle/sandal_demo/abduction_demo_sandal.fbx" },
                    { name: "Adduction", file: "/ankle/sandal_demo/adduction_demo_sandal.fbx" },
                    { name: "Eversion", file: "/ankle/sandal_demo/eversion_demo_sandal.fbx" },
                    { name: "Inversion", file: "/ankle/sandal_demo/inversion_demo_sandal.fbx" },
                    { name: "Plantarflexion", file: "/ankle/sandal_demo/plantar_flexion_demo_sandal.fbx" },
                    { name: "Dorsiflexion", file: "/ankle/sandal_demo/dorsiflexion_demo_sandal.fbx" },
                    { name: "Pronation", file: "/ankle/sandal_demo/pronation_demo_sandal.fbx" },
                    { name: "Supination", file: "/ankle/sandal_demo/supination_demo_sandal.fbx" }


                ],
                injuries: [
                    //{ name: "Eversion", file: "/ankle/eversion.fbx" },
                   // { name: "Eversion Abduction", file: "/ankle/eversion_abduction.fbx" },
                    //{ name: "Eversion Dorsiflexion", file: "/ankle/eversion_dorsiflexion.fbx"},
                    //{ name: "Eversion Plantarflexion", file: "/ankle/eversion_plantarflexion.fbx" },
                    //{ name: "Inversion", file: "/ankle/inversion.fbx" },
                    //{ name: "Inversion Abduction Dorsiflexion", file: "/ankle/inversion_abduction_dorsiflexion.fbx" },
                    //{ name: "Inversion Adduction Plantarflexion", file: "/ankle/inversion_adduction_plantarflexion.fbx" },
                   // { name: "Inversion Dorsiflexion", file: "/ankle/inversion_dorsiflexion.fbx" },

                   { name: "Eversion", file: "/ankle/sandal/eversion3_sandal.fbx" },
                    { name: "Eversion Abduction", file: "/ankle/sandal/eversion_abduction_sandal.fbx" },
                    { name: "Eversion Dorsiflexion", file: "/ankle/sandal/eversion_dorsiflexion_sandal.fbx"},
                    { name: "Eversion Plantarflexion", file: "/ankle/sandal/eversion_plantarflexion_sandal.fbx" },
                    { name: "Inversion", file: "/ankle/sandal/inversion3_sandal.fbx" },
                    { name: "Inversion Abduction Dorsiflexion", file: "/ankle/sandal/inversion_abduction_dorsiflexion_sandal.fbx" },
                    { name: "Inversion Adduction Plantarflexion", file: "/ankle/sandal/inversion_adduction_plantarflexion_sandal.fbx" },
                    { name: "Inversion Dorsiflexion", file: "/ankle/sandal/inversion_dorsiflexion_sandal.fbx" },

                ]
            }
        };

        // Generate buttons based on the selected joint type
        const movementColumn = document.getElementById('movement');
        const injuriesColumn = document.getElementById('injuries');
        const title = document.getElementById('model-title');
        const JointMovement = document.getElementById('JointMovement');
        const InjurySimulation = document.getElementById('InjurySimulation');

        if (options[jointType]) {
            title.innerHTML = `${jointType.charAt(0).toUpperCase() + jointType.slice(1)}`;

            if (options[jointType].movement) {
                options[jointType].movement.forEach(option => {
                    const button = document.createElement('button');


                    //button text
                    button.innerText = option.name;
                    
                    button.onclick = () => {
                        location.href = `viewer.html?choice=movement&modelFile=${option.file}&joint=${jointType}&modelName=${option.name}`;
                    };
                    movementColumn.appendChild(button);
                });
                JointMovement.innerHTML="Joint Movement";
            }

            if (options[jointType].injuries) {
                options[jointType].injuries.forEach(option => {
                    const button = document.createElement('button');
                       //button text
                    if (option.name== "Elbow Fully Extended"){
                        button.innerText = "Outstretched Hand";

                    }
                    else{ button.innerText = option.name;}
                   
                    button.onclick = () => {
                        location.href = `viewer.html?choice=injury&modelFile=${option.file}&joint=${jointType}&modelName=${option.name}`;
                    };
                    injuriesColumn.appendChild(button);
                });
                InjurySimulation.innerHTML="Injury Simulation";
            }
        } else {
            movementColumn.innerHTML = "<p>No options available for this joint.</p>";
            injuriesColumn.innerHTML = "<p>No options available for this joint.</p>";
        }