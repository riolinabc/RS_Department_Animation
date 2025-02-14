 const urlParams = new URLSearchParams(window.location.search);
        //const jointType = urlParams.get('joint'); // Get the joint type from the URL
        const jointType ='elbow'; // Get the joint type from the URL

        // Define options based on the joint type
        const options = {
            elbow: {
                movement: [
                    { name: "Extension", file: "/elbow/extension.fbx" },
                    { name: "Flexion", file: "/elbow/flexion.fbx" },
                    { name: "Pronation", file: "/elbow/pronation.fbx" },
                    { name: "Supination", file: "/elbow/supination.fbx" }
                  
                ],
                
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