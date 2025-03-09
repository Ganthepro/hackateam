const api = "http://localhost:5234";

const teamId = document.getElementById("teamId").dataset.id;

let bannerUrls = new Map();

async function fetchTeamData() {
  try {
    const teamResponse = await fetch(`${api}/Team/${teamId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!teamResponse.ok) {
      throw new Error(`Get Team failed: ${teamResponse.status}`);
    }

    const data = await teamResponse.json();
    console.log("Team Data:", data);

    const base64Banner = await fetchTeamBanner(data.id);
    const teamWithBanner = {
      ...data,
      bannerUrl: base64Banner || "/pictures/default-banner.png",
    };

    console.log("Team with Banner:", teamWithBanner);
    return teamWithBanner;
  } catch (error) {
    console.error(`Error fetching team data:`, error);
    return null;
  }
}

async function fetchTeamBanner(teamId) {
  try {
    const response = await fetch(`${api}/Team/${teamId}/banner`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch banner failed: ${response.status}`);
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      return null;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Error fetching banner for team ${teamId}:`, error);
    return null;
  }
}

async function fetchSubmissions() {
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
    const userIds = data.map((item) => item.user.id);

    return userIds;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function checkUser(teamLeadId, userIds) {
  try {
    const response = await fetch(`${api}/User/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch User Failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.id === teamLeadId) {
      return true;
    }

    if (userIds.length > 0 && userIds.some((userId) => userId === data.id)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error:", error);
    return true;
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
    console.log("Requirement :", data);

    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

function calculateTeamSize(requirements) {
  return requirements.reduce((acc, curr) => acc + curr.maxSeat, 0);
}

function displayTeamData(teamData, teamSize) {
  if (!teamData) return;

  const name = document.getElementById("name");
  if (teamData.name) {
    name.innerText = teamData.name;
  }

  const image = document.getElementById("teamImage");
  image.src = teamData.bannerUrl;

  const hackathonName = document.getElementById("hackathonName");
  if (teamData.hackathonName) {
    hackathonName.innerText = teamData.hackathonName;
  }
  const hackathonDescription = document.getElementById("hackathonDescription");
  if (teamData.hackathonDescription) {
    hackathonDescription.innerText = teamData.hackathonDescription;
  }
  const lead = document.getElementById("leadResponse");
  if (teamData.leadResponse && teamData.leadResponse.fullName) {
    lead.innerText = teamData.leadResponse.fullName;
  }
  const maxSize = document.getElementById("maxSize");
  if (teamSize) {
    maxSize.innerText = teamSize;
  }
  const expiredDate = document.getElementById("expiredAt");
  if (teamData.expiredAt) {
    const date = new Date(teamData.expiredAt);
    const thaiTime = date.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
    expiredDate.innerText = thaiTime;
  }
}

function displayRequirements(requirements) {
  const requirementsBox = document.getElementById("requirements-display");
  requirementsBox.innerHTML = "";

  const title = document.createElement("div");
  title.className = "requirement";
  title.classList.add("title");
  title.innerHTML = `
    <input type="checkbox" disabled>
    <div class="requirement-name">Role</div>
    <div class="requirement-max-seat">Max Seat</div>
    <div class="requirement-skill">Skill</div>
  `;
  requirementsBox.appendChild(title);

  requirements.forEach((requirement) => {
    const requirementDiv = document.createElement("div");
    requirementDiv.className = "requirement";
    requirementDiv.innerHTML = `
      <input type="checkbox" name="requirement" value="${requirement.id}" id="${requirement.id}">
      <div class="requirement-name">${requirement.roleName}</div>
      <div class="requirement-max-seat">${requirement.maxSeat}</div>
      <div class="requirement-skill">${requirement.skill.title}</div>
    `;
    requirementsBox.appendChild(requirementDiv);
  });

  // Add event listeners to all checkboxes
  const checkboxes = document.querySelectorAll('input[name="requirement"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // Uncheck all other checkboxes
      checkboxes.forEach((cb) => {
        if (cb !== this) {
          cb.checked = false;
          cb.closest(".requirement").classList.remove("selected");
        }
      });

      // Add selected class to parent if checked
      if (this.checked) {
        this.closest(".requirement").classList.add("selected");
      } else {
        this.closest(".requirement").classList.remove("selected");
      }
    });
  });
}

async function joinTeam(event) {
  event.preventDefault();
  try {
    const sop = document.getElementById("sop").value.trim();
    if (!sop) {
      console.error("Statement of Purpose is required");
      return;
    }

    const selectedCheckbox = document.querySelector(
      'input[name="requirement"]:checked'
    );
    if (!selectedCheckbox) {
      console.error("Please select a role requirement");
      return;
    }

    const requirementId = selectedCheckbox.value;

    const data = {
      requirementId,
      sop,
    };

    console.log("Submitting application:", data);

    const response = await fetch(`${api}/Submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Join Team failed: ${response.status}`);
    }

    window.location.href = `${api}/Explore`;
  } catch (error) {
    console.error(`Error joining team:`, error);
  }
}

function hideForm() {
  const form = document.getElementById("form");

  if (form) {
    form.style.display = "none";
    const teamCards = document.querySelector(".team-info-container");
    teamCards.style.gridTemplateColumns = "1fr";
    console.log("Form hidden!");
  } else {
    console.error("Form not found!");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const teamData = await fetchTeamData();
  const requirements = await fetchTeamRequirements();
  const teamSize = calculateTeamSize(requirements);
  displayTeamData(teamData, teamSize);
  if (
    (await checkUser(teamData.leadResponse.id, await fetchSubmissions())) !==
    true
  ) {
    displayRequirements(requirements);
  } else {
    hideForm();
  }
});
