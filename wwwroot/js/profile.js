api = "http://localhost:5234";

// State variables
let isEditing = false;
let userData = null;

// Project-related variables
var showMore = false;
var projects = [];
var allSkills = [];

async function fetchUserMe() {
  try {
    const response = await fetch(`${api}/User/me`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Get Profile failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("user me:", data);
    userData = data;
    return data;
  } catch (error) {
    CreateErrorBlock("Get Profile failed");
  }
}

async function fetchUserProject() {
  try {
    const response = await fetch(`${api}/Project`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Get Project failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("all projects:", data);

    const userProjects = data.filter(
      (project) => project.userResponse && project.userResponse.id === userData.id
    );
    
    console.log("user projects:", userProjects);
    projects = userProjects;
    
    // Create a datalist for skills
    await createSkillDatalist(data);
    
    return userProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    CreateErrorBlock("Failed to get projects");
    return [];
  }
}

function displayUserProfile(data) {
  const avatar = document.getElementById("avatar");
  avatar.src = `${api}/User/${data.id}/avatar`;

  const fullNameInput = document.getElementById("fullName");
  fullNameInput.value = data.fullName || "";
  
  const telInput = document.getElementById("tel");
  telInput.value = data.tel || "";
  
  const emailInput = document.getElementById("email");
  emailInput.value = data.email || "";

  const headerSelect = document.getElementById("headerSelect");
  if (headerSelect) {
    for (let i = 0; i < headerSelect.options.length; i++) {
      if (headerSelect.options[i].value === data.header) {
        headerSelect.selectedIndex = i;
        break;
      }
    }
  }

  toggleEditMode(false);
}

function toggleEditMode(editing) {
  isEditing = editing;

  const fullNameInput = document.getElementById("fullName");
  const telInput = document.getElementById("tel");
  const headerSelect = document.getElementById("headerSelect");
  const editButton = document.getElementById("editButton");
  const saveButton = document.getElementById("saveButton");
  const cancelButton = document.getElementById("cancelButton");
  const avatarUploadContainer = document.getElementById("avatar-upload-container");

  fullNameInput.disabled = !editing;
  telInput.disabled = !editing;
  headerSelect.disabled = !editing;

  editButton.style.display = editing ? "none" : "block";
  saveButton.style.display = editing ? "block" : "none";
  cancelButton.style.display = editing ? "block" : "none";

  if (avatarUploadContainer) {
    avatarUploadContainer.style.display = editing ? "block" : "none";
  }
}

function startEditing() {
  toggleEditMode(true);
}

function cancelEditing() {
  displayUserProfile(userData);
  toggleEditMode(false);
  
  const fileInput = document.getElementById("avatar-upload");
  if (fileInput) {
    fileInput.value = "";
  }
}

async function saveProfile() {
  const fullNameInput = document.getElementById("fullName");
  const telInput = document.getElementById("tel");
  const headerSelect = document.getElementById("headerSelect");

  const updatedUser = {
    fullName: fullNameInput.value,
    tel: telInput.value,
    header: headerSelect.value
  };
  
  try {
    const response = await fetch(`${api}/User`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(updatedUser),
    });
    
    if (!response.ok) {
      throw new Error(`Update Profile failed: ${response.status}`);
    }
    
    const fileInput = document.getElementById("avatar-upload");
    if (fileInput && fileInput.files.length > 0) {
      await uploadAvatar(fileInput.files[0]);
    }
    
    userData = await fetchUserMe();
    displayUserProfile(userData);
    toggleEditMode(false);
    
    CreateSuccessBlock("Profile updated successfully");
  } catch (error) {
    CreateErrorBlock("Update Profile failed");
    console.error(error);
  }
}

async function uploadAvatar(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${api}/User/avatar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload avatar failed: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("Avatar upload error:", error);
    CreateErrorBlock("Avatar upload failed");
    return false;
  }
}

function previewAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const avatar = document.getElementById("avatar");
      avatar.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function createSkillDatalist(projectsData) {
  // Extract unique skills from projects
  const uniqueSkills = new Set();
  
  projectsData.forEach(project => {
    if (project.skillResponse && project.skillResponse.title) {
      uniqueSkills.add(project.skillResponse.title);
    }
  });
  
  allSkills = Array.from(uniqueSkills);
  
  // Create or update the datalist element
  let datalist = document.getElementById("skills");
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = "skills";
    document.body.appendChild(datalist);
  } else {
    datalist.innerHTML = "";
  }
  
  // Add options to datalist
  allSkills.forEach(skill => {
    const option = document.createElement("option");
    option.value = skill;
    datalist.appendChild(option);
  });
}

