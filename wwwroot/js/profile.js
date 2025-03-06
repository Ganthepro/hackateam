api = "http://localhost:5234";

var showMore = false;
var project;
var userId = null;

document.addEventListener("DOMContentLoaded", async function () {
  await Profile();
  await Project();
});

async function Profile() {
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
    ShowData(data);
  } catch (error) {
    CreateErrorBlock("Get Profile failed");
  }
}

function ShowData(data) {
  const image = document.getElementById("avatar");
  image.src = `${api}/User/${data.id}/avatar`;
  userId = data.id;
  const fullname = document.getElementById("fullname");
  fullname.innerHTML = `<strong>Fullname:</strong> ${data.header} ${data.fullName}`;
  const tel = document.getElementById("tel");
  tel.innerHTML = `<strong>Tel:</strong> ${data.tel}`;
  const email = document.getElementById("email");
  email.innerHTML = `<strong>Email:</strong> ${data.email}`;
}

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
