const api = "http://localhost:5234";

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
    window.location.href = `${api}/Profile`;
  } catch (error) {
    CreateErrorBlock("Edit Profile failed. Please check your information.");
  }
}
