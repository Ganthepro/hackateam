var api = "http://localhost:5234";

document.addEventListener("DOMContentLoaded", async function () {
    await GetNotification();
});

async function GetNotification() {
    try {
        // const response = await fetch(`${api}/Notification`, {
        //   method: "Get",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${getCookie("token")}`,
        //   },
        // });

        // if (!response.ok) {
        //   throw new Error(`Get Notification failed: ${response.status}`);
        // }

        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${api}/Notification`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${getCookie("token")}`);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                if (result.length === 0) {
                    CreateNoMessage();
                } else {
                    CreateMessage(result);
                }
            } else {
                CreateErrorBlock("Get Notification failed");
            }
        };
    } catch (error) {
        CreateErrorBlock(error);
    }
}

function CreateMessage(data) {
    data.forEach((element) => {
        const message = document.createElement("div");
        message.className = "message";

        const messageContent = `
      <div class="notification-detail box-01">
        <label>Team Name</label>
        <p>${element.teamResponse.name}</p>
      </div>
      <div class="notification-detail box-02">
        <label>Hackathon Name</label>
        <p>${element.teamResponse.hackathonName}</p>
      </div>
      <div class="notification-detail box-03">
        <label>Status</label>
        <p>${
          element.type === 0
            ? '<span class="display-noti approved">Approved</span>'
            : '<span class="display-noti rejected">Rejected</span>'
        }
        </p>
      </div>
    `;
        message.innerHTML = messageContent;

        if (element.type === 0) {
            message.onclick = () => GoToTeamInfo(element.teamResponse.id);
            message.style.cursor = "pointer";
        }

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        const deleteButtonContent = `
      <img src="../pictures/delete-icon.svg" alt="delete icon">
    `;
        deleteButton.innerHTML = deleteButtonContent;
        deleteButton.onclick = function (event) {
            event.stopPropagation();
            CreateConfirm(
                `Do you want to delete this?`,
                async function () {
                    await DeleteNotification(element.id);
                    message.remove();
                },
                function () { }
            );
        };

        message.appendChild(deleteButton);

        const container = document.getElementById("messagesContainer");
        container.appendChild(message);
    });
}

function CreateNoMessage() {
  const noNotification = document.createElement("div");
  noNotification.className = "nomessage";
  const image = document.createElement("img");
  image.src = "../pictures/notification/nomessage.png";
  image.alt = "No Notification";
  const message = document.createElement("h4");
  message.innerText = "No Notification";
  image.style.width = "25%";
  noNotification.appendChild(image);
  noNotification.appendChild(message);
  const messages = document.getElementById("messagesContainer");
  noNotification.style.display = "flex";
  noNotification.style.flexDirection = "column";
  noNotification.style.justifyContent = "center";
  noNotification.style.alignItems = "center";
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
