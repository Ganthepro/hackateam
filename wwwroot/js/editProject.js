const api = "http://localhost:5234";

async function EditProfile() {
  const title = document.getElementById("fullName")?.value;
  const description = document.getElementById("header")?.value;
  const skillId = null;

  try {
    const response = await fetch(`${api}/Project`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({ title, description, skillId }),
    });

    if (!response.ok) {
      throw new Error(`Edit Project failed: ${response.status}`);
    }
    window.location.href = `${api}/Profile`;
  } catch (error) {
    CreateErrorBlock("Edit Project failed. Please check your information.");
  }
}
