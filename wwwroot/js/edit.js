const api = "http://localhost:5234";
const urlParams = new URLSearchParams(window.location.search);
const teamId = urlParams.get("teamId");
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
    console.error("Error:", error);
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
    console.error("Error:", error);
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
    console.error("Error:", error);
    return [];
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
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      throw new Error(`Update Team Failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Team updated successfully:", data);
    CreateSuccessBlock("Team updated successfully");
  } catch (error) {
    console.error("Error updating team:", error);
    CreateErrorBlock(`Error updating team: ${error}`);
    return null;
  }
}

async function fetchTeamBanner() {
  try {
    const response = await fetch(`${api}/Team/${teamId}/banner`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch Team Banner Failed: ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("image/")) {
      return {
        url: `${api}/Team/${teamId}/banner?token=${encodeURIComponent(
          getCookie("token")
        )}`,
        contentType: contentType,
      };
    } else {
      try {
        const data = await response.json();
        return data;
      } catch (e) {
        console.error("Response is neither an image nor valid JSON:", e);
        return {};
      }
    }
  } catch (error) {
    console.error("Error fetching banner:", error);
    return {};
  }
}

async function uploadTeamBanner(teamId, file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${api}/Team/banner?id=${teamId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
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

async function displayTeamInfomation(team) {
  const teamNameInput = document.getElementById("name");
  // const statusSpan = document.getElementById("status");
  const hackathonNameInput = document.getElementById("hackathonName");
  const descriptionTextarea = document.getElementById("description");
  const createdAtInput = document.getElementById("createdAt");
  const updatedAtInput = document.getElementById("updatedAt");
  const expiredAtInput = document.getElementById("expiredAt");

  teamNameInput.value = team.name || "";
  // statusSpan.textContent = team.status === 0 ? 'Open' : 'Closed';
  hackathonNameInput.value = team.hackathonName || "";
  descriptionTextarea.value = team.hackathonDescription || "";

  if (team.createdAt) {
    createdAtInput.value = formatDateForInput(team.createdAt);
  }
  if (team.updatedAt) {
    updatedAtInput.value = formatDateForInput(team.updatedAt);
  }
  if (team.expiredAt) {
    expiredAtInput.value = formatDateForInput(team.expiredAt);
  }

  createdAtInput.readOnly = true;
  updatedAtInput.readOnly = true;

  setFormEditMode(false);
}

function formatDateForInput(dateString) {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 7);
  return date.toISOString().slice(0, 16);
}

function setFormEditMode(isEditable) {
  const inputs = document.querySelectorAll(
    ".hosted-team-infomation input, .hosted-team-infomation textarea"
  );
  inputs.forEach((input) => {
    input.disabled = !isEditable;
  });

  const editButton = document.querySelector(".hosted-team-header button");
  if (isEditable) {
    editButton.textContent = "Save";
  } else {
    editButton.textContent = "Edit";
  }
}

async function handleFormSubmit() {
  const teamData = {
    name: document.getElementById("name").value,
    hackathonName: document.getElementById("hackathonName").value,
    hackathonDescription: document.getElementById("description").value,
    // status: document.getElementById("status").textContent === 'Open' ? 0 : 1,
    expiredAt: document.getElementById("expiredAt").value,
  };

  const updatedTeam = await updateTeam(teamData);

  if (updatedTeam !== null) {
    // Update displayed team info with the response from server
    displayTeamInfomation(updatedTeam);
    CreateSuccessBlock("Team information updated successfully!");
  } else {
    CreateErrorBlock("Failed to update team information. Please try again.");
  }
}

async function setupTeamInfomationEventListeners() {
  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const cancelBtn = document.getElementById("cancel-btn");

  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";

  let originalFormData = {};

  editBtn.addEventListener("click", () => {
    originalFormData = captureFormData();
    setFormEditMode(true);

    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
  });

  saveBtn.addEventListener("click", async () => {
    await handleFormSubmit();
    setFormEditMode(false);

    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
  });

  cancelBtn.addEventListener("click", () => {
    restoreFormData(originalFormData);
    setFormEditMode(false);

    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
  });
}

async function displayTeamBanner() {
  const bannerContainer = document.getElementById("hosted-team-banner");
  const bannerData = await fetchTeamBanner();

  if (bannerData && bannerData.url) {
    const bannerImg = document.createElement("img");
    bannerImg.src = bannerData.url;
    bannerImg.alt = "Team Banner";
    bannerImg.classList.add("banner-image");

    bannerContainer.innerHTML = "";
    bannerContainer.appendChild(bannerImg);
  } else {
    bannerContainer.innerHTML =
      '<div class="no-banner">No banner uploaded</div>';
  }
}

function setupBannerUpload() {
  const bannerInput = document.getElementById("fileInput");
  let selectedBannerFile = null;

  bannerInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      CreateErrorBlock(
        "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)"
      );
      bannerInput.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      CreateErrorBlock("File size exceeds the 5MB limit");
      bannerInput.value = "";
      return;
    }

    selectedBannerFile = file;
  });

  const saveBtn = document.getElementById("save-btn");
  const originalSaveBtnClick = saveBtn.onclick;

  saveBtn.onclick = async function (event) {
    if (selectedBannerFile) {
      const bannerContainer = document.getElementById("hosted-team-banner");
      bannerContainer.innerHTML =
        '<div class="uploading-banner">Uploading banner...</div>';

      try {
        await uploadTeamBanner(teamId, selectedBannerFile);
        await displayTeamBanner();
        selectedBannerFile = null;
      } catch (error) {
        console.error("Error uploading banner:", error);
        CreateErrorBlock(
          "Failed to upload banner. The team information will still be saved."
        );
      }
    }

    await handleFormSubmit();
    setFormEditMode(false);

    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
  };

  const cancelBtn = document.getElementById("cancel-btn");
  const originalCancelBtnClick = cancelBtn.onclick;

  cancelBtn.onclick = function (event) {
    selectedBannerFile = null;
    bannerInput.value = "";

    restoreFormData(originalFormData);
    setFormEditMode(false);

    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
  };

  function updateBannerInputState(isEditable) {
    bannerInput.disabled = !isEditable;
  }

  const originalSetFormEditMode = setFormEditMode;
  setFormEditMode = function (isEditable) {
    originalSetFormEditMode(isEditable);
    updateBannerInputState(isEditable);

    if (!isEditable) {
      selectedBannerFile = null;
      bannerInput.value = "";
    }
  };
}

function captureFormData() {
  return {
    name: document.getElementById("name").value,
    // status: document.getElementById("status").textContent,
    hackathonName: document.getElementById("hackathonName").value,
    description: document.getElementById("description").value,
    createdAt: document.getElementById("createdAt").value,
    updatedAt: document.getElementById("updatedAt").value,
    expiredAt: document.getElementById("expiredAt").value,
  };
}

function restoreFormData(data) {
  document.getElementById("name").value = data.name || "";
  // document.getElementById("status").textContent = data.status || '';
  document.getElementById("hackathonName").value = data.hackathonName || "";
  document.getElementById("description").value = data.description || "";
  document.getElementById("createdAt").value = data.createdAt || "";
  document.getElementById("updatedAt").value = data.updatedAt || "";
  document.getElementById("expiredAt").value = data.expiredAt || "";
}

async function displayRoleAssignments(requirements, submissions) {
  const assignment = document.getElementById("hosted-team-assignments");

  requirements.forEach((requirement) => {
    const role = document.createElement("div");
    role.classList.add("role-requirements");

    const roleSubmissions = submissions.filter(
      (submission) => submission.requirement === requirement.id
    );

    const pendingCount = roleSubmissions.filter(
      (submission) => submission.status === "Pending"
    ).length;
    console.log(`${requirement.roleName} Pending count : ${pendingCount}`);

    let roleHTML = `
            <div class="role-info">
                <div><span class="role-info-header">Role Name</span> ${requirement.roleName}</div>
                <div><span class="role-info-header">Skill</span> ${requirement.skill.title}</div>
                <div><span class="role-info-header">Max Seat</span> ${requirement.maxSeat}</div>
                <div><span class="role-info-header">Current Seat</span> ${pendingCount}</div>
            </div>
            <div class="role-submissions">
                <h3 class="role-info-header">${requirement.roleName} Submissions</h3>
        `;
    if (roleSubmissions.length > 0) {
      roleSubmissions.forEach((submission) => {
        const isApproveDisabled =
          submission.status === "Pending" || submission.status === "Approved"
            ? "disabled"
            : "";
        const isRejectDisabled =
          submission.status === "Rejected" || submission.status === "Approved"
            ? "disabled"
            : "";

        roleHTML += `
                    <div class="assignment" data-submission-id="${submission.id}">
                        <div class="assignment-icon" onclick="GoToProfile('${submission.user.id}')" style="cursor: pointer;">
                            <img src="${api}/User/${submission.user.id}/avatar" 
                                 alt="Profile Picture"
                                 onerror="this.onerror=null; this.src='/pictures/profile-default.svg';">
                        </div>
                        <div class="assignment-info-container" onclick="GoToProfile('${submission.user.id}')" style="cursor: pointer;">
                            <div class="assignment-info">
                                <div class="user-info">
                                    <label>Full Name</label>
                                    <p>${submission.user.fullName}</p>
                                </div>
                                <div class="user-info">
                                    <label>Email</label>
                                    <p>${submission.user.email}</p>
                                </div>
                            </div>
                            <div class="assignment-info">
                                <div class="user-info">
                                    <label>Status</label>
                                    <p>${submission.status}</p>
                                </div>
                                <div class="user-info">
                                    <label>Resume</label>
                                    <p>${submission.sop}</p>
                                </div>
                            </div>
                        </div>
                        <div class="assignment-btn">
                            <button class="approve-btn submission-${submission.id}" data-id="${submission.id}" ${isApproveDisabled}>
                                Approve
                            </button>
                            <button class="reject-btn submission-${submission.id}" data-id="${submission.id}" ${isRejectDisabled}>
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

    assignment.appendChild(role);
  });

  document.querySelectorAll(".approve-btn").forEach((button) => {
    button.addEventListener("click", async function () {
      if (this.disabled) return;
      const submissionId = this.getAttribute("data-id");
      console.log(submissionId, "pending selected");
      await selectSubmissionStatus(submissionId, "2");
    });
  });

  document.querySelectorAll(".reject-btn").forEach((button) => {
    button.addEventListener("click", async function () {
      if (this.disabled) return;
      const submissionId = this.getAttribute("data-id");
      console.log(submissionId, "rejected selected");
      await selectSubmissionStatus(submissionId, "1");
    });
  });
}