function displayProjects(projectsDisplay) {
  const projectsList = document.getElementById("projects-list");
  projectsList.innerHTML = "";
  
  if (!projectsDisplay || projectsDisplay.length === 0) {
    const noProjectsMessage = document.createElement("p");
    noProjectsMessage.textContent = "No projects found.";
    noProjectsMessage.className = "no-projects-message";
    projectsList.appendChild(noProjectsMessage);
    return;
  }
  
  let displayCount = 0;
  
  projectsDisplay.forEach((project) => {
    displayCount++;
    
    // If not showing more and we've already displayed 2 projects, skip
    if (displayCount > 2 && !showMore) {
      return;
    }

    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");
    
    // Create project content
    projectCard.innerHTML = `
      <div class="project-header">
        <h2>${project.title || "Untitled Project"}</h2>
        <div class="project-actions">
          <button class="edit-project-btn">Edit</button>
          <button class="delete-btn" title="Delete project">Delete</button>
        </div>
      </div>
      <div class="project-detail">
        <label>Description</label>
        <div class="project-description">${project.description || "No description"}</div>
      </div>
      <div class="project-detail">
        <label>Skill</label>
        <div class="project-skill">${project.skillResponse?.title || "Not specified"}</div>
      </div>
    `;
    
    // Add delete button event
    const deleteButton = projectCard.querySelector(".delete-btn");
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      
      CreateConfirm(
        `Do you want to delete "${project.title}"?`,
        async function () {
          try {
            await deleteProject(project.id);
            
            // Remove from projects array
            const index = projects.findIndex(p => p.id === project.id);
            if (index > -1) {
              projects.splice(index, 1);
            }
            
            // Update display
            displayProjects(projects);
            
            // Show success message
            CreateSuccessBlock(`Project "${project.title}" was deleted successfully`);
          } catch (error) {
            CreateErrorBlock("Failed to delete project");
          }
        },
        function () {
          // Cancel function - do nothing
        }
      );
    });
    
    // Add edit button event
    const editButton = projectCard.querySelector(".edit-project-btn");
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openEditProjectModal(project);
    });
    
    // Add click event to project card for details view
    // projectCard.addEventListener("click", function() {
    //   openProjectDetails(project);
    // });
    
    // Add to projects list
    projectsList.appendChild(projectCard);
  });
  
  // Update the "Show All"/"Show Less" button text
  updateLoadMoreButton();
}

function updateLoadMoreButton() {
  const button = document.getElementById("loadMore");
  
  if (!projects || projects.length <= 2) {
    button.style.display = "none";
    return;
  }
  
  button.style.display = "block";
  
  if (showMore) {
    button.textContent = "Show Less";
    button.onclick = toggleShowLess;
  } else {
    button.textContent = "Show All";
    button.onclick = toggleShowMore;
  }
}

function toggleShowMore() {
  showMore = true;
  displayProjects(projects);
}

function toggleShowLess() {
  showMore = false;
  displayProjects(projects);
}

