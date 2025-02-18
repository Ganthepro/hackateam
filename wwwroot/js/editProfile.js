const api = "http://localhost:5234";

var changeAvatar = false;

async function Submit() {
  if (changeAvatar) {
    await EditAvatar();
  }
  await EditProfile();
  window.location.href = `${api}/Profile`;
}

async function EditAvatar() {
  const avatarInput = document.getElementById("avatar");
  const avatarFile = avatarInput.files[0];

  const formData = new FormData();
  formData.append("file", avatarFile);

  try {
    const response = await fetch(`${api}/User/avatar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Edit Avatar failed: ${response.status}`);
    }
  } catch (error) {
    CreateErrorBlock(error);
  }
}

async function EditProfile() {
  const fullName = document.getElementById("fullName")?.value;
  const header = document.getElementById("header")?.value;
  const tel = document.getElementById("tel")?.value;

  const data = {};

  if (fullName) {
    data.fullName = fullName;
  }
  if (header) {
    data.header = header;
  }
  if (tel) {
    data.tel = tel;
  }

  if (Object.keys(data).length === 0) return;

  try {
    const response = await fetch(`${api}/User`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Edit Profile failed: ${response.status}`);
    }
  } catch (error) {
    CreateErrorBlock("Edit Profile failed. Please check your information.");
  }
}

document.getElementById("avatar").addEventListener("change", function (event) {
  changeAvatar = true;
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.getElementById("showavatar");
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