async function selectSubmissionStatus(submissionId, selectedStatus) {
  const approveBtn = document.querySelector(
    `.approve-btn.submission-${submissionId}`
  );
  const rejectBtn = document.querySelector(
    `.reject-btn.submission-${submissionId}`
  );

  const wasApproveDisabled = approveBtn.disabled;
  const wasRejectDisabled = rejectBtn.disabled;

  approveBtn.disabled = true;
  rejectBtn.disabled = true;

  const clickedBtn = selectedStatus === "2" ? approveBtn : rejectBtn;
  const originalText = clickedBtn.textContent;
  clickedBtn.textContent = "Loading...";

  try {
    const statusValue = parseInt(selectedStatus);

    const response = await fetch(`${api}/Submission/${submissionId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({
        status: statusValue,
      }),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`Update Submission Status Failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Submission status updated successfully:", data);

    CreateSuccessBlock(
      selectedStatus === "2"
        ? "Application approved successfully!"
        : "Application rejected successfully!"
    );

    location.reload();
    return data;
  } catch (error) {
    console.error("Error updating submission status:", error);
    CreateErrorBlock("Failed to update submission status. Please try again.");

    approveBtn.disabled = wasApproveDisabled;
    rejectBtn.disabled = wasRejectDisabled;

    clickedBtn.textContent = originalText;

    return null;
  }
}

async function sendNotification(submission, teamId) {
  try {
    const token = getCookie("token");

    let notificationType;
    if (submission.status === "Approved") {
      notificationType = 0;
    } else if (submission.status === "Rejected") {
      notificationType = 1;
    } else {
      notificationType = 0;
    }

    const response = await fetch(`${api}/notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: submission.user.id,
        teamId: teamId,
        type: notificationType,
      }),
    });

    console.log("Notification payload:", {
      userId: submission.user.id,
      teamId: teamId,
      type: notificationType,
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateTeamStatus(teamId) {
  try {
    const token = getCookie("token");
    const response = await fetch(`${api}/Team/${teamId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 1,
      }),
    });
  } catch (error) {
    console.error("Error:", error);
    CreateErrorBlock("Failed to update team status. Please try again.");
    throw error;
  }
}

