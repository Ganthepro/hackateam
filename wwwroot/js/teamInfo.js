api = "http://localhost:5234";
var teamLeadId = null;

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
  LoadBanner();
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

async function LoadBanner() {
  const image = document.getElementById("teamimage");
  image.src = "";
  try {
    const response = await fetch(`${api}/Team/${userId}/banner`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });
    await response.json();
    image.src = `${api}/Team/${userId}/banner`;
  } catch (error) {
    image.src =
      "https://media.istockphoto.com/id/1147521090/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%AB%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%AA%E0%B8%95%E0%B8%B9%E0%B8%94%E0%B8%B4%E0%B9%82%E0%B8%AD%E0%B8%AA%E0%B8%B5%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B9%88%E0%B8%B2.jpg?s=612x612&w=0&k=20&c=1EHvAkEhN1V9DlqHUIBHxIaq9NSVaKvSAV8TMbDfkfU=";
  }
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
    CreateRequirement(data);
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
  if (await CheckTeamLead()) {
    CreateErrorBlock("This is your team. Can not join");
  } else {
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
}

async function CheckTeamLead() {
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

    if (teamLeadId === data.id) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    CreateErrorBlock("Get Profile failed. Please check your data.");
  }
}
