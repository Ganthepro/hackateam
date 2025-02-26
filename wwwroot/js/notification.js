api = "http://localhost:5234";

document.addEventListener("DOMContentLoaded", async function () {
  await GetNotification(1);
});

async function GetNotification(userId) {
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
    const message = document.createElement("div");
    message.className = "message";
    const name = document.createElement("h2");
    name.innerText = element.teamResponse.hackathonName;
    const user = document.createElement("p");
    user.innerText = `${element.userResponse.fullName} ${element.type === 0 ? "Approved" : "Rejected"}`;
    message.appendChild(name);
    message.appendChild(user);
    const messages = document.getElementById("messages");
    messages.appendChild(message);
  });
}

function CreateNoMessage() {
  const noNotification = document.createElement("div");
  noNotification.className = "nomessage";
  const image = document.createElement("img");
  image.src =
    "https://static.vecteezy.com/system/resources/thumbnails/014/814/039/small/a-well-designed-flat-icon-of-no-notification-yet-vector.jpg";
  image.alt = "No Notification";
  const message = document.createElement("h4");
  message.innerText = "No Notification";
  noNotification.appendChild(image);
  noNotification.appendChild(message);
  const messages = document.getElementById("messages");
  messages.appendChild(noNotification);
}
