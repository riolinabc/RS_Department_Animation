 const urlParams = new URLSearchParams(window.location.search);
        //const jointType = urlParams.get('joint'); // Get the joint type from the URL
        const jointType ='ankle'; // Get the joint type from the URL

        // Define options based on the joint type
        const options = {
           
           
            ankle: {
                movement: [
         

                    { name: "Abduction", file: "/ankle/sandal_demo/abduction_demo_sandal.fbx" },
                    { name: "Adduction", file: "/ankle/sandal_demo/adduction_demo_sandal.fbx" },
                    { name: "Eversion", file: "/ankle/sandal_demo/eversion_demo_sandal.fbx" },
                    { name: "Inversion", file: "/ankle/sandal_demo/inversion_demo_sandal.fbx" },
                    { name: "Plantarflexion", file: "/ankle/sandal_demo/plantar_flexion_demo_sandal.fbx" },
                    { name: "Dorsiflexion", file: "/ankle/sandal_demo/dorsiflexion_demo_sandal.fbx" },
                    { name: "Pronation", file: "/ankle/sandal_demo/pronation_demo_sandal.fbx" },
                    { name: "Supination", file: "/ankle/sandal_demo/supination_demo_sandal.fbx" }


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
                    button.innerText = option.name;
                    button.onclick = () => {
                        location.href = `viewer.html?choice=movement&modelFile=${option.file}&joint=${jointType}&modelName=${option.name}`;
                    };
                    movementColumn.appendChild(button);
                });
                JointMovement.innerHTML="Joint Movement";
            }

            
        } else {
            movementColumn.innerHTML = "<p>No options available for this joint.</p>";
            injuriesColumn.innerHTML = "<p>No options available for this joint.</p>";
        }