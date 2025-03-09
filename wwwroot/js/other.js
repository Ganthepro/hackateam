api = "http://localhost:5234";

// State variables
let isEditing = false;
let userData = null;

// Project-related variables
var showMore = false;
var projects = [];
var allSkills = [];
let skillMappings = {};

async function fetchUserMe() {
  try {
    const userId = document.getElementById("userId").dataset.id;
    const response = await fetch(`${api}/User/${userId}`, {
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
    const userId = document.getElementById("userId").dataset.id;
    const response = await fetch(`${api}/Project?Limit=10000`, {
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
      (project) => project.userResponse && project.userResponse.id === userId
    );
    
    console.log("user projects:", userProjects);
    projects = userProjects;
    
    // Create a skill mapping and datalist
    await fetchAndMapSkills(data);
    
    return userProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    CreateErrorBlock("Failed to get projects");
    return [];
  }
}

async function fetchAndMapSkills(projectsData) {
  try {
    // First, get all skills from the API
    const response = await fetch(`${api}/Skill?Limit=10000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Get Skills failed: ${response.status}`);
    }

    const allSkillsData = await response.json();
    console.log("all skills:", allSkillsData);
    
    // Extract unique skills from projects and create mapping
    skillMappings = {};
    
    // Map all skills from API
    allSkillsData.forEach(skill => {
      if (skill.title) {
        skillMappings[skill.title.toLowerCase()] = skill.id;
      }
    });
    
    // Also extract skills from projects in case API doesn't return all
    projectsData.forEach(project => {
      if (project.skillResponse && project.skillResponse.title && project.skillResponse.id) {
        skillMappings[project.skillResponse.title.toLowerCase()] = project.skillResponse.id;
      }
    });
    
    allSkills = Object.keys(skillMappings).map(title => 
      title.charAt(0).toUpperCase() + title.slice(1)
    );
    
    // Create or update the datalist element
    createSkillDatalist();
    
    return allSkills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    
    // Fallback to project data if API call fails
    const uniqueSkills = new Set();
    skillMappings = {};
    
    projectsData.forEach(project => {
      if (project.skillResponse && project.skillResponse.title) {
        uniqueSkills.add(project.skillResponse.title.toLowerCase());
        
        if (project.skillResponse.id) {
          skillMappings[project.skillResponse.title.toLowerCase()] = project.skillResponse.id;
        }
      }
    });
    
    allSkills = Array.from(uniqueSkills).map(title => 
      title.charAt(0).toUpperCase() + title.slice(1)
    );
    
    // Create or update the datalist element
    createSkillDatalist();
    
    return allSkills;
  }
}

function createSkillDatalist() {
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

async function findOrCreateSkill(skillTitle) {
  if (!skillTitle) return null;
  
  // Normalize skill title (lowercase for case-insensitive comparison)
  const normalizedTitle = skillTitle.trim().toLowerCase();
  
  // Check if skill already exists in our mappings
  if (skillMappings[normalizedTitle]) {
    return skillMappings[normalizedTitle];
  }
  
  // If not, we need to create a new skill
  try {
    console.log("Creating new skill:", skillTitle);

    const response = await fetch(`${api}/Skill?Limit=1000000`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({ title: skillTitle.trim() }),
    });

    if (!response.ok) {
      throw new Error(`Create Skill failed: ${response.status}`);
    }
    
    const newSkill = await response.json();
    console.log("Created new skill:", newSkill);
    
    // Update our mapping with the new skill
    skillMappings[normalizedTitle] = newSkill.id;
    
    // Update allSkills array and datalist
    if (!allSkills.includes(skillTitle.trim())) {
      allSkills.push(skillTitle.trim());
      createSkillDatalist();
    }
    
    return newSkill.id;
  } catch (error) {
    console.error("Error creating skill:", error);
    throw error;
  }
}

async function createProject(projectData) {
  try {
    // First, handle the skill
    if (projectData.skillId) {
      const skillId = await findOrCreateSkill(projectData.skillId);
      projectData.skillId = skillId;
    }
    
    console.log("Creating project with data:", projectData);
    
    const response = await fetch(`${api}/Project`, {
      method: "Post",
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
    
    // return result;
  } catch (error) {
    console.error("Error creating project:", error);
    CreateErrorBlock("Failed to create project");
    throw error;
  }
}

async function updateProject(projectId, projectData) {
  try {
    // First, handle the skill
    if (projectData.skillId) {
      const skillId = await findOrCreateSkill(projectData.skillId);
      projectData.skillId = skillId;
    }
    
    console.log("Updating project with data:", projectData);
    
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
    
    // Refresh projects after update
    const projectsData = await fetchUserProject();
    displayProjects(projectsData);
  } catch (error) {
    console.error("Error updating project:", error);
    CreateErrorBlock("Failed to update project");
    throw error;
  }
}

async function openCreateProjectModal() {
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
  document.body.appendChild(modalContainer);
  
  // Add event listeners
  const cancelBtn = document.getElementById("cancel-btn");
  const submitBtn = document.getElementById("submit-btn");
  
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
    console.log("Creating project with data:", projectData);
    
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
  console.log("Editing project:", project);

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
  
  const cancelBtn = document.getElementById("cancel-btn");
  const submitBtn = document.getElementById("submit-btn");
  
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
    displayProjects(projects);
    return;
  }

  const filteredProjects = projects.filter(project => {
    const skillTitle = project.skillResponse?.title?.toLowerCase() || "";
    const projectTitle = project.title?.toLowerCase() || "";
    const projectDesc = project.description?.toLowerCase() || "";
    
    return skillTitle.includes(searchTerm) || 
           projectTitle.includes(searchTerm) || 
           projectDesc.includes(searchTerm);
  });
  
  displayProjects(filteredProjects);
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchProjects();
    return;
  }
  
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(searchProjects, 300);
}

document.addEventListener("DOMContentLoaded", async function () {
  const userData = await fetchUserMe();
  await displayUserProfile(userData);

  const projectsData = await fetchUserProject();
  displayProjects(projectsData);

  const searchInput = document.getElementById("skill");
  if (searchInput) {
    searchInput.addEventListener("input", handleKeyPress);
  }
  
});

// api = "http://localhost:5234";

// var showMore = false;
// var project;

// document.addEventListener("DOMContentLoaded", function () {
//   Profile();
//   Project();
// });

// async function Profile() {
//   const id = document.getElementById("userId").dataset.id;
//   try {
//     const response = await fetch(`${api}/User/${id}`, {
//       method: "Get",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getCookie("token")}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Get Profile failed: ${response.status}`);
//     }

//     const data = await response.json();
//     ShowData(data);
//   } catch (error) {
//     CreateErrorBlock("Get Profile failed. Please check your data.");
//   }
// }

// function ShowData(data) {
//   const image = document.getElementById("avatar");
//   image.src = `${api}/User/${data.id}/avatar`;
//   const fullname = document.getElementById("fullname");
//   fullname.innerHTML = `<strong>Fullname:</strong> ${data.header} ${data.fullName}`;
//   const tel = document.getElementById("tel");
//   tel.innerHTML = `<strong>Tel:</strong> ${data.tel}`;
//   const email = document.getElementById("email");
//   email.innerHTML = `<strong>Email:</strong> ${data.email}`;
// }

// async function Project() {
//   const userId = document.getElementById("userId").dataset.id;

//   try {
//     const response = await fetch(`${api}/Project?UserId=${userId}`, {
//       method: "Get",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getCookie("token")}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Get Project failed: ${response.status}`);
//     }

//     const data = await response.json();
//     project = data;
//     CreateProject(data);
//   } catch (error) {
//     CreateErrorBlock(error);
//   }
// }

// function CreateProject(data) {
//   let amount = 0;
//   const projectsList = document.getElementById("projects-list");
//   projectsList.innerHTML = "";
//   data.forEach((element) => {
//     amount += 1;
//     if (amount > 2 && !showMore) {
//       return;
//     }
//     const article = document.createElement("article");
//     const title = document.createElement("h3");
//     title.innerHTML = `${element.title}`;
//     const description = document.createElement("p");
//     description.innerHTML = `<strong>Description:</strong> ${element.description}`;
//     const skill = document.createElement("p");
//     skill.innerHTML = `<strong>Description:</strong> ${element.skillResponse.title}`;
//     article.appendChild(title);
//     article.appendChild(description);
//     article.appendChild(skill);
//     projectsList.appendChild(article);
//   });
// }

// function SeeMore() {
//   showMore = true;
//   const button = document.getElementById("loadMore");
//   button.textContent = "Show Less";
//   button.onclick = SeeLess;
//   CreateProject(project);
// }

// function SeeLess() {
//   showMore = false;
//   const button = document.getElementById("loadMore");
//   button.textContent = "Show All";
//   button.onclick = SeeMore;
//   CreateProject(project);
// }

// async function SearchSkill() {
//   const skill = document.getElementById("skill").value;
//   if (skill.length < 1) {
//     Project();
//     return;
//   }

//   try {
//     const response = await fetch(`${api}/Skill?Title=${skill}&Limit=1`, {
//       method: "Get",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getCookie("token")}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Edit Project failed: ${response.status}`);
//     }

//     const data = await response.json();
//     ProjectWithSkillId(data[0].id);
//   } catch (error) {
//     CreateErrorBlock("Enter Wrong Skill");
//   }
// }

// function handleKeyPress(event) {
//   if (
//     (event.key !== "Backspace" && event.key !== "Delete") ||
//     event.key === "Enter"
//   ) {
//     SearchSkill();
//   }
// }

// async function ProjectWithSkillId(skillId) {
//   const id = document.getElementById("userId").dataset.id;
//   try {
//     const response = await fetch(
//       `${api}/Project?UserId=${id}&&SkillId=${skillId}`,
//       {
//         method: "Get",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getCookie("token")}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Get Project failed: ${response.status}`);
//     }

//     const data = await response.json();
//     project = data;
//     CreateProject(data);
//   } catch (error) {
//     CreateErrorBlock("Get Project failed");
//   }
// }