async function updateSubmissionStatus(submission) {
  console.log(submission.status);
  if (submission.status === "Rejected") {
    return;
  }

  try {
    const token = getCookie("token");
    const response = await fetch(`${api}/Submission/${submission.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update notification status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Notification status updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating notification status:", error);
    CreateErrorBlock("Failed to update notification status. Please try again.");
    throw error;
  }
}

function validateRequirements(requirements, submissions) {
  for (const req of requirements) {
    const pendingCount = submissions.filter(
      (submission) =>
        submission.requirement === req.id && submission.status === "Pending"
    ).length;

    if (pendingCount > req.maxSeat) {
      return false;
    }
  }

  return true;
}

function updateConfirmButtonState(requirements, submissions) {
  const confirmBtn = document.getElementById("confirm-team-btn");
  if (!confirmBtn) return;

  const isValid = validateRequirements(requirements, submissions);

  confirmBtn.disabled = !isValid;

  if (!isValid) {
    confirmBtn.style.opacity = "0.6";
    confirmBtn.style.cursor = "not-allowed";
    confirmBtn.title = "Some roles exceed max seats";
  } else {
    confirmBtn.style.opacity = "1";
    confirmBtn.style.cursor = "pointer";
    confirmBtn.title = "Confirm team";
  }
}

async function main() {
  const team = await fetchHostedTeam();
  const requirements = await fetchTeamRequirements();
  const submissions = await fetchTeamSubmissions();
  const confirmTeamBtn = document.getElementById("confirm-team-btn");

  displayTeamInfomation(team);
  setupTeamInfomationEventListeners();

  await displayTeamBanner();
  setupBannerUpload();

  displayRoleAssignments(requirements, submissions);
  updateConfirmButtonState(requirements, submissions);
  if (confirmTeamBtn) {
    confirmTeamBtn.addEventListener("click", async function () {
      if (team.status == 1) {
        CreateErrorBlock("Team already confirmed!");
        return;
      }
      await updateTeamStatus(team.id);
      for (const submission of submissions) {
        await updateSubmissionStatus(submission);
        await sendNotification(submission, team.id);
      }
      window.location.href = `${api}/Teams`;
    });
  }
}

main();
