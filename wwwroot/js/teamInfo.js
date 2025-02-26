api = "http://localhost:5234";

document.addEventListener("DOMContentLoaded", async function () {
  //   await GetTeam();
});

async function GetTeam() {
  const teamId = document.getElementById("teamId").dataset.id;
  try {
    const response = await fetch(`${api}`, {
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
  name.innerText = "";
  const image = document.getElementById("teamimage");
  image.src = "";
  const hackathonTeam = document.getElementById("hackathonteam");
  hackathonTeam.innerText = "";
  const description = document.getElementById("description");
  description.innerText = "";
  const requirement = document.getElementById("requirement");
  requirement.innerText = "";
  const owner = document.getElementById("owner");
  owner.innerText = "";
  const teamSize = document.getElementById("teamsize");
  teamSize.innerText = "";
  const expiredDate = document.getElementById("expireddate");
  expiredDate.innerText = "";
  CreateSkill(data);
}

function CreateSkill(data) {
  data.forEach((element, index) => {
    const skill = document.createElement("div");
    skill.classList.add("skill");
    const radio = document.createElement("input");
    radio.type = "radio"; // no change
    radio.id = `skill${index}`; // no change
    radio.name = "skill"; // no change
    radio.value = "hi"; // id skill
    const label = document.createElement("label");
    label.htmlFor = "h1";
    label.innerText = "Good";
    const skills = document.getElementById("skills");
    skill.appendChild(radio);
    skill.appendChild(label);
    skills.appendChild(skill);
  });
}

async function JoinTeam() {
  const sop = document.getElementById("sop").value;

  const skillRadios = document.getElementsByName("skill");
  let selectedSkill = "";
  for (let radio of skillRadios) {
    if (radio.checked) {
      selectedSkill = radio.value;
      break;
    }
  }
  try {
    const response = await fetch(`${api}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sop, skillRadios }),
    });

    if (!response.ok) {
      throw new Error(`Join Team failed: ${response.status}`);
    }

    window.location.href = `${api}/Home/Explore`;
  } catch (error) {
    CreateErrorBlock("Join Team failed. Please check your data.");
  }
}
