api = "http://localhost:5234";
var teamLeadId = null;
var elementData = "yes";

document.addEventListener("DOMContentLoaded", async function () {
  await GetTeam();
  await GetRequirement();
});

async function GetTeam() {
  const teamId = document.getElementById("teamId").dataset.id;
  try {
    const response = await fetch(`${api}/Team/${teamId}`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Get Team failed: ${response.status}`);
    }
    const data = await response.json();
    TeamDetail(data);
  } catch (error) {
    CreateErrorBlock("Get Team failed. Please check your data.");
  }
}

function TeamDetail(data) {
  const name = document.getElementById("name");
  name.innerText = data.name;
  const image = document.getElementById("teamimage");
  image.src = `${api}/Team/${data.id}/banner`;
  const hackathonTeam = document.getElementById("hackathonteam");
  hackathonTeam.innerText = data.hackathonName;
  const description = document.getElementById("description");
  description.innerText = data.hackathonDescription;
  const owner = document.getElementById("owner");
  owner.innerText = `Created by: ${data.leadResponse.fullName}`;
  teamLeadId = data.leadResponse.id;
  const date = new Date(data.expiredAt);
  const thaiTime = date.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
  const expiredDate = document.getElementById("expireddate");
  expiredDate.innerText = `Expired Date: ${thaiTime}`;
}

async function GetRequirement() {
  const teamId = document.getElementById("teamId").dataset.id;
  try {
    const response = await fetch(`${api}/Team/${teamId}/requirements`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Get Requirement failed: ${response.status}`);
    }
    const data = await response.json();
    if (await CheckTeamLead(teamId)) {
      DisableJoin();
    } else {
      CreateRequirement(data);
    }
  } catch (error) {
    CreateErrorBlock("Get Requirement failed. Please check your data.");
  }
}

function CreateRequirement(data) {
  let amount = 0;
  data.forEach((element, index) => {
    amount += element.maxSeat;
    const requirement = document.getElementById("requirement");
    requirement.innerText += ` ${element.maxSeat} ${element.roleName}`;
    if (index < data.length - 1) requirement.innerText += ",";
    const skill = document.createElement("div");
    skill.classList.add("skill");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = `skill${index}`;
    radio.name = "skill";
    radio.value = element.id;
    const label = document.createElement("label");
    label.htmlFor = `skill${index}`;
    label.innerText = element.roleName;
    const skills = document.getElementById("skills");
    skill.appendChild(radio);
    skill.appendChild(label);
    skills.appendChild(skill);
  });
  const teamSize = document.getElementById("teamsize");
  teamSize.innerText = `Teamsize: ${amount}`;
}

async function JoinTeam() {
  const sop = document.getElementById("sop").value;

  const skillRadios = document.getElementsByName("skill");
  let requirementId = "";
  for (let radio of skillRadios) {
    if (radio.checked) {
      requirementId = radio.value;
      break;
    }
  }
  const data = { sop, requirementId };
  try {
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

    window.location.href = `${api}/Home/Explore`;
  } catch (error) {
    CreateErrorBlock("Join Team failed. Please check your data.");
  }
}

async function CheckTeamLead(id) {
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

    const userIds = await GetSubmission(id);

    const found = userIds.includes(data.id);

    if (teamLeadId === data.id || found) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    CreateErrorBlock(`Get Profile failed: Please check your data`);
  }
}

function DisableJoin() {
  const join = document.getElementById("join");
  join.style.display = "none";
}

async function GetSubmission(id) {
  try {
    const response = await fetch(`${api}/Team/${id}/submissions`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Get Submission failed: ${response.status}`);
    }

    const data = await response.json();
    const userIds = data.map((item) => item.user.id);
    elementData = userIds;
    return userIds;
  } catch (error) {
    CreateErrorBlock("Get Submission failed. Please check your data.");
  }
}
