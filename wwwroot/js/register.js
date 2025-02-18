const api = "http://localhost:5234";

async function Register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullName = document.getElementById("fullName").value;
  const header = document.getElementById("header").value;
  const tel = document.getElementById("tel").value;
  try {
    const response = await fetch(`${api}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, fullName, header, tel }),
    });

    if (!response.ok) {
      throw new Error(`Register failed: ${response.status}`);
    }

    const result = await response.json();
    setCookie("token", result.token, 6);
    window.location.href = `${api}/Home/Explore`;
  } catch (error) {
    CreateErrorBlock("Register failed. Please check your information.");
  }
}
