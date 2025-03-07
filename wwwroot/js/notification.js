api = "http://localhost:5234";

document.addEventListener("DOMContentLoaded", async function () {
  await GetNotification();
});

async function GetNotification() {
  try {
    const response = await fetch(`${api}/Notification`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Get Notification failed: ${response.status}`);
    }

    const result = await response.json();
    if (result.length === 0) {
      CreateNoMessage();
    } else {
      CreateMessage(result);
    }
  } catch (error) {
    CreateErrorBlock(error);
  }
}

function CreateMessage(data) {
  data.forEach((element) => {
    const container = document.createElement("div");
    container.className = "contain";
    const message = document.createElement("div");
    const name = document.createElement("h2");
    name.innerText = `${element.teamResponse.name} (${element.teamResponse.hackathonName})`;
    const user = document.createElement("p");
    user.innerText = `${element.userResponse.header} ${
      element.userResponse.fullName
    } ${element.type === 0 ? "Approved" : "Rejected"}`;
    if (element.type === 0) {
      message.onclick = () => GoToTeamInfo(element.teamResponse.id);
      message.style.cursor = "pointer";
    }
    const button = document.createElement("button");
    button.innerText = "X";
    button.className = "delete";
    button.onclick = function (event) {
      event.stopPropagation();
      CreateConfirm(
        `Do you want to delete this?`,
        async function () {
          await DeleteNotification(element.id);
          container.remove();
        },
        function () {}
      );
    };
    message.appendChild(name);
    message.appendChild(user);
    container.appendChild(message);
    container.appendChild(button);
    const messages = document.getElementById("messages");
    messages.appendChild(container);
  });
}

function CreateNoMessage() {
  const noNotification = document.createElement("div");
  noNotification.className = "nomessage";
  const image = document.createElement("img");
  image.src = "../pictures/notification/nomessage.jpg";
  image.alt = "No Notification";
  const message = document.createElement("h4");
  message.innerText = "No Notification";
  noNotification.appendChild(image);
  noNotification.appendChild(message);
  const messages = document.getElementById("messages");
  messages.appendChild(noNotification);
}

async function DeleteNotification(id) {
  try {
    const response = await fetch(`${api}/Notification/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Delete Notification failed: ${response.status}`);
    }
  } catch (error) {
    CreateErrorBlock("Delete Notification failed");
  }
}

function GoToTeamInfo(id) {
  window.location.href = `${api}/Teams/Info?id=${id}`;
}
