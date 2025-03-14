const requirementsContainer = document.querySelector(".requirements");
const api = "http://localhost:5234";

function updateDeleteButtons() {
  const deleteButtons = requirementsContainer.querySelectorAll(
    ".delete-requirement-btn"
  );
  const requirementCount = requirementsContainer.children.length;

  deleteButtons.forEach((button) => {
    button.disabled = requirementCount === 1;
    if (requirementCount === 1) {
      button.classList.add("delete-btn-disabled");
    } else {
      button.classList.remove("delete-btn-disabled");
    }
  });
}

async function SearchSkill(inputElement, datalistId) {
  const query = inputElement.value.trim();
  if (query.length < 1) return;

  const token = getCookie("token");
  try {
    const response = await fetch(`${api}/skill?Title=${query}&Limit=2`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.status}`);
    }

    const skills = await response.json();
    const datalist = document.getElementById(datalistId);
    datalist.innerHTML = "";

    skills.forEach((skill) => {
      const option = document.createElement("option");
      option.value = skill.title;
      option.dataset.skillId = skill.id;
      datalist.appendChild(option);
    });

    inputElement.addEventListener("change", function () {
      const selectedOption = [...datalist.options].find(
        (option) => option.value === inputElement.value
      );
      const hiddenSkillInput = inputElement
        .closest(".member-requirement-container")
        .querySelector('input[name="selected-skill-id"]');
      hiddenSkillInput.value = selectedOption
        ? selectedOption.dataset.skillId
        : "";
    });
  } catch (error) {
    console.error("Error searching for skills:", error);
    CreateErrorBlock(`Error searching for skills: ${error}`);
  }
}

function createRequirementGroup() {
  const uniqueId = Date.now();
  const requirementContainer = document.createElement("div");
  requirementContainer.className = "member-requirement-container";

  requirementContainer.innerHTML = `
        <div class="member-requirement-group">
            <label for="member-role">Role</label>
            <input 
                type="text" 
                name="member-role" 
                placeholder="Enter member role"
            >
        </div>
        <div class="member-requirement-group">
            <label for="member-quantity">Quantity</label>
            <input 
                type="number"
                min="1"
                max="99"
                name="member-quantity" 
                placeholder="Enter member quantity"
            >
        </div>
        <div class="member-requirement-group">
            <label for="member-skill">Skill</label>
            <input 
                type="text" 
                name="member-skill" 
                list="skills-${uniqueId}" 
                autocomplete="off"
                placeholder="Enter member skill"
            >
            <datalist id="skills-${uniqueId}"></datalist>
            <input type="hidden" name="selected-skill-id" />
        </div>
        <button type="button" class="delete-requirement-btn">
            <img src="../pictures/delete-icon.svg" alt="delete icon" />
        </button>
    `;

  const skillInput = requirementContainer.querySelector(
    'input[name="member-skill"]'
  );
  skillInput.addEventListener("input", function () {
    SearchSkill(this, `skills-${uniqueId}`);
  });

  const deleteButton = requirementContainer.querySelector(
    ".delete-requirement-btn"
  );
  deleteButton.addEventListener("click", () => {
    requirementContainer.remove();
    updateDeleteButtons();
  });

  return requirementContainer;
}

const addButton = document.createElement("button");
addButton.type = "button";
addButton.className = "add-requirement-btn";
addButton.textContent = "Add Requirement";
requirementsContainer.parentNode.insertBefore(
  addButton,
  requirementsContainer.nextSibling
);

addButton.addEventListener("click", () => {
  const newContainer = createRequirementGroup();
  requirementsContainer.appendChild(newContainer);
  updateDeleteButtons();
});

document.addEventListener("DOMContentLoaded", () => {
  const initialGroup = createRequirementGroup();
  requirementsContainer.appendChild(initialGroup);
  updateDeleteButtons();
});

function handleFileInput() {
  const fileInput = document.getElementById("fileInput");
  const bannerContainer = document.getElementById("create-team-banner");

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    bannerContainer.innerHTML = "";

    if (file) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        const bannerImg = document.createElement("img");
        bannerImg.src = imageUrl;
        bannerImg.alt = "Team Banner";
        bannerImg.classList.add("banner-image");
        bannerContainer.appendChild(bannerImg);

        const fileNameElement = document.getElementById("fileInputDesc");
        if (fileNameElement) {
          fileNameElement.textContent = file.name;
        }
      } else {
        bannerContainer.innerHTML =
          '<div class="no-banner">Please select an image file</div>';
      }
    } else {
      bannerContainer.innerHTML =
        '<div class="no-banner">No banner uploaded</div>';
    }
  });
}

function validateRequirements() {
  const requirementContainers = document.querySelectorAll(
    ".member-requirement-container"
  );

  if (requirementContainers.length === 0) {
    CreateErrorBlock("Please add at least one team member requirement.");
    return false;
  }

  for (let i = 0; i < requirementContainers.length; i++) {
    const container = requirementContainers[i];
    const roleName = container
      .querySelector('input[name="member-role"]')
      .value.trim();
    const quantity = container
      .querySelector('input[name="member-quantity"]')
      .value.trim();
    const skill = container
      .querySelector('input[name="member-skill"]')
      .value.trim();

    if (!roleName || !quantity || !skill) {
      CreateErrorBlock(`Please fill all fields in requirement #${i + 1}.`);
      return false;
    }

    if (isNaN(quantity) || parseInt(quantity) <= 0) {
      CreateErrorBlock(
        `Quantity in requirement #${i + 1} must be a positive number.`
      );
      return false;
    }
  }

  return true;
}

