api = "http://localhost:5234";

// State variables
let isEditing = false;
let userData = null;

var showMore = false;
var project;
var userId = null;

async function fetchUserMe() {
  try {
    const response = await fetch(`${api}/User/me`, {
      method: "GET",
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
    console.log("all project :", data);

    const userProjects = data.filter(
      (project) => project.userResponse.id === userData.id
    );
    console.log("user project :", userProjects);

    project = userProjects;
    return userProjects;
  } catch (error) {
    CreateErrorBlock("Get Project failed");
  }
}

function displayUserProfile(data) {
  // Display user avatar
  const avatar = document.getElementById("avatar");
  avatar.src = `${api}/User/${data.id}/avatar`;
  
  // Set form field values
  const fullNameInput = document.getElementById("fullName");
  fullNameInput.value = data.fullName || "";
  
  const telInput = document.getElementById("tel");
  telInput.value = data.tel || "";
  
  const emailInput = document.getElementById("email");
  emailInput.value = data.email || "";
  
  // Set header dropdown
  const headerSelect = document.getElementById("headerSelect");
  if (headerSelect) {
    // Find the option with the matching value and set it as selected
    for (let i = 0; i < headerSelect.options.length; i++) {
      if (headerSelect.options[i].value === data.header) {
        headerSelect.selectedIndex = i;
        break;
      }
    }
  }
  
  // Set initial state to viewing mode
  toggleEditMode(false);
}

function toggleEditMode(editing) {
  isEditing = editing;
  
  // Get form elements
  const fullNameInput = document.getElementById("fullName");
  const telInput = document.getElementById("tel");
  const headerSelect = document.getElementById("headerSelect");
  const editButton = document.getElementById("editButton");
  const saveButton = document.getElementById("saveButton");
  const cancelButton = document.getElementById("cancelButton");
  const avatarUploadContainer = document.getElementById("avatar-upload-container");
  
  // Enable/disable form fields based on editing state
  fullNameInput.disabled = !editing;
  telInput.disabled = !editing;
  headerSelect.disabled = !editing;
  
  // Show/hide appropriate buttons
  editButton.style.display = editing ? "none" : "block";
  saveButton.style.display = editing ? "block" : "none";
  cancelButton.style.display = editing ? "block" : "none";
  
  // Show/hide avatar upload option
  if (avatarUploadContainer) {
    avatarUploadContainer.style.display = editing ? "block" : "none";
  }
}

function startEditing() {
  toggleEditMode(true);
}

function cancelEditing() {
  // Reset form to original values
  displayUserProfile(userData);
  toggleEditMode(false);
  
  // Reset file input
  const fileInput = document.getElementById("avatar-upload");
  if (fileInput) {
    fileInput.value = "";
  }
}

async function saveProfile() {
  // Handle profile data update
  const fullNameInput = document.getElementById("fullName");
  const telInput = document.getElementById("tel");
  const headerSelect = document.getElementById("headerSelect");
  
  // Create updated user object
  const updatedUser = {
    fullName: fullNameInput.value,
    tel: telInput.value,
    header: headerSelect.value
  };
  
  try {
    // Update profile data
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
    
    // Upload avatar if a new file has been selected
    const fileInput = document.getElementById("avatar-upload");
    if (fileInput && fileInput.files.length > 0) {
      await uploadAvatar(fileInput.files[0]);
    }
    
    // Refresh user data and update display
    userData = await fetchUserMe();
    displayUserProfile(userData);
    toggleEditMode(false);
    
    // Show success message
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

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  const userData = await fetchUserMe();
  await displayUserProfile(userData);

  const fileInput = document.getElementById("avatar-upload");
  if (fileInput) {
    fileInput.addEventListener("change", previewAvatar);
  }

  const projects = await fetchUserProject();
  await CreateProject(projects);
});

// api = "http://localhost:5234";

var showMore = false;
var project;
var userId = null;

// document.addEventListener("DOMContentLoaded", async function () {
//   await Profile();
//   await Project();
// });

// async function Profile() {
//   try {
//     const response = await fetch(`${api}/User/me`, {
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
//     console.log(data);
//     ShowData(data);
//   } catch (error) {
//     CreateErrorBlock("Get Profile failed");
//   }
// }

// function ShowData(data) {
//   const image = document.getElementById("avatar");
//   image.src = `${api}/User/${data.id}/avatar`;
//   userId = data.id;
//   const fullname = document.getElementById("fullname");
//   fullname.innerHTML = `<strong>Fullname:</strong> ${data.header} ${data.fullName}`;
//   const tel = document.getElementById("tel");
//   tel.innerHTML = `<strong>Tel:</strong> ${data.tel}`;
//   const email = document.getElementById("email");
//   email.innerHTML = `<strong>Email:</strong> ${data.email}`;
// }

async function Project() {
  try {
    const response = await fetch(`${api}/Project?UserId=${userId}`, {
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
    project = data;
    CreateProject(data);
  } catch (error) {
    CreateErrorBlock("Get Project failed");
  }
}

function CreateProject(data) {
  let amount = 0;
  const projectsList = document.getElementById("projects-list");
  projectsList.innerHTML = "";
  data.forEach((element) => {
    amount += 1;
    if (amount > 2 && !showMore) {
      return;
    }
    const article = document.createElement("article");
    const title = document.createElement("h3");
    title.innerHTML = `${element.title}`;
    title.style.display = "inline";
    const deleteButton = document.createElement("button");
    deleteButton.id = "delete";
    deleteButton.textContent = "✖";
    deleteButton.onclick = function (event) {
      event.stopPropagation();
      CreateConfirm(
        `Do you want to delete "${element.title}"?`,
        async function () {
          await DeleteProject(element.id);
          article.remove();
          const index = project.findIndex((item) => item.id === element.id);
          if (index > -1) {
            project.splice(index, 1);
          }
          CreateProject(project);
        },
        function () {}
      );
    };
    const description = document.createElement("p");
    description.innerHTML = `<strong>Description:</strong> ${element.description}`;
    const skill = document.createElement("p");
    skill.innerHTML = `<strong>Description:</strong> ${element.skillResponse.title}`;
    article.appendChild(title);
    article.appendChild(deleteButton);
    article.appendChild(description);
    article.appendChild(skill);
    article.onclick = function () {
      window.location.href = `${api}/Profile/UpdateProject?id=${element.id}`;
    };
    article.style.cursor = "pointer";
    projectsList.appendChild(article);
  });
}

function SeeMore() {
  showMore = true;
  const button = document.getElementById("loadMore");
  button.textContent = "Show Less";
  button.onclick = SeeLess;
  CreateProject(project);
}

function SeeLess() {
  showMore = false;
  const button = document.getElementById("loadMore");
  button.textContent = "Show All";
  button.onclick = SeeMore;
  CreateProject(project);
}

async function DeleteProject(id) {
  try {
    const response = await fetch(`${api}/Project/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Delete Project failed: ${response.status}`);
    }
  } catch (error) {
    CreateErrorBlock("Delete Project failed");
  }
}

function PageUpdateProfile() {
  window.location.href = `${api}/Profile/UpdateProfile`;
}

function PageCreateProject() {
  window.location.href = `${api}/Profile/CreateProject`;
}

// function Logout() {
//   CreateConfirm(
//     "Do you want to logout?",
//     function () {
//       clearCookie("token");
//       window.location.href = `${api}/Home`;
//     },
//     function () {}
//   );
// }

async function SearchSkill() {
  const skill = document.getElementById("skill").value;
  if (skill.length < 1) {
    Project();
    return;
  }

  try {
    const response = await fetch(`${api}/Skill?Title=${skill}&Limit=1`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Edit Project failed: ${response.status}`);
    }

    const data = await response.json();
    ProjectWithSkillId(data[0].id);
  } catch (error) {
    CreateErrorBlock("Enter Wrong Skill");
  }
}

function handleKeyPress(event) {
  if (
    (event.key !== "Backspace" && event.key !== "Delete") ||
    event.key === "Enter"
  ) {
    SearchSkill();
  }
}

async function ProjectWithSkillId(skillId) {
  try {
    const response = await fetch(
      `${api}/Project?UserId=${userId}&&SkillId=${skillId}`,
      {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Get Project failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    project = data;
    CreateProject(data);
  } catch (error) {
    CreateErrorBlock("Get Project failed");
  }
}