async function deleteProject(projectId) {
  try {
    const response = await fetch(`${api}/Project/${projectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Delete Project failed: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    CreateErrorBlock("Failed to delete project");
    throw error;
  }
}

// New function to handle project creation
async function createProject(projectData) {
  try {
    const response = await fetch(`${api}/Project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`Create Project failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Refresh projects after creation
    const projectsData = await fetchUserProject();
    displayProjects(projectsData);
    
    return result;
  } catch (error) {
    console.error("Error creating project:", error);
    CreateErrorBlock("Failed to create project");
    throw error;
  }
}

// New function to handle project updating
async function updateProject(projectId, projectData) {
  try {
    const response = await fetch(`${api}/Project/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`Update Project failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Refresh projects after update
    const projectsData = await fetchUserProject();
    displayProjects(projectsData);
    
    return result;
  } catch (error) {
    console.error("Error updating project:", error);
    CreateErrorBlock("Failed to update project");
    throw error;
  }
}

// Create project modal functions
function openCreateProjectModal() {
  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.className = "modal-container";
  modalContainer.id = "project-modal";
  
  // Create modal content
  modalContainer.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Create New Project</h2>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="project-title">Title</label>
          <input type="text" id="project-title" name="project-title" required>
        </div>
        <div class="form-group">
          <label for="project-description">Description</label>
          <textarea id="project-description" name="project-description" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label for="project-skill">Skill</label>
          <input type="text" id="project-skill" name="project-skill" list="skills">
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" id="cancel-btn">Cancel</button>
        <button class="success-btn submit-btn" id="submit-btn">Create Project</button>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(modalContainer);
  
  // Add event listeners
  const cancelBtn = modalContainer.getElementById("cancel-btn");
  const submitBtn = modalContainer.getElementById("submit-btn");
  
  cancelBtn.addEventListener("click", () => {
    closeModal();
  });
  
  submitBtn.addEventListener("click", async () => {
    const titleInput = document.getElementById("project-title");
    const descriptionInput = document.getElementById("project-description");
    const skillInput = document.getElementById("project-skill");
    
    if (!titleInput.value.trim()) {
      CreateErrorBlock("Project title is required");
      return;
    }
    
    const projectData = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      skillId: skillInput.value.trim()
    };
    
    try {
      await createProject(projectData);
      closeModal();
      CreateSuccessBlock("Project created successfully");
    } catch (error) {
      // Error is already displayed in createProject function
    }
  });
}

function openEditProjectModal(project) {
  const modalContainer = document.createElement("div");
  modalContainer.className = "modal-container";
  modalContainer.id = "project-modal";

  modalContainer.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Project</h2>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="project-title">Title</label>
          <input type="text" id="project-title" name="project-title" value="${project.title || ''}" required>
        </div>
        <div class="form-group">
          <label for="project-description">Description</label>
          <textarea id="project-description" name="project-description" rows="4">${project.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label for="project-skill">Skill</label>
          <input type="text" id="project-skill" name="project-skill" list="skills" value="${project.skillResponse?.title || ''}">
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" id="cancel-btn">Cancel</button>
        <button class="success-btn submit-btn" id="submit-btn">Update Project</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);
  
  const cancelBtn = modalContainer.getElementById("cancel-btn");
  const submitBtn = modalContainer.getElementById("submit-btn");
  
  cancelBtn.addEventListener("click", () => {
    closeModal();
  });
  
  submitBtn.addEventListener("click", async () => {
    const titleInput = document.getElementById("project-title");
    const descriptionInput = document.getElementById("project-description");
    const skillInput = document.getElementById("project-skill");
    
    if (!titleInput.value.trim()) {
      CreateErrorBlock("Project title is required");
      return;
    }
    
    const projectData = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      skillId: skillInput.value.trim()
    };
    
    try {
      await updateProject(project.id, projectData);
      closeModal();
      CreateSuccessBlock("Project updated successfully");
    } catch (error) {
      // Error is already displayed in updateProject function
    }
  });
}

function closeModal() {
  const modal = document.getElementById("project-modal");
  if (modal) {
    document.body.removeChild(modal);
  }
}

function openProjectDetails(project) {
  // Create modal container for project details
  const modalContainer = document.createElement("div");
  modalContainer.className = "modal-container";
  modalContainer.id = "project-detail-modal";
  
  // Create modal content
  modalContainer.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${project.title || "Untitled Project"}</h2>
      </div>
      <div class="modal-body">
        <div class="project-detail-section">
          <h3>Description</h3>
          <div class="project-detail-content">${project.description || "No description provided."}</div>
        </div>
        <div class="project-detail-section">
          <h3>Skill</h3>
          <div class="project-detail-content">${project.skillResponse?.title || "No skill specified."}</div>
        </div>
        <div class="project-detail-section">
          <h3>Created</h3>
          <div class="project-detail-content">${new Date(project.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="edit-project-btn">Edit Project</button>
        <button class="close-btn">Close</button>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(modalContainer);
  
  // Add event listeners
  const closeButtons = modalContainer.querySelectorAll(".close-modal, .close-btn");
  closeButtons.forEach(button => {
    button.addEventListener("click", () => {
      document.body.removeChild(modalContainer);
    });
  });
  
  const editButton = modalContainer.querySelector(".edit-project-btn");
  editButton.addEventListener("click", () => {
    document.body.removeChild(modalContainer);
    openEditProjectModal(project);
  });
}

function navigateToCreateProject() {
  openCreateProjectModal();
}

function Logout() {
  CreateConfirm(
    "Do you want to logout?",
    function () {
      clearCookie("token");
      window.location.href = `${api}/Home`;
    },
    function () {}
  );
}

async function searchProjects() {
  const searchInput = document.getElementById("skill");
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  if (searchTerm === "") {
    // If search is empty, show all projects
    displayProjects(projects);
    return;
  }
  
  // Filter projects by skill title or project title
  const filteredProjects = projects.filter(project => {
    const skillTitle = project.skillResponse?.title?.toLowerCase() || "";
    const projectTitle = project.title?.toLowerCase() || "";
    const projectDesc = project.description?.toLowerCase() || "";
    
    return skillTitle.includes(searchTerm) || 
           projectTitle.includes(searchTerm) || 
           projectDesc.includes(searchTerm);
  });
  
  // Display filtered projects
  displayProjects(filteredProjects);
}

function handleKeyPress(event) {
  // If Enter key is pressed, perform search
  if (event.key === "Enter") {
    searchProjects();
    return;
  }
  
  // Debounce search for other keys
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(searchProjects, 300);
}

document.addEventListener("DOMContentLoaded", async function () {
  const userData = await fetchUserMe();
  await displayUserProfile(userData);

  const fileInput = document.getElementById("avatar-upload");
  if (fileInput) {
    fileInput.addEventListener("change", previewAvatar);
  }

  const projectsData = await fetchUserProject();
  displayProjects(projectsData);

  const searchInput = document.getElementById("skill");
  if (searchInput) {
    searchInput.addEventListener("input", handleKeyPress);
  }
  
  const addButton = document.getElementById("add-project");
  if (addButton) {
    addButton.addEventListener("click", navigateToCreateProject);
  }
});