function validateForm() {
  const teamName = document.getElementById("team-name").value.trim();
  const teamDescription = document
    .getElementById("team-description")
    .value.trim();
  const hackathonName = document.getElementById("hackathon-name").value.trim();
  const hackathonDescription = document
    .getElementById("hackathon-description")
    .value.trim();
  const hackathonDate = document.getElementById("hackathon-date").value;

  if (!teamName) {
    CreateErrorBlock("Please enter a team name.");
    return false;
  }

  if (!teamDescription) {
    CreateErrorBlock("Please enter a team description.");
    return false;
  }

  if (!hackathonName) {
    CreateErrorBlock("Please enter a hackathon name.");
    return false;
  }

  if (!hackathonDescription) {
    CreateErrorBlock("Please enter a hackathon description.");
    return false;
  }

  if (!hackathonDate) {
    CreateErrorBlock("Please select a hackathon end date.");
    return false;
  }

  return validateRequirements();
}

async function createTeam() {
  if (!validateForm()) {
    return;
  }

  const teamName = document.getElementById("team-name").value;
  const teamDescription = document.getElementById("team-description").value;
  const hackathonName = document.getElementById("hackathon-name").value;
  const hackathonDescription = document.getElementById(
    "hackathon-description"
  ).value;
  const bannerFile = document.getElementById("fileInput").files[0];

  const expiredAtString = document.getElementById("hackathon-date").value;
  const expiredAt = new Date(expiredAtString);

  const teamData = {
    name: teamName,
    description: teamDescription,
    hackathonName: hackathonName,
    hackathonDescription: hackathonDescription,
    expiredAt: expiredAt.toISOString(),
  };

  try {
    const token = getCookie("token");
    const response = await fetch(`${api}/team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create team: ${response.status}`);
    }

    const result = await response.json();
    const teamId = result.id;

    if (bannerFile) {
      await uploadTeamBanner(teamId, bannerFile, token);
    }

    await createRequirements(teamId, token);

    CreateSuccessBlock("Team and requirements created successfully!");
    window.location.href = `${api}/Explore`;
  } catch (error) {
    console.error("Error creating team:", error);
    CreateErrorBlock("Failed to create team. Please try again.");
  }
}

async function uploadTeamBanner(teamId, file, token) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${api}/Team/banner?id=${teamId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload banner: ${response.status}`);
    }

    console.log("Banner uploaded successfully.");
    CreateSuccessBlock("Banner uploaded successfully.");
  } catch (error) {
    console.error("Error uploading banner:", error);
    CreateErrorBlock("Failed to upload team banner.");
  }
}

async function createRequirements(teamId, token) {
  const requirementContainers = document.querySelectorAll(
    ".member-requirement-container"
  );

  for (const container of requirementContainers) {
    const roleName = container.querySelector('input[name="member-role"]').value;
    const maxSeat = parseInt(
      container.querySelector('input[name="member-quantity"]').value,
      10
    );
    const skillTitle = container.querySelector(
      'input[name="member-skill"]'
    ).value;
    let skillId = container.querySelector(
      'input[name="selected-skill-id"]'
    ).value;

    try {
      if (!skillId) {
        const skillResponse = await fetch(`${api}/skill`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: skillTitle }),
        });

        if (!skillResponse.ok) {
          throw new Error(`Failed to create skill: ${skillResponse.status}`);
        }

        const skillResult = await skillResponse.json();
        skillId = skillResult.id;
      }

      const requirementData = {
        teamId: teamId,
        roleName: roleName,
        maxSeat: maxSeat,
        skillId: skillId,
      };

      const requirementResponse = await fetch(`${api}/requirement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requirementData),
      });

      if (!requirementResponse.ok) {
        throw new Error(
          `Failed to create requirement: ${requirementResponse.status}`
        );
      }
    } catch (error) {
      console.error("Error creating requirement:", error);
      CreateErrorBlock(`Error creating requirement: ${error}`);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const initialGroup = createRequirementGroup();
  requirementsContainer.appendChild(initialGroup);

  updateDeleteButtons();
  handleFileInput();

  const bannerContainer = document.getElementById("create-team-banner");
  bannerContainer.innerHTML = '<div class="no-banner">No banner uploaded</div>';
});

document
  .getElementById("create-team-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    createTeam();
  });
