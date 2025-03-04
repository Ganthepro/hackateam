const api = "http://localhost:5234";
const urlParams = new URLSearchParams(window.location.search);
const teamId = urlParams.get('teamId');
console.log(teamId);

async function fetchHostedTeam() {
    try {
        const response = await fetch(`${api}/Team/${teamId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch Hosted Team Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error('Error:', error);
        return {};
    }
}

async function fetchTeamRequirements() {
    try {
        const response = await fetch(`${api}/Team/${teamId}/requirements`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch Requirements Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function fetchTeamSubmissions() {
    try {
        const response = await fetch(`${api}/Team/${teamId}/submissions`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch Submissions Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function displayTeamInfomation(team) {
    // Get form elements
    const teamNameInput = document.getElementById("name");
    const statusSpan = document.getElementById("status");
    const hackathonNameInput = document.getElementById("hackathonName");
    const descriptionTextarea = document.getElementById("description");
    const createdAtInput = document.getElementById("createdAt");
    const updatedAtInput = document.getElementById("updatedAt");
    const expiredAtInput = document.getElementById("expiredAt");
    
    // Set values from team object
    teamNameInput.value = team.name || '';
    statusSpan.textContent = team.status === 0 ? 'Open' : 'Closed';
    hackathonNameInput.value = team.hackathonName || '';
    descriptionTextarea.value = team.hackathonDescription || '';
    
    // Format and set dates if they exist
    if(team.createdAt) {
        createdAtInput.value = formatDateForInput(team.createdAt);
    }
    if(team.updatedAt) {
        updatedAtInput.value = formatDateForInput(team.updatedAt);
    }
    if(team.expiredAt) {
        expiredAtInput.value = formatDateForInput(team.expiredAt);
    }
    
    // Initially disable all inputs for view mode
    setFormEditMode(false);
}

// Helper function to format date strings for datetime-local input
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
}

// Function to toggle between view and edit modes
function setFormEditMode(isEditable) {
    const inputs = document.querySelectorAll('.hosted-team-infomation input, .hosted-team-infomation textarea');
    inputs.forEach(input => {
        input.disabled = !isEditable;
    });
    
    // Show/hide the save button based on edit mode
    const editButton = document.querySelector('.hosted-team-header button');
    if(isEditable) {
        editButton.textContent = 'Save';
    } else {
        editButton.textContent = 'Edit';
    }
}

async function updateTeam(teamData) {
    try {
        const response = await fetch(`${api}/Team/${teamId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify(teamData)
        });

        if (!response.ok) {
            throw new Error(`Update Team Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Team updated successfully:", data);
    } catch (error) {
        console.error('Error updating team:', error);
        return null;
    }
}

// Function to handle form submission
async function handleFormSubmit() {
    // Get updated values from form
    const teamData = {
        name: document.getElementById("name").value,
        hackathonName: document.getElementById("hackathonName").value,
        hackathonDescription: document.getElementById("description").value,
        status: document.getElementById("status").textContent === 'Open' ? 0 : 1,
        expiredAt: document.getElementById("expiredAt").value
    };
    
    // Update team via API
    const updatedTeam = await updateTeam(teamData);
    

    if (updatedTeam !== null) {
        // Update displayed team info with the response from server
        displayTeamInfomation(updatedTeam);
        
        // Show success message
        alert("Team information updated successfully!");
    } else {
        // Show error message
        alert("Failed to update team information. Please try again.");
    }
}

async function setupTeamInfomationEventListeners() {
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // Initially hide save and cancel buttons (view mode)
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    
    let originalFormData = {}; // Store original data for cancel functionality
    
    // Edit button event listener
    editBtn.addEventListener('click', () => {
        // Save the original form data for potential cancellation
        originalFormData = captureFormData();
        
        // Switch to edit mode
        setFormEditMode(true);
        
        // Show/hide appropriate buttons
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
    });
    
    // Save button event listener
    saveBtn.addEventListener('click', async () => {
        // Save the form data
        await handleFormSubmit();
        
        // Switch back to view mode
        setFormEditMode(false);
        
        // Show/hide appropriate buttons
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    });
    
    // Cancel button event listener
    cancelBtn.addEventListener('click', () => {
        // Restore the original form data
        restoreFormData(originalFormData);
        
        // Switch back to view mode
        setFormEditMode(false);
        
        // Show/hide appropriate buttons
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    });
}

// Function to capture current form data
function captureFormData() {
    return {
        name: document.getElementById("name").value,
        status: document.getElementById("status").textContent,
        hackathonName: document.getElementById("hackathonName").value,
        description: document.getElementById("description").value,
        createdAt: document.getElementById("createdAt").value,
        updatedAt: document.getElementById("updatedAt").value,
        expiredAt: document.getElementById("expiredAt").value
    };
}

// Function to restore form data
function restoreFormData(data) {
    document.getElementById("name").value = data.name || '';
    document.getElementById("status").textContent = data.status || '';
    document.getElementById("hackathonName").value = data.hackathonName || '';
    document.getElementById("description").value = data.description || '';
    document.getElementById("createdAt").value = data.createdAt || '';
    document.getElementById("updatedAt").value = data.updatedAt || '';
    document.getElementById("expiredAt").value = data.expiredAt || '';
}

async function displayRoleAssignments(requirements, submissions) {
    const assignment = document.getElementById("hosted-team-assignments");

    // Clear existing content
    // assignment.innerHTML = '';

    // Add new rows
    requirements.forEach(requirement => {
        const role = document.createElement("div");
        role.classList.add("role-requirements");

        // Filter submissions for the current requirement
        const roleSubmissions = submissions.filter(submission => 
            submission.requirement === requirement.id
        );

        const pendingCount = roleSubmissions.filter(submission => submission.status === "Pending").length;
        console.log(`${requirement.roleName} Pending count : ${pendingCount}`);

        // Create inner HTML for role info
        let roleHTML = `
            <div class="role-info">
                <div><span class="role-info-header">Role Name :</span> ${requirement.roleName}</div>
                <div><span class="role-info-header">Skill :</span> ${requirement.skill.title}</div>
                <div><span class="role-info-header">Max Seat :</span> ${requirement.maxSeat}</div>
                <div><span class="role-info-header">Current Seat :</span> ${pendingCount}</div>
            </div>
            <div class="role-submissions">
                <h3 class="role-info-header">${requirement.roleName} Submissions</h3>
        `;
        
        // Add submissions HTML
        if (roleSubmissions.length > 0) {
            roleSubmissions.forEach(submission => {
                roleHTML += `
                    <div class="assignment">
                        <div class="assignment-info">
                            <p>Full Name : ${submission.user.fullName}</p>
                            <p>Email : ${submission.user.email}</p>
                            <p>Tel. : ${submission.user.tel}</p>
                            <p>Description : ${submission.sop}</p>
                            <p>Status : ${submission.status}</p>
                        </div>
                        <div class="assignment-btn">
                            <button class="approve-btn" data-id="${submission.id}">
                                Approve
                            </button>
                            <button class="reject-btn" data-id="${submission.id}">
                                Reject
                            </button>
                        </div>
                    </div>
                `;
            });
        } else {
            roleHTML += `<p>No submissions for this role yet.</p>`;
        }
        
        roleHTML += `</div>`;
        role.innerHTML = roleHTML;
        
        // Append to the DOM first
        assignment.appendChild(role);
    });
    
    // Add event listeners after all elements are in the DOM
    document.querySelectorAll('.approve-btn').forEach(button => {
        button.addEventListener('click', function() {
            const submissionId = this.getAttribute('data-id');
            console.log(submissionId, "pending selected");
            selectSubmissionStatus(submissionId, "2");
        });
    });
    
    document.querySelectorAll('.reject-btn').forEach(button => {
        button.addEventListener('click', function() {
            const submissionId = this.getAttribute('data-id');
            console.log(submissionId, "rejected selected");
            selectSubmissionStatus(submissionId, "1");
        });
    });
}

async function selectSubmissionStatus(submissionId, selectedStatus) {
    try {
        const statusValue = parseInt(selectedStatus); // Convert string to integer
        
        const response = await fetch(`${api}/Submission/${submissionId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify({
                "status": statusValue
            })
        });

        if (!response.ok) {
            throw new Error(`Update Submission Status Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Submission status updated successfully:", data);
        
        // Refresh the page to reflect the changes
        location.reload();
        return data;
    } catch (error) {
        console.error('Error updating submission status:', error);
        alert('Failed to update submission status. Please try again.');
        return null;
    }
}

async function main() {
    const team = await fetchHostedTeam();
    const requirements = await fetchTeamRequirements();
    const submissions = await fetchTeamSubmissions();

    displayTeamInfomation(team);
    setupTeamInfomationEventListeners();

    displayRoleAssignments(requirements, submissions);
}

main();