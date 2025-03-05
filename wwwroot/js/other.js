api = "http://localhost:5234";

var showMore = false;
var project;

document.addEventListener("DOMContentLoaded", function () {
  Profile();
  Project();
});

async function Profile() {
  const id = document.getElementById("userId").dataset.id;
  try {
    const response = await fetch(`${api}/User/${id}`, {
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
    CreateErrorBlock("Get Profile failed. Please check your data.");
  }
}

function ShowData(data) {
  LoadAvatar();
  const fullname = document.getElementById("fullname");
  fullname.innerHTML = `<strong>Fullname:</strong> ${data.header} ${data.fullName}`;
  const tel = document.getElementById("tel");
  tel.innerHTML = `<strong>Tel:</strong> ${data.tel}`;
  const email = document.getElementById("email");
  email.innerHTML = `<strong>Email:</strong> ${data.email}`;
}

async function Project() {
  const userId = document.getElementById("userId").dataset.id;

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
    CreateErrorBlock(error);
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
    const description = document.createElement("p");
    description.innerHTML = `<strong>Description:</strong> ${element.description}`;
    const skill = document.createElement("p");
    skill.innerHTML = `<strong>Description:</strong> ${element.skillResponse.title}`;
    article.appendChild(title);
    article.appendChild(description);
    article.appendChild(skill);
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

async function LoadAvatar() {
  const image = document.getElementById("avatar");
  try {
    const response = await fetch(`${api}/User/${userId}/avatar`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });
    await response.json();
    image.src = `${api}/User/${userId}/avatar`;
  } catch (error) {
    image.src =
      "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png";
  }
}
